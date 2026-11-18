import { describe, expect, test } from "bun:test";
import { VideoQuality } from "livekit-client";
import {
  cameraCaptureOptions,
  cameraPublishOptions,
  DEFAULT_MEDIA_QUALITY,
  parseMediaQuality,
  requestedVideoQuality,
  screenCaptureOptions,
  SCREEN_USAGE_GUIDE,
  screenPublishOptions,
  screenUsage,
  voicePublishOptions,
} from "./media-quality.ts";

describe("parseMediaQuality", () => {
  test("uses the defaults without a saved value or with broken data", () => {
    expect(parseMediaQuality(null)).toEqual(DEFAULT_MEDIA_QUALITY);
    expect(parseMediaQuality("{broken")).toEqual(DEFAULT_MEDIA_QUALITY);
  });

  test("keeps valid choices and replaces unknown ones", () => {
    const prefs = parseMediaQuality(JSON.stringify({ screen: "max", voice: "loud", receive: "saver" }));
    expect(prefs).toEqual({ ...DEFAULT_MEDIA_QUALITY, screen: "max", receive: "saver" });
  });
});

describe("publish options", () => {
  test("high screen quality is 1080p at 30 fps with a smaller fallback layer", () => {
    const prefs = { ...DEFAULT_MEDIA_QUALITY, screen: "high" } as const;
    const capture = screenCaptureOptions(prefs, "Chrome");
    const publish = screenPublishOptions(prefs);
    expect(capture.resolution).toMatchObject({ width: 1920, height: 1080, frameRate: 30 });
    expect(capture.contentHint).toBe("detail");
    expect(publish.screenShareEncoding).toMatchObject({ maxBitrate: 8_000_000, maxFramerate: 30 });
    expect(publish.screenShareSimulcastLayers?.[0]).toMatchObject({ width: 960, height: 540 });
    expect(publish.degradationPreference).toBe("maintain-resolution");
  });

  test("video content favors smooth playback", () => {
    const prefs = { screen: "high", screenFps: "30", screenContent: "motion" } as const;
    expect(screenCaptureOptions(prefs, "Chrome").contentHint).toBe("motion");
    expect(screenPublishOptions(prefs).degradationPreference).toBe("balanced");
  });

  test("60 fps raises the frame rate and bitrate", () => {
    const prefs = { screen: "high", screenFps: "60", screenContent: "motion" } as const;
    expect(screenCaptureOptions(prefs, "Chrome").resolution?.frameRate).toBe(60);
    expect(screenPublishOptions(prefs).screenShareEncoding).toMatchObject({
      maxBitrate: 12_000_000,
      maxFramerate: 60,
    });
  });

  test("automatic quality starts safely and captures what it may reach", () => {
    const text = { screen: "auto", screenFps: "30", screenContent: "detail" } as const;
    const video = { ...text, screenContent: "motion" } as const;
    expect(screenPublishOptions(text).screenShareEncoding).toMatchObject({
      maxBitrate: 5_000_000,
      maxFramerate: 30,
    });
    expect(screenCaptureOptions(text, "Chrome").resolution?.frameRate).toBe(30);
    expect(screenCaptureOptions(video, "Chrome").resolution?.frameRate).toBe(60);
  });

  test("usage warns about heavy choices", () => {
    expect(screenUsage({ screen: "standard", screenFps: "30", screenContent: "detail" })).toEqual({
      uploadMbps: 4,
      recommendedMbps: 6,
      heavy: false,
    });
    expect(screenUsage({ screen: "max", screenFps: "60", screenContent: "motion" }).heavy).toBe(true);
    expect(SCREEN_USAGE_GUIDE.map((row) => row.recommendedMbps)).toEqual([6, 15, 25, 45]);
  });

  test("Safari 17 does not request a capture resolution", () => {
    const agent = "Mozilla/5.0 (Macintosh) Version/17.4 Safari/605.1.15";
    expect(screenCaptureOptions(DEFAULT_MEDIA_QUALITY, agent).resolution).toBeUndefined();
  });

  test("camera and voice follow the chosen level", () => {
    expect(cameraCaptureOptions("max").resolution).toMatchObject({ width: 1920, height: 1080 });
    expect(cameraPublishOptions("standard").videoEncoding?.maxBitrate).toBe(1_200_000);
    expect(voicePublishOptions("high")).toMatchObject({ audioPreset: { maxBitrate: 64_000 }, dtx: true });
    expect(voicePublishOptions("max")).toMatchObject({ audioPreset: { maxBitrate: 128_000 }, dtx: false });
  });
});

describe("requestedVideoQuality", () => {
  test("streams on the stage follow the viewing choice", () => {
    expect(requestedVideoQuality("max", true)).toBe(VideoQuality.HIGH);
    expect(requestedVideoQuality("balanced", true)).toBe(VideoQuality.MEDIUM);
    expect(requestedVideoQuality("saver", true)).toBe(VideoQuality.LOW);
  });

  test("streams off the stage use the lowest layer", () => {
    expect(requestedVideoQuality("max", false)).toBe(VideoQuality.LOW);
  });
});
