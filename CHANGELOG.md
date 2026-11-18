# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/). Entries here are the macro history, always in English. Full technical detail for each change lives in the OKF catalog under [`knowledge/changes/`](knowledge/changes/). Since 2026-11-18, each entry links to its change record.

## [Unreleased]

## [2.0.1] - 2026-11-18

### Added

- Quality settings for what you watch, your voice, your camera, your screen, and the kind of content you share. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/media-quality))

### Changed

- Screen sharing now sends 1080p at 30 fps by default, and camera and voice use higher default quality. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/media-quality))
- Self-hosted LiveKit allows about 1 Gbps of total traffic instead of 100 Mbps. Update `livekit.yaml` and restart LiveKit to apply it. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/media-quality))

### Fixed

- People watching a shared screen receive the best available quality instead of a smaller version chosen from the size of their window. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/media-quality))

## [2.0.0] - 2026-11-18

Amphitheatre 2.0 is a full visual redesign. The home page, join flow, and room now share one design system, and the room becomes a full-screen stage with floating controls. Each person chooses what fills their own screen, and the interface gets out of the way while you watch.

Rooms, roles, moderation, and the API work as before. To update a self-hosted install, use the Compose files in `deploy/` or the image `simstosh/amphitheatre:2.0.0`.

### Added

- Public or private choice when creating a room, a live list of public rooms, and a dedicated dialog for each join problem (password, full room, invalid invite). ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Room stage selection per person: one stream full screen or several in a grid that resizes by itself. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Show or hide control for the room interface, with automatic hiding after a time set in Settings. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Owners, admins, and moderators stand out with their own icon and color in the people rail, people panel, member details, and chat. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Design rules in `apps/web/DESIGN.md` and a Storybook for base components. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Contributor workflow: a short spec, plan, and task list before each feature or fix. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/agents-knowledge-roadmap))

### Changed

- New home page, join dialogs, and full-screen room following the Figma design, with new animation on desktop and mobile. The original logo stays on every screen, and the home page keeps its moving floor and name field. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- The About and What is Amphitheatre pages use the new header, buttons, cards, settings, and footer. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Updated dependencies, base images, and pinned Compose images. Node 22.12 or newer is now required for web tooling. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))

### Fixed

- People in the room's left rail open a popover beside them, with the same options as before, replacing a dialog that could not be closed with the mouse. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- Opening the chat no longer shifts the whole room sideways. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))
- The development LiveKit and OvenMediaEngine containers accept custom keys from `.env`, so LiveKit no longer restarts in a loop. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/dev-media-keys-from-env))

### Removed

- The room header dock, side columns, and pin grid, replaced by the floating room interface. ([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/2026-11-18/room-redesign))

## [1.3.1] - 2026-08-27

### Added

- Operator console can provision theater rooms manually: custom id (duplicate ids rejected), member limit above the guest cap (up to `MAX_ADMIN_MEMBERS_PER_ROOM`, default 500), optional password, public/private visibility, and optional expiry (indefinite rooms persist when empty; timed rooms are removed from SQLite after the deadline). First guest to join a provisioned room becomes owner. `POST /api/admin/rooms`.
- Join rejects duplicate display names among present members (`duplicate_display_name`, 409). Local mute lets each guest silence another participant for themselves without affecting others.
- Theater audience lists only present members; disconnected guests show as offline until `OFFLINE_REMOVE_MS` (default 5 minutes), then leave the roster.

### Changed

- WebSocket presence includes a `connected` flag so offline members stay visible only during the offline grace window.

### Fixed

- Docker release build: export `AdminCreateRoomBody` from `@coliseum/shared`, type `memberLimit` state in the operator Rooms page, and declare `setLocalMuted` on the theater room store so `tsc` passes for admin and web SPAs.

## [1.2.0] - 2026-08-25

### Added

