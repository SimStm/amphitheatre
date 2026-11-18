---
type: Plan
title: Development media keys from .env — plan
description: Fill the LiveKit webhook key and the OvenMediaEngine token from the environment.
tags: [change, livekit, ome, infra, fix]
---

# Approach

LiveKit has no environment variable or flag for `webhook.api_key`, but it accepts the whole configuration through `--config-body`, and its image has `sh` and `sed`.

- In `docker-compose.yml`, start `livekit` through `sh`. It replaces the `api_key` line of the mounted YAML with `LIVEKIT_API_KEY` and passes the result to `--config-body`.
- Keep `api_key: devkey` in the YAML as the default for use outside Compose.
- OvenMediaEngine reads `${env:NAME:default}` in `Server.xml`, so `<AccessToken>` uses `OME_API_ACCESS_TOKEN`, and Compose passes that variable.
- Update `.env.example`, `docs/configuration.md`, and `infra/README.md`, which said the values had to be copied by hand.

# Risks

- A key with `|`, `&`, or `\` would break the `sed` replacement, so the start command escapes them.
- `exec` keeps LiveKit as the process that receives stop signals.
