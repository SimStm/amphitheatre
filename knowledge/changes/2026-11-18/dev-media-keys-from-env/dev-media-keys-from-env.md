---
type: Change
title: Development media keys from .env
description: LiveKit and OvenMediaEngine in the development Compose file take their keys from .env, so a custom key no longer stops them.
tags: [change, livekit, ome, infra, fix]
generated: { by: coding_agent/claude, at: 2026-11-18T18:00:00Z }
sources:
  - id: compose
    resource: docker-compose.yml
    title: Development Compose file
  - id: livekit
    resource: infra/livekit/livekit.yaml
    title: LiveKit configuration
  - id: ome
    resource: infra/ome/origin_conf/Server.xml
    title: OvenMediaEngine configuration
---

# What landed

- The `livekit` service writes `LIVEKIT_API_KEY` into `webhook.api_key` when it starts. A custom key no longer makes the container restart in a loop.
- `<AccessToken>` in the development `Server.xml` reads `OME_API_ACCESS_TOKEN`, which Compose passes to the container.
- `.env.example`, `docs/configuration.md`, and `infra/README.md` no longer tell people to copy these values by hand.

Spec, plan, results, and limitations: [spec](spec.md), [plan](plan.md), [tasks](tasks.md).

# Related

- [Valkey for LiveKit](/rules/valkey-for-livekit.md)
- [OME independent of WebRTC](/rules/ome-independent-of-webrtc.md)
