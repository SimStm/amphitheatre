---
type: Tasks
title: Development media keys from .env — tasks
description: Work, checks, and results for the development media key fix.
tags: [change, livekit, ome, infra, fix]
---

# Tasks

| # | Task | Verification | Status |
|---|---|---|---|
| 1 | Fill the LiveKit webhook key at container start | container healthy with a custom key | done |
| 2 | Read the OvenMediaEngine token from the environment | `make smoke` | done |
| 3 | Update comments and docs | changed lines | done |
| 4 | Check the API and a room against LiveKit | API logs, browser | done |

# Results

Checked on 2026-11-18.

| Criterion | Result | How it was checked |
|---|---|---|
| 1 LiveKit stays up | met | container healthy with a key other than `devkey` |
| 2 Webhook key from `.env` | met | LiveKit starts only when the key is present in `LIVEKIT_KEYS`; no key was added to tracked files |
| 3 API warnings stop | met | no LiveKit warning in the API log after the container started |
| 4 Media through LiveKit | met | a test participant published a generated camera track over UDP to `127.0.0.1:7882`, and the room showed its video and camera indicator |
| 5 OvenMediaEngine token | met | `make smoke`: `OME REST GET /v1/vhosts` passes with the token from `.env` |
| 6 Example values | met by construction | `devkey` stays in the YAML and the example token is the Compose and `Server.xml` default; not run with a copied `.env` |
| 7 Compose and smoke | met | `docker compose config -q`, `make smoke` |

# Limitations

- A real microphone, camera, and screen share were not used. The media test used generated tracks.
- A live broadcast through OBS or ffmpeg into OvenMediaEngine was not run.
