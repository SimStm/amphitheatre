---
type: Spec
title: Development media keys from .env — spec
description: The development LiveKit and OvenMediaEngine containers accept any key set in .env.
tags: [change, livekit, ome, infra, fix]
---

# Problem

Observed on 2026-11-18 with `make up` and a `.env` that does not use the example keys:

- `coliseum-livekit` restarted in a loop and logged `api_key is required to use webhooks`.
- `infra/livekit/livekit.yaml` fixed `webhook.api_key` to `devkey`. LiveKit exits when that key is not in `LIVEKIT_KEYS`.
- With LiveKit down, the API logged `livekit_list_rooms_failed`, `livekit_list_participants_failed`, and `livekit_metrics_scrape_failed`. The cause was not a Docker network problem.
- `make up` does not start OvenMediaEngine. After `make ome-up`, its REST API answered 401, because `Server.xml` fixed the example token while `.env` held another one.

# Goal

`.env` is the only place to set the development LiveKit key and the OvenMediaEngine REST token.

# Out of scope

- `deploy/` keeps its own documented configuration.
- OvenMediaEngine stays optional and still starts with `make ome-up`.

# Acceptance criteria

1. With a `LIVEKIT_API_KEY` other than `devkey`, `coliseum-livekit` stays up and reports healthy.
2. The webhook signing key equals `LIVEKIT_API_KEY`, and no key or secret is written to the repository.
3. The API stops logging the LiveKit connection warnings.
4. A browser can publish and receive media through LiveKit on the host.
5. With a custom `OME_API_ACCESS_TOKEN`, the OvenMediaEngine REST API accepts that token.
6. The example values still work when `.env` is copied from `.env.example`.
7. `docker compose config -q` and `make smoke` pass.
