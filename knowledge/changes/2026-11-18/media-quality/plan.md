---
type: Plan
title: Media quality — plan
description: Publish explicit quality presets and stop choosing the received layer from element size.
tags: [change, livekit, media, settings]
---

# Approach

- `apps/web/src/lib/media-quality.ts`: presets, saved preferences, and the LiveKit options built from them, with unit tests.
- `use-livekit.ts`: turn `adaptiveStream` off, keep `dynacast`, publish with the presets, and request a layer per stream with `setVideoQuality`.
- Keep simulcast. A lower layer lets the server protect viewers with weak connections, and dynacast stops it when nobody needs it.
- `theater-screen.tsx` tells the hook which streams are on this viewer's stage.
- `media-settings-panel.tsx`: a quality section in the Devices tab.
- Voice and camera changes republish the track. A running screen share is not restarted, because that would reopen the browser picker.
- Raise `limit.bytes_per_sec` to 1 Gbps in the development and self-hosted LiveKit files.

# Risks

- Higher defaults use more upload and download. The viewing and sending choices give people a lower option, and server congestion control still applies.
- Safari 17 captures at low resolution when a resolution is requested, so none is requested there.
