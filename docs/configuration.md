# Configuration

Copy `.env.example` (repo root) and `apps/api/.env.example`. Do not invent secrets and do not commit `.env`. Values in those files are development placeholders.

The API loads the monorepo root `.env` first, then `apps/api/.env` (`apps/api/src/env.ts`).

## Variables

| Variable | Use |
|---|---|
| `API_PORT` / `PORT` | API HTTP port (default **3001**) |
| `CORS_ORIGIN` | Vite origins, comma-separated (cookies) |
| `SESSION_SECRET` | HMAC for the guest JWT (`ct_session`) |
| `DATABASE_PATH` | SQLite file |
| `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` / `LIVEKIT_URL` | JWT mint + SDK |
| `LIVEKIT_HTTP_URL` | RoomService / health (default: `LIVEKIT_URL` with `http`) |
| `OME_API_URL` | OME REST (`http://localhost:8081`) |
| `OME_API_ACCESS_TOKEN` | Basic auth for OME REST. The development Compose file passes it to OME |
| `OME_RTMP_URL` | OBS ingest (alias: `OME_RTMP_INGEST_URL`) |
| `OME_PLAYBACK_URL` | WebRTC playback (alias: `OME_WEBRTC_PLAYBACK_BASE`) |
| `OME_LLHLS_PLAYBACK_BASE` | LL-HLS fallback |
| `LOCKOUT_MAX_FAILURES` / `LOCKOUT_DURATION_MS` | Default 3 failures / 300000 ms |
| `MAX_ROOMS_PER_CREATOR` / `MAX_ROOMS_PER_IP` / `MAX_MEMBERS_PER_ROOM` / `MAX_CONCURRENT_ROOMS` | Caps |
| `ADMIN_PORT` / `ADMIN_BIND` / `ADMIN_ENABLED` | Operator console listen (default 3002 / `127.0.0.1` / true). In Docker set `ADMIN_BIND=0.0.0.0` and publish `127.0.0.1:3002:3002`. |
| `LIVEKIT_METRICS_URL` | LiveKit Prometheus text scrape (default `http://127.0.0.1:6789/metrics`; Compose `http://livekit:6789/metrics`) |
| `METRICS_INTERVAL_MS` / `METRICS_RETENTION_DAYS` | Sampler period (15000) and SQLite sample retention (30 days) |

LiveKit: `LIVEKIT_API_SECRET` must be at least 32 characters and must **not** contain `:`. Compose mounts `LIVEKIT_KEYS` as `"key: secret"` and, in development, also uses `LIVEKIT_API_KEY` as the LiveKit webhook key.

### Self-hosting with your own domain

Instead of setting every URL above one by one, you can set just these three (`apps/api/src/env.ts`) and the API derives the rest:

| Variable | Derives | Example |
|---|---|---|
| `PUBLIC_APP_HOSTNAME` | `CORS_ORIGIN` (`https://<host>`) | `amp.example.com` |
| `PUBLIC_LIVEKIT_HOSTNAME` | `LIVEKIT_URL` (`wss://<host>`) | `live.example.com` |
| `PUBLIC_OME_HOSTNAME` | `OME_RTMP_URL`, `OME_PLAYBACK_URL`, `OME_LLHLS_PLAYBACK_BASE` | `stream.example.com` |

Any variable already set explicitly (e.g. `LIVEKIT_URL`) always wins over the value derived from `PUBLIC_*_HOSTNAME`. Full walkthrough, reverse-proxy examples, and a ready-to-run Compose file: [Self-hosting](self-hosting.md) and [`deploy/`](../deploy/).

Full comments live in `.env.example` and `apps/api/.env.example`. UDP/TLS ports: `infra/livekit/livekit.yaml`, `infra/ome/origin_conf/Server.xml`, [infra/README.md](../infra/README.md).

Operator console (separate port, distinct login): [Operator admin](operator-admin.md).