- Operator console occupancy is theater presence after dropping stale `left_at IS NULL` rows (crashed tabs / API restart). KPI cards explain each number. Operators can factory-reset theater rooms and metrics with a typed confirmation phrase; operator accounts stay. Guest theater API is unchanged.
- Operator console on a separate bind/port (`ADMIN_PORT` 3002): Mantine SPA, `/api/admin/*`, occupancy and peak members, LiveKit `/metrics` scrape plus OME REST samples (no Prometheus server). Guest theater API is unchanged.
- **What is Amphitheatre?** (`/what-is`) and **About** (`/about`) explain the product in plain language (no competing product names). Copy sits in a readable column, not a glass card.
- Settings → General can request microphone and camera access on tap, with copy for Safari and iOS when the prompt never appears.

### Changed

- `/about` is centered like the missing-room screen. Copy states it is open source (self-host and contribute). Buy me a coffee is the primary button; GitHub is outline. The four open-source tools sit in a named grid. No “open a room” CTA on this page.
- `GET /api/rooms/:id` returns a preview for existing private rooms so invite links open the join screen instead of a fake 404. Join of a missing room is `not_found`; a wrong password is `invalid_password` on public and private rooms.
- The Home room-code field keeps mixed case (room ids are case-sensitive) and does not auto-capitalize on mobile.

### Fixed

- Occupied rooms / people now counted members who never called leave (SQLite `left_at` null), including after a closed tab or API restart.
- Operator console password field on the Operators page crashed with `Cannot read properties of null (reading 'value')` and was too small to use.
- Safari/mobile often failed mic and camera with a permission error without showing a prompt: capture no longer waits on `startAudio()` first, and Devices camera preview starts only after a tap.
- Joining a non-existent room from Home no longer shows “password does not match”. Joining without a display name asks for a name.

## [1.1.0] - 2026-08-25

### Added

- Screen share can include tab or system audio (Chromium picker). If the browser rejects the audio constraint, share continues as video-only.
- Progressive Web App: web app manifest, Apple install meta, production service worker (network passthrough so Chromium can install), and app icons on a `#2e1b08` canvas (maskable + any). Compact Home always suggests installing; the hamburger and Settings → General offer Install as app until the session is already standalone.
- Invite uses the device share sheet (`navigator.share`) with title and text in the active UI locale; the room URL is in the text. Clipboard copy is the fallback.

### Fixed

- LiveKit voice was silent for everyone even when the speaking indicator lit up: remote audio tracks are now attached and autoplay is unlocked (`room.startAudio()` plus an enable-audio prompt).
- Deploy Compose now passes `OME_API_ACCESS_TOKEN` into the OvenMediaEngine container, matching `<AccessToken>` in `Server.xml`, so the app can poll whether a stream is live.
- YouTube stage embeds failed with Error 153 (HTTP Referer): Hono was sending `Referrer-Policy: no-referrer`. The API, the iframe, and the HTML meta now use `strict-origin-when-cross-origin`. The iframe no longer adds an `origin=` query param (that is for the IFrame Player API, not a plain embed).

### Changed

- Mobile Home and room chrome: header is wordmark + Settings + an appearance menu (theme and language); the media dock is a full-width floating bar at the bottom with icon-only buttons; an offline broadcast message sizes to its content instead of sitting inside the video tile; microphone test shows a level meter, mutes the room mic while you listen to yourself, and restores the previous mute state.
- Home compact layout: hero and mood chips are centered; join/create are tabs (join first); the hamburger opens a fullscreen appearance sheet with a close button; the guest avatar lives inside that sheet.
- Desktop empty stage (“the stage is yours”) is centered in the stage frame.
- Room QOL: Settings-only header; General tab for theme and language; unread chat badge and `(n)` document title; mobile Settings is fullscreen; Audience/Chat is a bottom drawer; mobile cameras use a 1–2 column grid.
- Settings chrome: tighter flood-pause spacing; Devices is a two-column Discord-style grid on desktop; About shows the root `package.json` version (same as the GitHub Release tag); mobile room title left / broadcast badge right; Audience/Chat tabs share the drawer card and use the panel corner radius.
- About credits the author as a link to sims.dev.br. Source on GitHub is an outline button; Buy me a coffee is the filled primary. The Portfolio button is gone.
- Open Graph / Twitter use `summary_large_image` with 1200×630 dimensions and alt text. The GitHub `canonical` link is gone so crawlers treat the live origin as the page URL.

