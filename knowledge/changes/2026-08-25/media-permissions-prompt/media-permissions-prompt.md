---
type: Change
title: Explicit mic and camera permission prompts
description: Settings General can request microphone and camera on tap. Dock media calls do not await startAudio first. Devices preview is click-to-start.
generated: { by: coding_agent/composer, at: 2026-08-25T18:40:00Z }
sources:
  - id: general
    resource: apps/web/src/components/theater/media-permissions-fields.tsx
    title: Allow microphone / camera
  - id: livekit
    resource: apps/web/src/hooks/use-livekit.ts
    title: Gesture-safe publish
---

# What landed

Settings → General has Allow microphone and Allow camera, each calling `getUserMedia` in the click handler. Failures are classified (denied, missing device, in use, insecure) with copy that tells the user to allow access or fix Safari / iOS site settings.

Mic, camera, and screen on the dock no longer await `room.startAudio()` before capture (that ate the Safari user-activation token). Devices camera preview no longer starts in a `useEffect`.

# Why

Safari and mobile often returned a permission error without ever showing the system prompt.

# Related

- [Media permissions need a user gesture](/rules/media-permissions-need-a-user-gesture.md)
- [Theater header chrome](/rules/room-settings-and-devices.md)
