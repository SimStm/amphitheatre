---
type: Rule
title: Media permissions need a user gesture
description: Safari and mobile often skip the mic/camera prompt unless getUserMedia runs in the tap handler. General settings must offer explicit Allow buttons and honest errors.
tags: [web, livekit, safari, permissions]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-25T18:40:00Z }
sources:
  - id: general
    resource: apps/web/src/components/theater/media-permissions-fields.tsx
    title: Allow microphone / camera
  - id: livekit
    resource: apps/web/src/hooks/use-livekit.ts
    title: setMic / setCamera without startAudio first
  - id: classify
    resource: apps/web/src/lib/media-permissions.ts
    title: classifyGetUserMediaError
---

# Rule

Do **not** call `getUserMedia` from a `useEffect` (Devices preview used to). Safari/iOS often returns `NotAllowedError` without showing a prompt if the call is not in the same user gesture, or if `startAudio()` was awaited first and consumed the activation token.

Dock mic/camera/screen: call LiveKit `setMicrophoneEnabled` / `setCameraEnabled` / `setScreenShareEnabled` **before** `room.startAudio()`. Classify failures (`denied`, `not_found`, `in_use`, `insecure`) and toast the matching copy; point the user at Settings → General.

Settings → **General** has **Allow microphone** and **Allow camera** buttons that call `getUserMedia` on click (audio and video **separately**), then stop the tracks. Copy must explain that if no dialog appears, the site is already blocked in browser / iOS Safari settings.

Devices camera preview starts only after a tap on **Start camera preview**. Mic test already requires a tap.

# Related

- [Room settings and devices](/rules/room-settings-and-devices.md)
- [LiveKit media](/product/livekit-media/livekit-media.md)
- [LiveKit remote audio must play](/rules/livekit-remote-audio-must-play.md)