## [1.0.0] - 2026-08-24

### Added

- Initial monorepo bootstrap: `apps/api` (Hono/Bun), `apps/web` (Vite/React), `packages/shared`, and the Docker Compose infra (LiveKit, Valkey, optional OvenMediaEngine).
- Guest JWT identity (no accounts); persistent room roles (`owner` > `admin` > `moderator` > `member`); immutable room ownership.
- Real-time text chat, voice, camera, and screen share via LiveKit; speaking/transmitting/connection-quality indicators.
- Optional shared broadcast stage (OvenMediaEngine, Twitch, YouTube, Kick, or a custom URL), off by default.
- Moderation: kick, mute, ban/unban; password lockout (3 failures / 5 minutes); chat flood soft-ban.
- Desktop and mobile layouts (mobile is a separate, first-class layout, not a shrunk desktop).
- UI locales `en`, `pt-BR`, `es`; light/dark design tokens.
- AGPL-3.0-only license with an Individual Contributor License Agreement (ICLA).
- OKF v0.2 knowledge catalog under `knowledge/` (product, rules, changes).
- `Dockerfile` building a single production image (API + built web app) served on one port, published to Docker Hub as `simstosh/amphitheatre`.
- `deploy/` folder: a self-contained Docker Compose stack (app, LiveKit, Valkey, optional OvenMediaEngine) that does not require cloning the rest of the repository.
- `PUBLIC_APP_HOSTNAME`, `PUBLIC_LIVEKIT_HOSTNAME`, and `PUBLIC_OME_HOSTNAME` environment variables, which derive `CORS_ORIGIN`, `LIVEKIT_URL`, and the OME playback/ingest URLs automatically for self-hosting with a real domain.
- Traefik example (`deploy/docker-compose.traefik.yml`) alongside the existing Caddy profile, documenting which ports must stay published on the host (raw WebRTC/RTMP media) versus which are only reachable through the reverse proxy.
- [Self-hosting guide](docs/self-hosting.md), written for non-developers running their own instance.
- `.github/workflows/release.yml`: pushing a `vX.Y.Z` tag creates a GitHub Release from this file and publishes a multi-arch (`amd64`/`arm64`) image to Docker Hub.
- This `CHANGELOG.md`, following Keep a Changelog, as the macro-history counterpart to the OKF catalog.
- `scripts/extract-changelog.sh promote <version>` command: moves `[Unreleased]` into a dated `## [X.Y.Z] - YYYY-MM-DD` section and refreshes the compare/release links, automating step 1 of the release flow.

### Changed

- `README.md` rewritten in plain language, answering directly whether you need to clone the repo, use only a Compose file, or a single `docker run` (short answer: it depends on whether you want to use the app or develop it — see the guide).

### Fixed

- Multi-arch Docker release build: pin the JS-only `deps`/`build` stages in `Dockerfile` to `--platform=$BUILDPLATFORM` so `pnpm install`/`vite build` run natively on the runner instead of crashing under QEMU emulation ("illegal instruction") while cross-building `linux/arm64`.

[Unreleased]: https://github.com/simstm/amphitheatre/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/simstm/amphitheatre/releases/tag/v2.0.1
[2.0.0]: https://github.com/simstm/amphitheatre/releases/tag/v2.0.0
[1.3.1]: https://github.com/simstm/amphitheatre/releases/tag/v1.3.1
[1.2.0]: https://github.com/simstm/amphitheatre/releases/tag/v1.2.0
[1.1.0]: https://github.com/simstm/amphitheatre/releases/tag/v1.1.0
[1.0.0]: https://github.com/simstm/amphitheatre/releases/tag/v1.0.0
