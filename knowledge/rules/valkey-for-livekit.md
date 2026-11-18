---
type: Rule
title: Valkey for LiveKit
description: LiveKit uses Valkey (RESP), not Redis Ltd. Compose service stays redis for the hostname.
tags: [infra, valkey, livekit, license]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-23T07:15:00Z }
sources:
  - id: compose
    resource: docker-compose.yml
    title: valkey/valkey:9.1.3-alpine
  - id: yaml
    resource: infra/livekit/livekit.yaml
    title: redis.address redis:6379 db 1
  - id: product
    resource: /product/livekit-media/livekit-media.md
    title: SFU + Valkey DB 1
---

# Rule

The LiveKit RESP store is **Valkey** (`valkey/valkey`, semver-alpine pin), not `redis:` from Redis Ltd.

- Image and container: `valkey/valkey:9.1.3-alpine`, `coliseum-valkey`, `valkey-server` + `valkey-cli`.
- Compose hostname stays `redis` (`redis:6379` in the LiveKit YAML). Do not rename the service just so it “looks like Valkey” — LiveKit only speaks RESP.
- Conf in `infra/redis/redis.conf`, mounted at `/usr/local/etc/valkey/valkey.conf`. `maxmemory-policy noeviction`. Volume `coliseum-valkey-data` (do not reuse a Redis Ltd. dump — RDB v12).
- The API **does not** persist rooms/roles in that store (SQLite). Do not revert to Redis Ltd. for “compatibility”.

Reason: Valkey is BSD-3-Clause (Linux Foundation). Redis 8+ is RSALv2 / SSPL / AGPLv3 — worse for commercial SaaS-style use. Protocol is drop-in for LiveKit.

# Related

- [Pin Compose images](/rules/pin-compose-images.md)
- [LiveKit media](/product/livekit-media/livekit-media.md)
- [Owner admin is persistent](/rules/owner-admin-is-persistent.md)
