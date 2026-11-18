import {
  VideoPreset,
  VideoQuality,
  type ScreenShareCaptureOptions,
  type TrackPublishOptions,
  type VideoCaptureOptions,
} from "livekit-client";

const KEY = "coliseum.media-quality";

export const qualityLevels = ["standard", "high", "max"] as const;
export const screenContents = ["detail", "motion"] as const;
export const receiveQualities = ["max", "balanced", "saver"] as const;

export type QualityLevel = (typeof qualityLevels)[number];
export type ScreenContent = (typeof screenContents)[number];
export type ReceiveQuality = (typeof receiveQualities)[number];

export type MediaQualityPrefs = {
  voice: QualityLevel;
  camera: QualityLevel;
  screen: QualityLevel;
  screenContent: ScreenContent;
  receive: ReceiveQuality;
};

export type MediaQualityKey = keyof MediaQualityPrefs;

export const DEFAULT_MEDIA_QUALITY: MediaQualityPrefs = {
  voice: "high",
  camera: "high",
  screen: "high",
  screenContent: "detail",
  receive: "max",
};

type VideoLevel = { width: number; height: number; frameRate: number; maxBitrate: number };

const SCREEN_LEVELS: Record<QualityLevel, VideoLevel> = {
  standard: { width: 1280, height: 720, frameRate: 30, maxBitrate: 3_000_000 },
  high: { width: 1920, height: 1080, frameRate: 30, maxBitrate: 8_000_000 },
  max: { width: 2560, height: 1440, frameRate: 30, maxBitrate: 16_000_000 },
};

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
      screen: pick(value.screen, qualityLevels, DEFAULT_MEDIA_QUALITY.screen),
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
  prefs: Pick<MediaQualityPrefs, "screen" | "screenContent">,
  userAgent = globalThis.navigator?.userAgent ?? "",
): Pick<ScreenShareCaptureOptions, "resolution" | "contentHint"> {
  const { width, height, frameRate } = SCREEN_LEVELS[prefs.screen];
  return {
    contentHint: prefs.screenContent,
    ...(ignoresCaptureResolution(userAgent) ? {} : { resolution: { width, height, frameRate } }),
  };
}

/** Keeps one smaller layer so the server can protect viewers on weak connections. */
export function screenPublishOptions(
  prefs: Pick<MediaQualityPrefs, "screen" | "screenContent">,
): TrackPublishOptions {
  const { width, height, frameRate, maxBitrate } = SCREEN_LEVELS[prefs.screen];
  return {
    simulcast: true,
    screenShareEncoding: { maxBitrate, maxFramerate: frameRate, priority: "high" },
    screenShareSimulcastLayers: [
      new VideoPreset(
        Math.round(width / 2),
        Math.round(height / 2),
        Math.round(maxBitrate / 6),
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
