import {
  ConnectionQuality,
  Room,
  RemoteAudioTrack,
  RoomEvent,
  Track,
  type LocalTrackPublication,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type Participant,
} from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getLivekitToken } from "../lib/api.ts";
import { readDevicePrefs } from "../lib/device-prefs.ts";
import i18n from "../lib/i18n.ts";
import {
  attachRemoteAudio,
  detachRemoteAudio,
  isDisplayMediaCancelled,
  isRemoteAudioTrack,
  SCREEN_SHARE_CAPTURE_OPTIONS,
} from "../lib/livekit-media.ts";
import { classifyGetUserMediaError, mediaFailureToastKey } from "../lib/media-permissions.ts";
import type { ParticipantMedia } from "../shared-types.ts";
import { useRoomStore } from "../stores/room-store.ts";

const AUDIO_BLOCKED_TOAST = "livekit-audio-blocked";

async function unlockPlayback(room: Room): Promise<void> {
  try {
    await room.startAudio();
  } catch {
    /* browser autoplay policy; toast + next gesture retry */
  }
}

function detachAllRemoteAudio(room: Room): void {
  room.remoteParticipants.forEach((participant) => {
    participant.audioTrackPublications.forEach((pub) => {
      if (pub.track) detachRemoteAudio(pub.track);
    });
  });
}

export type MediaDeviceKindName = "audioinput" | "audiooutput" | "videoinput";

export type StageTile = {
  id: string;
  identity: string;
  name: string;
  source: "camera" | "screen";
  isLocal: boolean;
  track: Track;
};

function mapQuality(quality: ConnectionQuality): ParticipantMedia["quality"] {
  switch (quality) {
    case ConnectionQuality.Excellent:
      return "excellent";
    case ConnectionQuality.Good:
      return "good";
    case ConnectionQuality.Poor:
      return "poor";
    case ConnectionQuality.Lost:
      return "lost";
    default:
      return "unknown";
  }
}

function microphoneState(participant: Participant): ParticipantMedia["mic"] {
  const publication = participant.getTrackPublication(Track.Source.Microphone);
  if (!publication) return "none";
  return publication.isMuted ? "muted" : "on";
}

function publicationFlags(participant: Participant) {
  let camera = false;
  let screen = false;
  participant.videoTrackPublications.forEach((pub) => {
    if (!isActiveVideoPublication(pub, participant.isLocal)) return;
    if (pub.source === Track.Source.ScreenShare) screen = true;
    if (pub.source === Track.Source.Camera) camera = true;
  });
  return { camera, screen };
}

function applyRemoteVolume(room: Room, volume: number, localMutedUserIds: Record<string, true>) {
  room.remoteParticipants.forEach((participant) => {
    const muted = Boolean(localMutedUserIds[participant.identity]);
    applyParticipantVolume(participant, volume, muted);
  });
}

function applyParticipantVolume(
  participant: RemoteParticipant,
  volume: number,
  locallyMuted: boolean,
) {
  const outOfVoice = useRoomStore.getState().voiceLeft;
  participant.audioTrackPublications.forEach((pub) => {
    if (!(pub.audioTrack instanceof RemoteAudioTrack)) return;
    const streamAudio = pub.source === Track.Source.ScreenShareAudio;
    const silent = locallyMuted || (outOfVoice && !streamAudio);
    pub.audioTrack.setVolume(silent ? 0 : volume);
  });
}

function syncVoiceUsers(room: Room) {
  const ids = [room.localParticipant.identity];
  room.remoteParticipants.forEach((participant) => ids.push(participant.identity));
  useRoomStore.getState().setVoiceUsers(ids.filter(Boolean));
}

async function applySavedDevices(room: Room) {
  const prefs = readDevicePrefs();
  const localMutedUserIds = useRoomStore.getState().localMutedUserIds;
  try {
    if (prefs.audioinput) await room.switchActiveDevice("audioinput", prefs.audioinput);
    if (prefs.videoinput) await room.switchActiveDevice("videoinput", prefs.videoinput);
    if (prefs.audiooutput) await room.switchActiveDevice("audiooutput", prefs.audiooutput);
  } catch {
    /* device may have been unplugged */
  }
  applyRemoteVolume(room, prefs.outputVolume, localMutedUserIds);
  applyInputVolume(room, prefs.inputVolume);
}

