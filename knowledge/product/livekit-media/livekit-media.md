---
type: Product
title: LiveKit media
description: Voice, camera, and screenshare via LiveKit. Speaking, transmitting, and quality indicators.
tags: [livekit, webrtc, media]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-22T08:21:00Z }
sources:
  - id: livekit-api
    resource: apps/api/src/livekit.ts
    title: mintToken, mute, webhook
  - id: hook
    resource: apps/web/src/hooks/use-livekit.ts
    title: SDK livekit-client
  - id: yaml
    resource: infra/livekit/livekit.yaml
    title: Local SFU
  - id: rule
    resource: /rules/presence-indicators-required.md
    title: Indicators
  - id: audio
    resource: /rules/livekit-remote-audio-must-play.md
    title: Remote audio must play
---

# Implemented

- Send and viewing quality follow [media-quality](/rules/media-quality.md).
- LiveKit room **=** Amphitheatre `roomId`. Identity **=** `userId`.
- `GET /api/rooms/:id/livekit-token` and token on join (`livekitToken` / `livekitUrl`).
- Grants: `canPublish` + sources camera, mic, screen. Moderation mute **removes** `MICROPHONE` from `canPublishSources` and calls RoomService `updateParticipant`.[^livekit-api]
- SPA: `livekit-client` (not `@livekit/components-react` in this cut). Custom tiles. Remote **audio tracks are attached** (mic and screen-share audio); video tiles stay on `AttachVideo`. SDK default simulcast.[^hook]
- Devices modal: on desktop, microphone and speaker sit in two columns (select above volume); mic test and the level meter span both columns. Starting the test mutes the published room mic (if it was on), plays a local self-listen loopback, and shows a visible level meter; stopping restores the previous mute state unless a moderator mute is in effect. Camera preview starts only after a tap. Settings → General can request mic and camera on tap so Safari shows a prompt. Dock capture must not await `startAudio()` before `getUserMedia`.
- Screen share requests tab/system audio (`audio` + Chromium `systemAudio: "include"`). Local screen audio is not played back. If the browser rejects the audio constraint, share continues as video-only.
- `room.startAudio()` after connect and on user gestures; toast when autoplay still blocks. Speaking indicators are not treated as proof of audible output.
- SFU: image `livekit/livekit-server:v1.13.11`, UDP mux `7882`, ICE TCP `7881`, Valkey DB 1 (RESP), `max_participants: 50`, no egress.[^yaml]
- Webhook `POST /webhooks/livekit` updates camera/screen in the hub.
- Client emits `presence.update` (speaking, camera, screen, quality).

# Indicators

Speaking, camera, screen, `connectionQuality` mapped to `excellent|good|poor|lost`. See the presence rule.

# Intended / partial

- Room toggles that disable publish on the token: there are **no** `voiceEnabled` fields on create; mute is per member.
- Built-in LiveKit TURN (port 3479) is **commented out**; OME already uses 3478.
- Reconnection: SDK defaults only.

# Related

- [LiveKit remote audio must play](/rules/livekit-remote-audio-must-play.md)
- [Media permissions need a user gesture](/rules/media-permissions-need-a-user-gesture.md)
- [Valkey for LiveKit](/rules/valkey-for-livekit.md)
- [OME independent of WebRTC](/rules/ome-independent-of-webrtc.md)
- [No recording](/rules/no-recording.md)
- [Reconnect last priority](/rules/reconnect-last-priority.md)

[^livekit-api]: mintToken, mute, webhook
[^hook]: SDK livekit-client
[^yaml]: Local SFU
