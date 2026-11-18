# Architecture

```
Browser (Vite :5173 theater, :5174 operator)
  | REST + WebSocket /api   (Vite proxy theater -> :3001, operator -> :3002)
  | LiveKit SDK             ws://localhost:7880
  | OME OvenPlayer          ws://localhost:3333/app/{streamKey}/webrtc  (optional; LL-HLS fallback)
        |
        v
Hono API (same Bun process)
  | :3001 public            rooms, JWT guest, WS, LiveKit mint, OME poll, theater SPA
  | :3002 operator          /api/admin/*, operator SPA (ADMIN_BIND, default 127.0.0.1)
  | SQLite                  rooms, memberships, bans, lockouts, broadcast, admin users, metric samples
  | LiveKit RoomService     JWT mint + webhook POST /webhooks/livekit + ListRooms
  | LiveKit /metrics        scrape Prometheus text (no Prometheus server)
  | OME REST                streams + stats (short timeout; failure = healthy=false)
        |
        v
LiveKit + Valkey DB 1       always on `make up`  (/metrics on :6789)
OvenMediaEngine             only `--profile ome` / `make ome-up`
```

## Monorepo

```
apps/api          Bun + Hono — REST, WebSocket, JWT, SQLite, LiveKit mint, OME poll, operator admin
apps/web          Vite + React SPA — desktop theater + a separate mobile layout
apps/admin        Vite + React SPA — operator console (Mantine 9)
packages/shared   TypeScript contract: types, roles, paths, events, errors, limits
infra/            Docker Compose (LiveKit, Valkey, OME, Caddy), scripts, k6
docs/             Operator and API guides
knowledge/        OKF catalog (product, rules, changes) + historical references
```

pnpm workspace (`apps/*`, `packages/*`). Packages: `@coliseum/api`, `@coliseum/web`, `@coliseum/admin`, `@coliseum/shared`.

Room state (members, roles, bans, lockouts) is **SQLite** (`DATABASE_PATH`). Valkey in Compose is **only** for LiveKit (DB 1, hostname `redis`). The API does not use it to persist owner/admin.

## OME independence

There is no `depends_on` from LiveKit/Valkey to OME. `docker compose up` never starts OME. Voice, text, camera, and screen share **never** require OME. `GET /api/rooms/:id/media` stays HTTP 200 with `ome.healthy=false` if OME is down.

Do not add Postgres, Valkey/Redis as room state, LiveKit Egress, or OME File publisher.

Pinned images: LiveKit `v1.13.11`, OvenMediaEngine `v0.21.0`, Valkey `9.1.3-alpine`. Details: [infra/README.md](../infra/README.md).
