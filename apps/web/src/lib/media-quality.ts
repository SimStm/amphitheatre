import {
  VideoPreset,
  VideoQuality,
  type ScreenShareCaptureOptions,
  type TrackPublishOptions,
  type VideoCaptureOptions,
} from "livekit-client";

const KEY = "coliseum.media-quality";

export const qualityLevels = ["standard", "high", "max"] as const;
export const screenQualities = ["auto", ...qualityLevels] as const;
export const screenFrameRates = ["30", "60"] as const;
export const screenContents = ["detail", "motion"] as const;
export const receiveQualities = ["max", "balanced", "saver"] as const;

export type QualityLevel = (typeof qualityLevels)[number];
export type ScreenQuality = (typeof screenQualities)[number];
export type ScreenFrameRate = (typeof screenFrameRates)[number];
export type ScreenContent = (typeof screenContents)[number];
export type ReceiveQuality = (typeof receiveQualities)[number];

export type MediaQualityPrefs = {
  voice: QualityLevel;
  camera: QualityLevel;
  screen: ScreenQuality;
  screenFps: ScreenFrameRate;
  screenContent: ScreenContent;
  receive: ReceiveQuality;
};

export type ScreenChoice = Pick<MediaQualityPrefs, "screen" | "screenFps" | "screenContent">;

export type MediaQualityKey = keyof MediaQualityPrefs;

export const DEFAULT_MEDIA_QUALITY: MediaQualityPrefs = {
  voice: "high",
  camera: "high",
  screen: "auto",
  screenFps: "30",
  screenContent: "detail",
  receive: "max",
};

type VideoLevel = { width: number; height: number; frameRate: number; maxBitrate: number };

const SCREEN_SIZES: Record<QualityLevel, { width: number; height: number }> = {
  standard: { width: 1280, height: 720 },
  high: { width: 1920, height: 1080 },
  max: { width: 2560, height: 1440 },
};

const SCREEN_BITRATES: Record<QualityLevel, Record<ScreenFrameRate, number>> = {
  standard: { "30": 3_000_000, "60": 5_000_000 },
  high: { "30": 8_000_000, "60": 12_000_000 },
  max: { "30": 16_000_000, "60": 24_000_000 },
};

/** Megabits per second, including the smaller layer and shared audio. */
const SCREEN_USAGE: Record<QualityLevel, Record<ScreenFrameRate, ScreenUsage>> = {
  standard: {
    "30": { uploadMbps: 4, recommendedMbps: 6, heavy: false },
    "60": { uploadMbps: 6, recommendedMbps: 10, heavy: false },
  },
  high: {
    "30": { uploadMbps: 10, recommendedMbps: 15, heavy: false },
    "60": { uploadMbps: 15, recommendedMbps: 25, heavy: true },
  },
  max: {
    "30": { uploadMbps: 20, recommendedMbps: 30, heavy: true },
    "60": { uploadMbps: 30, recommendedMbps: 45, heavy: true },
  },
};

export type ScreenUsage = { uploadMbps: number; recommendedMbps: number; heavy: boolean };

function screenLevel({ screen, screenFps, screenContent }: ScreenChoice): VideoLevel {
  if (screen === "auto") {
    const top = autoScreenTiers(screenContent).at(-1) ?? AUTO_SCREEN_TIERS[0];
    return { width: 1920, height: 1080, frameRate: top.frameRate, maxBitrate: top.maxBitrate };
  }
  return {
    ...SCREEN_SIZES[screen],
    frameRate: Number(screenFps),
    maxBitrate: SCREEN_BITRATES[screen][screenFps],
  };
}

/** Plain guide for the settings popover, from the lightest to the heaviest choice. */
export const SCREEN_USAGE_GUIDE = [
  { level: "standard", fps: "30" },
  { level: "high", fps: "30" },
  { level: "high", fps: "60" },
  { level: "max", fps: "60" },
].map(({ level, fps }) => {
  const key = level as QualityLevel;
  const frameRate = fps as ScreenFrameRate;
  return {
    height: SCREEN_SIZES[key].height,
    fps: frameRate,
    recommendedMbps: SCREEN_USAGE[key][frameRate].recommendedMbps,
  };
});

export function screenUsage(choice: ScreenChoice): ScreenUsage {
  if (choice.screen !== "auto") return SCREEN_USAGE[choice.screen][choice.screenFps];
  return SCREEN_USAGE.high[choice.screenContent === "motion" ? "60" : "30"];
}

const CAMERA_LEVELS: Record<QualityLevel, VideoLevel> = {
  standard: { width: 960, height: 540, frameRate: 30, maxBitrate: 1_200_000 },
  high: { width: 1280, height: 720, frameRate: 30, maxBitrate: 2_500_000 },
  max: { width: 1920, height: 1080, frameRate: 30, maxBitrate: 5_000_000 },
};

const VOICE_LEVELS: Record<QualityLevel, { maxBitrate: number; dtx: boolean }> = {
  standard: { maxBitrate: 24_000, dtx: true },
  high: { maxBitrate: 64_000, dtx: true },
  max: { maxBitrate: 128_000, dtx: false },
};

