---
type: Rule
title: Media quality
description: People send good quality by default, viewers receive the best available layer, and each person controls quality in Settings.
tags: [livekit, media, settings]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T20:00:00Z }
sources:
  - id: presets
    resource: apps/web/src/lib/media-quality.ts
    title: Quality presets and saved choices
  - id: hook
    resource: apps/web/src/hooks/use-livekit.ts
    title: Publishing and layer requests
  - id: settings
    resource: apps/web/src/components/theater/media-settings-panel.tsx
    title: Quality settings
---

# Rule

Defaults favor quality: screen 1080p at 30 fps up to 8 Mbps, camera 720p at 30 fps up to 2.5 Mbps, and voice at 64 kbps. Settings → Devices lets each person change voice, camera, screen, screen content, and viewing quality. The choices stay in that browser.

Do not turn on `adaptiveStream` for the room. It picks a layer from the size of the video element, which made viewers receive a small layer of a shared screen even with spare bandwidth.

A stream on the viewer's stage uses the viewing choice. A stream outside the stage uses the lowest layer. Simulcast and dynacast stay on, so the server can lower quality for a weak connection and senders stop layers nobody needs.

Voice and camera changes republish the live track. Screen changes apply to the next share, because restarting it would reopen the browser picker.

# Related

- [Room settings and devices](/rules/room-settings-and-devices.md)
- [Stage selection per viewer](/rules/stage-selection-per-viewer.md)
- [LiveKit media](/product/livekit-media/livekit-media.md)
