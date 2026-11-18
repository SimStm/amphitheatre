---
type: Tasks
title: Media quality — tasks
description: Work and checks for media quality.
tags: [change, livekit, media, settings]
---

# Tasks

| # | Task | Verification | Status |
|---|---|---|---|
| 1 | Presets and saved preferences | unit tests | done |
| 2 | Publish and receive through the presets | two participants on local LiveKit | done |
| 3 | Settings section in three languages | browser, typecheck | done |
| 4 | Server bandwidth limit | `docker compose config`, LiveKit healthy | done |
| 5 | Docs, version 2.0.1, release | release workflow | done |

# Results

Checked on 2026-11-18 against local LiveKit v1.13.11, with no network limit.

| Measure | Before | After |
|---|---|---|
| Screen top layer | 1920x1080, 15 fps, 2.5 Mbps limit | 1920x1080, 30 fps, 8 Mbps limit; measured 30 fps and 7.8 Mbps |
| Viewer with a stage about 900 to 1000 px wide | 960x540 at about 0.5 Mbps | 1920x1080 |
| Off-stage camera thumbnail | followed its element size | 320x180 |

| Criterion | Result | How it was checked |
|---|---|---|
| 1 Default screen quality | met | sender statistics for a generated 1080p track |
| 2 Viewer receives full resolution | met | the app's stage video reported 1920x1080 in a 1000 px window |
| 3 Settings | met | Devices tab in the browser; the choice was saved; `en`, `pt-BR`, and `es` checked by typecheck |
| 4 When changes apply | met | viewing quality changed the stage to 960x540 and back; voice and camera were republished with new settings; a running screen share kept its layers, and the share used the chosen capture and bitrate |
| 5 Off-stage streams | met | camera thumbnail received 320x180 |
| 6 Project checks | met | see the release checks below |

Release checks: `pnpm typecheck`; `pnpm test` 45 pass; `bun test apps/web/src` 64 pass; web lint with the story check for 22 components; web, admin, and Storybook builds; `docker compose config -q`; `make smoke`.

# Limitations

- Capture devices were simulated with generated tracks. A real microphone, camera, screen, and several computers on real networks were not tested.
- The production server was not inspected. On 2026-11-18 its public app and LiveKit addresses answered 502 during this work.
- `limit.bytes_per_sec` only changes on a server after its `livekit.yaml` is updated and LiveKit restarts. The other improvements arrive with the 2.0.1 web app.