const SCREEN_AUDIO_BITRATE = 128_000;

export type AutoScreenTier = { height: number; frameRate: number; maxBitrate: number };

export const AUTO_SCREEN_TIERS: readonly AutoScreenTier[] = [
  { height: 720, frameRate: 30, maxBitrate: 2_500_000 },
  { height: 1080, frameRate: 30, maxBitrate: 5_000_000 },
  { height: 1080, frameRate: 30, maxBitrate: 8_000_000 },
  { height: 1080, frameRate: 60, maxBitrate: 12_000_000 },
];

export const AUTO_SCREEN_START_TIER = 1;

/** Text does not gain from 60 fps, so only video and games can reach it. */
export function autoScreenTiers(content: ScreenContent): readonly AutoScreenTier[] {
  return content === "motion" ? AUTO_SCREEN_TIERS : AUTO_SCREEN_TIERS.slice(0, 3);
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function parseMediaQuality(raw: string | null): MediaQualityPrefs {
  if (!raw) return { ...DEFAULT_MEDIA_QUALITY };
  try {
    const value = JSON.parse(raw) as Partial<Record<MediaQualityKey, unknown>>;
    return {
      voice: pick(value.voice, qualityLevels, DEFAULT_MEDIA_QUALITY.voice),
      camera: pick(value.camera, qualityLevels, DEFAULT_MEDIA_QUALITY.camera),
      screen: pick(value.screen, screenQualities, DEFAULT_MEDIA_QUALITY.screen),
      screenFps: pick(value.screenFps, screenFrameRates, DEFAULT_MEDIA_QUALITY.screenFps),
      screenContent: pick(value.screenContent, screenContents, DEFAULT_MEDIA_QUALITY.screenContent),
      receive: pick(value.receive, receiveQualities, DEFAULT_MEDIA_QUALITY.receive),
    };
  } catch {
    return { ...DEFAULT_MEDIA_QUALITY };
  }
}

export function readMediaQuality(): MediaQualityPrefs {
  try {
    return parseMediaQuality(localStorage.getItem(KEY));
  } catch {
    return { ...DEFAULT_MEDIA_QUALITY };
  }
}

export function writeMediaQuality(prefs: MediaQualityPrefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* private mode: the choice lasts until the page closes */
  }
}

export function voicePublishOptions(level: QualityLevel): TrackPublishOptions {
  const { maxBitrate, dtx } = VOICE_LEVELS[level];
  return { audioPreset: { maxBitrate }, dtx, red: true };
}

export function cameraCaptureOptions(level: QualityLevel): VideoCaptureOptions {
  const { width, height, frameRate } = CAMERA_LEVELS[level];
  return { resolution: { width, height, frameRate } };
}

export function cameraPublishOptions(level: QualityLevel): TrackPublishOptions {
  const { maxBitrate, frameRate } = CAMERA_LEVELS[level];
  return { simulcast: true, videoEncoding: { maxBitrate, maxFramerate: frameRate } };
}

/** Safari 17 captures at a low resolution when any resolution is requested. */
function ignoresCaptureResolution(userAgent: string): boolean {
  return /Version\/17\.[\d.]+ .*Safari\//.test(userAgent);
}

export function screenCaptureOptions(
  prefs: ScreenChoice,
  userAgent = globalThis.navigator?.userAgent ?? "",
): Pick<ScreenShareCaptureOptions, "resolution" | "contentHint"> {
  const { width, height, frameRate } = screenLevel(prefs);
  return {
    contentHint: prefs.screenContent,
    ...(ignoresCaptureResolution(userAgent) ? {} : { resolution: { width, height, frameRate } }),
  };
}

export function lowerLayerBitrate(topBitrate: number): number {
  return Math.round(topBitrate / 6);
}

/** Keeps one smaller layer so the server can protect viewers on weak connections. */
export function screenPublishOptions(prefs: ScreenChoice): TrackPublishOptions {
  const level = screenLevel(prefs);
  const { width, height } = level;
  const start = prefs.screen === "auto" ? AUTO_SCREEN_TIERS[AUTO_SCREEN_START_TIER] : level;
  const { maxBitrate, frameRate } = start;
  return {
    simulcast: true,
    screenShareEncoding: { maxBitrate, maxFramerate: frameRate, priority: "high" },
    screenShareSimulcastLayers: [
      new VideoPreset(
        Math.round(width / 2),
        Math.round(height / 2),
        lowerLayerBitrate(maxBitrate),
        15,
        "medium",
      ),
    ],
    degradationPreference: prefs.screenContent === "detail" ? "maintain-resolution" : "balanced",
    audioPreset: { maxBitrate: SCREEN_AUDIO_BITRATE },
    dtx: false,
    red: false,
  };
}

/** The highest layer to request. The server still lowers it for a weak connection. */
export function requestedVideoQuality(receive: ReceiveQuality, onStage: boolean): VideoQuality {
  if (!onStage || receive === "saver") return VideoQuality.LOW;
  return receive === "balanced" ? VideoQuality.MEDIUM : VideoQuality.HIGH;
}
