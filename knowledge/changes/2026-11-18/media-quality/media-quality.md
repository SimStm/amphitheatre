---
type: Change
title: Media quality
description: Sharper screen sharing for viewers, higher default send quality, and quality settings for voice, camera, screen, and viewing.
tags: [change, livekit, media, settings]
generated: { by: coding_agent/claude, at: 2026-11-18T20:00:00Z }
sources:
  - id: presets
    resource: apps/web/src/lib/media-quality.ts
    title: Quality presets
  - id: hook
    resource: apps/web/src/hooks/use-livekit.ts
    title: LiveKit room hook
  - id: panel
    resource: apps/web/src/components/theater/media-settings-panel.tsx
    title: Quality settings
---

# What landed

- Viewers no longer receive a layer chosen from the size of their video element. Streams on their stage use the best layer available.
- Screen sharing publishes 1080p at 30 fps up to 8 Mbps by default. Camera and voice defaults are also higher.
- Settings → Devices has choices for viewing, voice, camera, screen, and screen content.
- Streams outside the stage use the lowest layer, which leaves bandwidth for the stage.
- LiveKit's total bandwidth limit moved from 100 Mbps to about 1 Gbps in `infra/` and `deploy/`.

Spec, plan, results, and limitations: [spec](spec.md), [plan](plan.md), [tasks](tasks.md).

# Related

- [Media quality](/rules/media-quality.md)
- [LiveKit media](/product/livekit-media/livekit-media.md)