function applyInputVolume(room: Room, volume: number) {
  room.localParticipant.audioTrackPublications.forEach((pub) => {
    if (pub.source !== Track.Source.Microphone) return;
    const track = pub.audioTrack as { setVolume?: (next: number) => void } | null;
    track?.setVolume?.(volume);
  });
}

function isActiveVideoPublication(
  pub: { track?: Track | null; isMuted: boolean; isSubscribed?: boolean; source: Track.Source },
  isLocal: boolean,
): boolean {
  const track = pub.track;
  if (!track || pub.isMuted) return false;
  if (!isLocal && pub.isSubscribed === false) return false;
  const media = track.mediaStreamTrack;
  if (media && media.readyState === "ended") return false;
  return true;
}

export function useLivekitRoom(roomId: string | undefined, enabled: boolean) {
  const roomRef = useRef<Room | null>(null);
  const [tiles, setTiles] = useState<StageTile[]>([]);
  const localMutedUserIds = useRoomStore((s) => s.localMutedUserIds);
  const voiceLeft = useRoomStore((s) => s.voiceLeft);

  const refreshTiles = useCallback((room: Room) => {
    const next: StageTile[] = [];
    const collect = (participant: Participant, isLocal: boolean) => {
      participant.videoTrackPublications.forEach((pub) => {
        if (!isActiveVideoPublication(pub, isLocal)) return;
        const track = pub.track;
        if (!track) return;
        const screen = pub.source === Track.Source.ScreenShare;
        next.push({
          id: `${participant.identity}-${pub.trackSid}`,
          identity: participant.identity,
          name: participant.name || participant.identity,
          source: screen ? "screen" : "camera",
          isLocal,
          track,
        });
      });
    };
    collect(room.localParticipant, true);
    room.remoteParticipants.forEach((participant) => collect(participant, false));
    setTiles(next);
  }, []);

  const syncParticipant = useCallback((participant: Participant) => {
    const flags = publicationFlags(participant);
    useRoomStore.getState().setMedia(participant.identity, {
      speaking: participant.isSpeaking,
      audioLevel: participant.audioLevel,
      camera: flags.camera,
      screen: flags.screen,
      mic: microphoneState(participant),
      quality: mapQuality(participant.connectionQuality),
    });
  }, []);

  useEffect(() => {
    if (!roomId || !enabled) return;
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      webAudioMix: true,
    });
    roomRef.current = room;
    let stopped = false;
    const store = useRoomStore.getState();
    store.setLivekitStatus("connecting");

    const onMedia = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      syncParticipant(participant);
      if (isRemoteAudioTrack(track)) {
        attachRemoteAudio(track);
        const prefs = readDevicePrefs();
        const muted = Boolean(useRoomStore.getState().localMutedUserIds[participant.identity]);
        applyParticipantVolume(participant, prefs.outputVolume, muted);
        void unlockPlayback(room);
      }
      if (publication.kind === Track.Kind.Video) {
        const quality = publication.videoQuality;
        if (quality === 0) {
          store.setMedia(participant.identity, { adaptive: true });
        }
        track.mediaStreamTrack?.addEventListener("ended", () => refreshTiles(room), { once: true });
      }
      refreshTiles(room);
    };

    room.on(RoomEvent.TrackSubscribed, onMedia);
    room.on(RoomEvent.TrackUnsubscribed, (track, _pub, participant) => {
      if (isRemoteAudioTrack(track)) detachRemoteAudio(track);
      syncParticipant(participant);
      refreshTiles(room);
    });
    room.on(RoomEvent.TrackUnpublished, (_pub, participant) => {
      syncParticipant(participant);
      refreshTiles(room);
    });
    room.on(RoomEvent.TrackMuted, (_pub, participant) => {
      syncParticipant(participant);
      refreshTiles(room);
    });
    room.on(RoomEvent.TrackUnmuted, (_pub, participant) => {
      syncParticipant(participant);
      refreshTiles(room);
    });
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      store.setMedia(participant.identity, {
        speaking: false,
        camera: false,
        screen: false,
        mic: "none",
      });
      syncVoiceUsers(room);
      refreshTiles(room);
    });
    room.on(RoomEvent.LocalTrackPublished, (_pub: LocalTrackPublication) => {
      syncParticipant(room.localParticipant);
      _pub.track?.mediaStreamTrack?.addEventListener("ended", () => refreshTiles(room), { once: true });
      refreshTiles(room);
    });
    room.on(RoomEvent.LocalTrackUnpublished, () => {
      syncParticipant(room.localParticipant);
      refreshTiles(room);
    });
    room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      const ids = new Set(speakers.map((item) => item.identity));
      store.setMedia(room.localParticipant.identity, {
        speaking: ids.has(room.localParticipant.identity),
      });
      room.remoteParticipants.forEach((participant) => {
        store.setMedia(participant.identity, { speaking: ids.has(participant.identity) });
      });
    });
    room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      store.setMedia(participant.identity, {
        quality: mapQuality(quality),
        adaptive: quality === ConnectionQuality.Poor || quality === ConnectionQuality.Lost,
      });
    });
    room.on(RoomEvent.TrackStreamStateChanged, (pub, state, participant) => {
      if (pub.kind === Track.Kind.Video && state === Track.StreamState.Paused) {
        store.setMedia(participant.identity, { adaptive: true });
      }
      if (pub.kind === Track.Kind.Video && state === Track.StreamState.Active) {
        store.setMedia(participant.identity, { adaptive: false });
      }
    });
    room.on(RoomEvent.Reconnecting, () => {
      store.setLivekitStatus("reconnecting");
      toast.message(i18n.t("theater.reconnecting"));
    });
    room.on(RoomEvent.Reconnected, () => {
      store.setLivekitStatus("connected");
      syncVoiceUsers(room);
      toast.success(i18n.t("theater.reconnected"));
    });
    room.on(RoomEvent.Disconnected, () => {
      if (!stopped) store.setLivekitStatus("unavailable");
    });
    room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      if (room.canPlaybackAudio) {
        toast.dismiss(AUDIO_BLOCKED_TOAST);
        return;
      }
      toast.message(i18n.t("theater.enableAudio"), {
        id: AUDIO_BLOCKED_TOAST,
        duration: Infinity,
        action: {
          label: i18n.t("theater.enableAudioAction"),
          onClick: () => void unlockPlayback(room),
        },
      });
    });
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      syncParticipant(participant);
      syncVoiceUsers(room);
    });

    const unlockOnGesture = () => {
      void unlockPlayback(room);
    };
    window.addEventListener("pointerdown", unlockOnGesture);

    const run = async () => {
      try {
        const creds =
          useRoomStore.getState().livekitCreds ?? (await getLivekitToken(roomId));
        if (stopped) return;
        if (!creds) {
          store.setLivekitStatus("unavailable");
          toast.error(i18n.t("toast.livekitFailed"));
          return;
        }
        await room.connect(creds.url, creds.token);
        if (stopped) {
          await room.disconnect();
          return;
        }
        store.setLivekitStatus("connected");
        await unlockPlayback(room);
        await applySavedDevices(room);
        syncParticipant(room.localParticipant);
        room.remoteParticipants.forEach(syncParticipant);
        syncVoiceUsers(room);
        refreshTiles(room);
      } catch {
        if (!stopped) {
          store.setLivekitStatus("unavailable");
          toast.error(i18n.t("toast.livekitFailed"));
        }
      }
    };
    void run();

    return () => {
      stopped = true;
      window.removeEventListener("pointerdown", unlockOnGesture);
      toast.dismiss(AUDIO_BLOCKED_TOAST);
      store.setLivekitStatus("idle");
      store.resetMedia();
      store.setVoiceUsers([]);
      store.setVoiceLeft(false);
      store.setLocalMediaFlags({ micEnabled: false, cameraEnabled: false, screenEnabled: false });
      detachAllRemoteAudio(room);
      void room.disconnect();
      roomRef.current = null;
      setTiles([]);
    };
  }, [roomId, enabled, refreshTiles, syncParticipant]);

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;
    const prefs = readDevicePrefs();
    applyRemoteVolume(room, prefs.outputVolume, localMutedUserIds);
  }, [localMutedUserIds, voiceLeft]);

  const setMic = async (enabledMic: boolean) => {
    const room = roomRef.current;
    if (!room) return;
    try {
      // Safari/iOS drop the user-activation token if we await startAudio() first.
      await room.localParticipant.setMicrophoneEnabled(enabledMic);
      if (enabledMic) applyInputVolume(room, readDevicePrefs().inputVolume);
      useRoomStore.getState().setLocalMediaFlags({ micEnabled: enabledMic });
      void unlockPlayback(room);
    } catch (err) {
      toast.error(i18n.t(mediaFailureToastKey(classifyGetUserMediaError(err))));
    }
  };

  const leaveVoice = async () => {
    useRoomStore.getState().setVoiceLeft(true);
    if (useRoomStore.getState().micEnabled) await setMic(false);
  };

  const joinVoice = () => {
    useRoomStore.getState().setVoiceLeft(false);
    const room = roomRef.current;
    if (room) void unlockPlayback(room);
  };

  const setCamera = async (enabledCam: boolean) => {
    const room = roomRef.current;
    if (!room) return;
    try {
      await room.localParticipant.setCameraEnabled(enabledCam);
      useRoomStore.getState().setLocalMediaFlags({ cameraEnabled: enabledCam });
      refreshTiles(room);
      void unlockPlayback(room);
    } catch (err) {
      toast.error(i18n.t(mediaFailureToastKey(classifyGetUserMediaError(err))));
    }
  };

  const setScreen = async (enabledShare: boolean) => {
    const room = roomRef.current;
    if (!room) return;
    try {
      if (!enabledShare) {
        await room.localParticipant.setScreenShareEnabled(false);
      } else {
        try {
          await room.localParticipant.setScreenShareEnabled(true, SCREEN_SHARE_CAPTURE_OPTIONS);
        } catch (err) {
          if (isDisplayMediaCancelled(err)) throw err;
          await room.localParticipant.setScreenShareEnabled(true);
        }
      }
    } catch (err) {
      if (!isDisplayMediaCancelled(err)) {
        toast.error(i18n.t(mediaFailureToastKey(classifyGetUserMediaError(err))));
      }
    } finally {
      useRoomStore.getState().setLocalMediaFlags({
        screenEnabled: room.localParticipant.isScreenShareEnabled,
      });
      refreshTiles(room);
      void unlockPlayback(room);
    }
  };

  const listDevices = async () => {
    const [audioinput, audiooutput, videoinput] = await Promise.all([
      Room.getLocalDevices("audioinput"),
      Room.getLocalDevices("audiooutput"),
      Room.getLocalDevices("videoinput"),
    ]);
    return { audioinput, audiooutput, videoinput };
  };

  const switchDevice = async (kind: MediaDeviceKindName, deviceId: string) => {
    const room = roomRef.current;
    if (!room) return;
    await room.switchActiveDevice(kind, deviceId);
  };

  const setOutputVolume = (volume: number) => {
    const room = roomRef.current;
    if (!room) return;
    applyRemoteVolume(room, volume, useRoomStore.getState().localMutedUserIds);
  };

  const setInputVolume = (volume: number) => {
    const room = roomRef.current;
    if (!room) return;
    applyInputVolume(room, volume);
  };

  return {
    tiles,
    setMic,
    setCamera,
    setScreen,
    leaveVoice,
    joinVoice,
    listDevices,
    switchDevice,
    setOutputVolume,
    setInputVolume,
  };
}
