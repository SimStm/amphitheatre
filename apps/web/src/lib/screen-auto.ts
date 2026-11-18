import type { LocalVideoTrack } from "livekit-client";
import {
  AUTO_SCREEN_START_TIER,
  autoScreenTiers,
  lowerLayerBitrate,
  type AutoScreenTier,
  type ScreenContent,
} from "./media-quality.ts";

const SAMPLE_MS = 3_000;
const STABLE_SAMPLES_TO_RISE = 5;
const MIN_MS_BETWEEN_DROPS = 6_000;
const HOLD_AFTER_DROP_MS = 60_000;
const LONGEST_HOLD_MS = 300_000;
const SAME_PROBLEM_MS = 30_000;
const FORGET_DROPS_AFTER_MS = 600_000;
/** The browser's estimate stops near the current limit, so it only gates the next step. */
const MIN_ESTIMATE_TO_RISE = 0.8;
const MAX_LOSS_RATIO = 0.05;
const MAX_RTT_RISE_MS = 150;

export type AutoScreenSample = {
  sentBps: number;
  availableBps?: number;
  limitation?: string;
  lossRatio?: number;
  rttMs?: number;
};

export type AutoScreenState = {
  tier: number;
  stableSamples: number;
  lastDropAt: number;
  holdUntil: number;
  recentDrops: number;
  lowestRttMs?: number;
};

export function initialAutoScreenState(): AutoScreenState {
  return {
    tier: AUTO_SCREEN_START_TIER,
    stableSamples: 0,
    lastDropAt: Number.NEGATIVE_INFINITY,
    holdUntil: 0,
    recentDrops: 0,
  };
}

export function isConnectionStrained(sample: AutoScreenSample, lowestRttMs?: number): boolean {
  if (sample.limitation === "bandwidth" || sample.limitation === "cpu") return true;
  if ((sample.lossRatio ?? 0) > MAX_LOSS_RATIO) return true;
  return (
    sample.rttMs !== undefined &&
    lowestRttMs !== undefined &&
    sample.rttMs - lowestRttMs > MAX_RTT_RISE_MS
  );
}

function canCarryNextTier(sample: AutoScreenSample, currentBitrate: number): boolean {
  return (
    sample.availableBps === undefined || sample.availableBps >= currentBitrate * MIN_ESTIMATE_TO_RISE
  );
}

export function nextAutoScreenState(
  state: AutoScreenState,
  sample: AutoScreenSample,
  now: number,
  highestTier: number,
  tierBitrate = 0,
): AutoScreenState {
  const lowestRttMs =
    sample.rttMs === undefined
      ? state.lowestRttMs
      : Math.min(sample.rttMs, state.lowestRttMs ?? sample.rttMs);
  const tier = Math.min(state.tier, highestTier);
  const base = { ...state, tier, lowestRttMs };

  if (isConnectionStrained(sample, state.lowestRttMs)) {
    if (tier === 0 || now - state.lastDropAt < MIN_MS_BETWEEN_DROPS) {
      return { ...base, stableSamples: 0 };
    }
    const sinceDrop = now - state.lastDropAt;
    const repeats =
      sinceDrop > FORGET_DROPS_AFTER_MS
        ? 0
        : sinceDrop <= SAME_PROBLEM_MS
          ? state.recentDrops
          : state.recentDrops + 1;
    const hold = Math.min(HOLD_AFTER_DROP_MS * 2 ** repeats, LONGEST_HOLD_MS);
    return {
      ...base,
      tier: tier - 1,
      stableSamples: 0,
      lastDropAt: now,
      holdUntil: now + hold,
      recentDrops: repeats,
    };
  }

  const stableSamples = state.stableSamples + 1;
  if (
    stableSamples >= STABLE_SAMPLES_TO_RISE &&
    tier < highestTier &&
    now >= state.holdUntil &&
    canCarryNextTier(sample, tierBitrate)
  ) {
    return { ...base, tier: tier + 1, stableSamples: 0 };
  }
  return { ...base, stableSamples };
}

