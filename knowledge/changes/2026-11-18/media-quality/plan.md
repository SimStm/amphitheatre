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

# Follow-up: 60 fps and automatic quality

Observed: LiveKit's server forwards video without encoding it again, so frame rate costs the sender's computer and upload, each viewer's download and decoding, and server traffic. The sender uploads once regardless of the number of viewers. Dynacast only changes `active` on sender encodings, so bitrate and frame rate set on the top encoding remain in place. Vivo lists its 600 Mega fiber plan with 300 Mbps upload.

Approach:

- Add `screenFps` and an `auto` screen choice to `media-quality.ts`, with one usage table for all screen options.
- Add `screen-auto.ts`: a tested decision function and a small loop that reads WebRTC sender statistics every 3 seconds and changes only the top encoding.
- Lower quality on bandwidth or CPU limits, packet loss, or rising delay. The browser's upload estimate stops near the current limit, so it only decides whether the next step may be tried. Raise quality after 15 stable seconds. After a drop, wait 60 seconds, doubling up to 5 minutes when drops repeat.
- Show the current automatic level in Settings while sharing.
- Reuse `Popover` for the explanation, and make its Escape handling safe inside a dialog.
- Move the choices to `call-quality-panel.tsx`, shown as the Call quality tab.
- Let `Popover` open on the left when its anchor is near the right edge.
