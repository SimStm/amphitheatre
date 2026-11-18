import { Track, type RemoteTrack, type ScreenShareCaptureOptions } from "livekit-client";

/** Capture screen/window/tab and offer tab or system audio in Chromium's picker. */
export const SCREEN_SHARE_CAPTURE_OPTIONS: ScreenShareCaptureOptions = {
  audio: {
    autoGainControl: false,
    echoCancellation: false,
    noiseSuppression: false,
    channelCount: 2,
    restrictOwnAudio: true,
  },
  systemAudio: "include",
  selfBrowserSurface: "include",
  surfaceSwitching: "include",
};

export function isRemoteAudioTrack(track: { kind: Track.Kind }): boolean {
  return track.kind === Track.Kind.Audio;
}

export function isDisplayMediaCancelled(err: unknown): boolean {
  let current: unknown = err;
  for (let i = 0; i < 4 && current; i++) {
    if (typeof DOMException !== "undefined" && current instanceof DOMException) {
      if (current.name === "NotAllowedError" || current.name === "AbortError") return true;
    }
    if (current instanceof Error) {
      if (current.name === "NotAllowedError" || current.name === "AbortError") return true;
      current = current.cause;
      continue;
    }
    break;
  }
  return false;
}

/**
 * Remote audio is a separate LiveKit track from camera/screen video.
 * Speaking indicators use RTP levels; playback still needs attach() + startAudio().
 */
export function attachRemoteAudio(track: RemoteTrack): HTMLMediaElement {
  const el = track.attach();
  el.autoplay = true;
  if (!el.isConnected) {
    document.body.appendChild(el);
  }
  return el;
}

export function detachRemoteAudio(track: RemoteTrack): void {
  for (const el of track.detach()) {
    el.remove();
  }
}