type Totals = { bytesSent: number; at: number };

function topEncoding(parameters: RTCRtpSendParameters): RTCRtpEncodingParameters | undefined {
  return parameters.encodings.find((encoding) => encoding.rid === "h") ?? parameters.encodings.at(-1);
}

async function readSample(sender: RTCRtpSender, previous: Totals | null) {
  const stats = await sender.getStats();
  const reports = [...stats.values()] as Array<Record<string, unknown>>;
  const outbound = reports.filter((report) => report.type === "outbound-rtp");
  const top = outbound.find((report) => report.rid === "h") ?? outbound.at(-1);
  const remote = reports.find(
    (report) => report.type === "remote-inbound-rtp" && report.ssrc === top?.ssrc,
  );
  const pair = reports.find(
    (report) => report.type === "candidate-pair" && report.nominated === true,
  );
  const bytesSent = outbound.reduce((sum, report) => sum + Number(report.bytesSent ?? 0), 0);
  const totals: Totals = { bytesSent, at: performance.now() };
  const seconds = previous ? (totals.at - previous.at) / 1000 : 0;
  const sample: AutoScreenSample = {
    sentBps: seconds > 0 ? ((bytesSent - (previous?.bytesSent ?? 0)) * 8) / seconds : 0,
    availableBps: typeof pair?.availableOutgoingBitrate === "number" ? pair.availableOutgoingBitrate : undefined,
    limitation: typeof top?.qualityLimitationReason === "string" ? top.qualityLimitationReason : undefined,
    lossRatio: typeof remote?.fractionLost === "number" ? remote.fractionLost : undefined,
    rttMs: typeof remote?.roundTripTime === "number" ? remote.roundTripTime * 1000 : undefined,
  };
  return { sample, totals };
}

async function applyTier(track: LocalVideoTrack, sender: RTCRtpSender, tier: AutoScreenTier) {
  const parameters = sender.getParameters();
  const encoding = topEncoding(parameters);
  if (!encoding) return;
  const fallback = parameters.encodings.find((item) => item.rid === "q");
  if (fallback && fallback !== encoding) fallback.maxBitrate = lowerLayerBitrate(tier.maxBitrate);
  const sourceHeight = track.mediaStreamTrack.getSettings().height ?? tier.height;
  encoding.maxBitrate = tier.maxBitrate;
  encoding.maxFramerate = tier.frameRate;
  encoding.scaleResolutionDownBy = Math.max(1, sourceHeight / tier.height);
  await sender.setParameters(parameters);
}

/** Keeps a shared screen at the best level the connection and computer can hold. */
export function startAutoScreenQuality(
  track: LocalVideoTrack,
  content: ScreenContent,
  onTier: (tier: AutoScreenTier) => void,
): () => void {
  const tiers = autoScreenTiers(content);
  const highestTier = tiers.length - 1;
  let state = initialAutoScreenState();
  let totals: Totals | null = null;
  let stopped = false;
  let running = false;
  onTier(tiers[state.tier]);

  const timer = window.setInterval(() => {
    const sender = track.sender;
    if (running || !sender) return;
    if (!topEncoding(sender.getParameters())?.active) {
      totals = null;
      return;
    }
    running = true;
    void (async () => {
      try {
        const read = await readSample(sender, totals);
        const measured = totals !== null;
        totals = read.totals;
        if (stopped || !measured) return;
        const next = nextAutoScreenState(
          state,
          read.sample,
          performance.now(),
          highestTier,
          tiers[state.tier].maxBitrate,
        );
        const changed = next.tier !== state.tier;
        state = next;
        if (!changed) return;
        await applyTier(track, sender, tiers[next.tier]);
        if (!stopped) onTier(tiers[next.tier]);
      } catch {
        /* the sender can be replaced while the share ends or reconnects */
      } finally {
        running = false;
      }
    })();
  }, SAMPLE_MS);

  return () => {
    stopped = true;
    window.clearInterval(timer);
  };
}
