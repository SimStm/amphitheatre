---
type: Spec
title: Media quality — spec
description: Screen, camera, and voice are sent at good quality, viewers receive the best available layer, and each person can choose quality in Settings.
tags: [change, livekit, media, settings]
---

# Problem

Measured on 2026-11-18 with two LiveKit participants on a local server, no network limit, and a generated 1920x1080 screen track published the way the app did:

- The top screen layer was capped at 2.5 Mbps and 15 fps. The second layer was 960x540 at 625 kbps.
- `adaptiveStream` chose the layer from the size of the video element. A viewer with a 900 px wide stage received 960x540 at about 0.5 Mbps, although the network had room for more.
- Only a stage wider than the low layer received 1920x1080.
- There was no way to choose voice, camera, screen, or viewing quality.

# Goal

People send good quality by default. Viewers receive the best layer the sender publishes and their connection can carry. Each person controls these choices in Settings.

# Scope

- Default send quality: screen 1080p at 30 fps up to 8 Mbps, camera 720p at 30 fps up to 2.5 Mbps, voice 64 kbps.
- Settings per browser: voice, camera, and screen quality, screen content type, and viewing quality.
- Streams on the viewer's stage use the chosen viewing quality. Streams only shown as thumbnails use the lowest layer.
- The server keeps lowering quality for a viewer whose connection cannot carry it.
- The server's total bandwidth limit no longer sits at 100 Mbps.

# Out of scope

- Recording, new codecs, TURN, and API or token changes.

# Acceptance criteria

1. With default settings, a generated 1080p screen publishes a top layer at 30 fps and 8 Mbps.
2. A viewer with a stage narrower than 960 px receives 1920x1080 when the network allows.
3. Voice, camera, screen, screen content, and viewing quality can be changed in Settings, in `en`, `pt-BR`, and `es`, and survive a reload.
4. Viewing quality and voice or camera quality apply at once. Screen quality applies to the next share, and the screen says so.
5. A stream outside the viewer's stage is requested at the lowest layer.
6. Typecheck, API tests, web tests, lint, builds, and `docker compose config` pass.
