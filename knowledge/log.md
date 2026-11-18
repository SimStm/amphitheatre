# Directory update log

## 2026-11-18

* **Release**: 2.0.2, with 60 fps and automatic screen sharing and a Call quality tab. Change: [media-quality](/changes/2026-11-18/media-quality/media-quality.md).
* **Release**: 2.0.1, with better screen sharing and quality settings. Change: [media-quality](/changes/2026-11-18/media-quality/media-quality.md). New rule [media-quality](/rules/media-quality.md).
* **Release**: 2.0.0, with the room redesign. Change: [room-redesign](/changes/2026-11-18/room-redesign/room-redesign.md).
* **Update**: Owner, admin, and moderator have their own icon and color in the room, documented in `01 · Fundamentos`. Change: [room-redesign](/changes/2026-11-18/room-redesign/room-redesign.md).
* **Fix**: People in the room's left rail open a popover instead of a dialog that could not be closed. Change: [room-redesign](/changes/2026-11-18/room-redesign/room-redesign.md).
* **Fix**: Development LiveKit and OvenMediaEngine take their keys from `.env`. Change: [dev-media-keys-from-env](/changes/2026-11-18/dev-media-keys-from-env/dev-media-keys-from-env.md).
* **Update**: Owner corrections to the room redesign: original logo on every screen, moving floor on the home page, name field stacked above the room name, and `/about` and `/what-is` in the new style. New rule [original-logo-everywhere](/rules/original-logo-everywhere.md). Change: [room-redesign](/changes/2026-11-18/room-redesign/room-redesign.md).
* **Update**: Room redesign from the Figma file: home, join dialogs, full-screen room with floats, per-viewer stage, Storybook, Motion, and updated dependencies. New rules [home-and-join-follow-figma](/rules/home-and-join-follow-figma.md), [room-floating-interface](/rules/room-floating-interface.md), [stage-selection-per-viewer](/rules/stage-selection-per-viewer.md), [room-settings-and-devices](/rules/room-settings-and-devices.md), [figma-fundamentos-visual-source](/rules/figma-fundamentos-visual-source.md), and [storybook-for-base-components](/rules/storybook-for-base-components.md) replace the prototype, header, and pin-grid rules. Change: [room-redesign](/changes/2026-11-18/room-redesign/room-redesign.md).
* **Creation**: Rules [roadmap](/rules/roadmap.md) (items live in the private `../amphitheatre-docs`; skip the step if it is missing) and [plan-before-implementing](/rules/plan-before-implementing.md). New CHANGELOG bullets link to their bundle: [changelog-and-release-process](/rules/changelog-and-release-process.md). Change: [agents-knowledge-roadmap](/changes/2026-11-18/agents-knowledge-roadmap/agents-knowledge-roadmap.md).
* **Removal**: Two proposed design rules for features that do not exist moved to the private docs repository.

## 2026-08-25

* **Fix**: Operator occupancy is theater presence after reconciling stale `left_at IS NULL` rows with the WebSocket hub; KPI help tooltips; factory reset of theater SQLite with a typed phrase (operators stay); operators password field no longer crashes. Rule [operator-admin-console](/rules/operator-admin-console.md). Change: [admin-occupancy-reset](/changes/2026-08-25/admin-occupancy-reset/admin-occupancy-reset.md).

* **Update**: `/about` copy covers open source, self-hosting, and contribution; coffee is the primary button; OvenMediaEngine, OvenPlayer, LiveKit, and Valkey sit in a named grid. Rule [site-editorial-pages](/rules/site-editorial-pages.md).

* **Creation**: Operator admin console — Vite+Mantine SPA on `ADMIN_PORT`, bootstrap operator + API key, occupancy/peak, LiveKit `/metrics` scrape and OME REST samples without a Prometheus server. Rule [operator-admin-console](/rules/operator-admin-console.md). Product: [operator-admin](/product/operator-admin/operator-admin.md). Change: [operator-admin-console](/changes/2026-08-25/operator-admin-console/operator-admin-console.md).

* **Update**: Operator admin console is implemented (SPA + `/api/admin`, sampler). Earlier same-day note captured the constraints. Change: [operator-admin-console](/changes/2026-08-25/operator-admin-console/operator-admin-console.md).

* **Update**: Invite links to private/password rooms open JoinGate instead of a fake 404. Join errors distinguish missing room (`not_found`) from wrong password (`invalid_password`). Home room-code field is mixed-case. Rule [join-errors-are-explicit](/rules/join-errors-are-explicit.md). Change: [join-errors-explicit](/changes/2026-08-25/join-errors-explicit/join-errors-explicit.md).

* **Update**: Settings → General can request microphone and camera on tap; dock capture no longer awaits `startAudio()` first (Safari user gesture). Rule [media-permissions-need-a-user-gesture](/rules/media-permissions-need-a-user-gesture.md). Change: [media-permissions-prompt](/changes/2026-08-25/media-permissions-prompt/media-permissions-prompt.md).

* **Update**: `/what-is` and `/about` are full-bleed editorial pages (large type, no glass card). What-is copy is plain language and does not name competing products. Rule [site-editorial-pages](/rules/site-editorial-pages.md). Change: [site-editorial-pages](/changes/2026-08-25/site-editorial-pages/site-editorial-pages.md).

* **Creation**: Home footer nav to `/what-is` and `/about`. Change: [home-about-pages](/changes/2026-08-25/home-about-pages/home-about-pages.md).

* **Creation**: Installable PWA (manifest, production SW, `#2e1b08` icon canvas), compact Home install banner, Install as app in the hamburger and General settings, locale-aware Web Share for Invite, Open Graph `summary_large_image`. Rule [pwa-and-native-share](/rules/pwa-and-native-share.md). Change: [pwa-share-meta](/changes/2026-08-25/pwa-share-meta/pwa-share-meta.md).

* **Fix**: YouTube stage embed Error 153 — Hono `Referrer-Policy` is `strict-origin-when-cross-origin` (not `no-referrer`); iframe and HTML meta match; no `origin=` on the plain iframe. Rule [broadcast-opt-in](/rules/broadcast-opt-in.md). Change: [youtube-embed-referrer](/changes/2026-08-25/youtube-embed-referrer/youtube-embed-referrer.md).

* **Update**: About — author name links to sims.dev.br; GitHub is an outline button; Buy me a coffee is the filled primary; Portfolio button removed. Rule [room-settings-and-devices](/rules/room-settings-and-devices.md). Change: [about-author-link](/changes/2026-08-25/about-author-link/about-author-link.md).

* **Update**: Settings chrome — tighter flood-pause spacing; Discord two-column Devices; About version from root `package.json`; mobile title left / broadcast badge right; Audience/Chat tabs inside the drawer card. Rules [room-settings-and-devices](/rules/room-settings-and-devices.md), [mobile-first-class-separate-layout](/rules/mobile-first-class-separate-layout.md), [changelog-and-release-process](/rules/changelog-and-release-process.md). Change: [settings-chrome-about-version](/changes/2026-08-25/settings-chrome-about-version/settings-chrome-about-version.md).

* **Update**: Room QOL — Settings-only header; General tab for theme/locale; unread chat badge and `(n)` title; mobile Settings fullscreen; Audience/Chat bottom drawer; Meet-style mobile camera grid. Rules [room-settings-and-devices](/rules/room-settings-and-devices.md), [mobile-first-class-separate-layout](/rules/mobile-first-class-separate-layout.md), [stage-selection-per-viewer](/rules/stage-selection-per-viewer.md). Change: [theater-qol-settings-chat-drawer](/changes/2026-08-25/theater-qol-settings-chat-drawer/theater-qol-settings-chat-drawer.md).

* **Update**: Desktop empty stage copy is centered in the stage frame. Rules [room-floating-interface](/rules/room-floating-interface.md) and [room-settings-and-devices](/rules/room-settings-and-devices.md). Change: [center-empty-desktop-stage](/changes/2026-08-25/center-empty-desktop-stage/center-empty-desktop-stage.md).

* **Update**: Home compact chrome — centered hero; join/create tabs (join first); hamburger opens a fullscreen appearance sheet; guest avatar lives inside that sheet. Rules [home-and-join-follow-figma](/rules/home-and-join-follow-figma.md), [room-settings-and-devices](/rules/room-settings-and-devices.md), [mobile-first-class-separate-layout](/rules/mobile-first-class-separate-layout.md). Change: [home-compact-tabs-appearance-sheet](/changes/2026-08-25/home-compact-tabs-appearance-sheet/home-compact-tabs-appearance-sheet.md).

## 2026-08-24

* **Update**: Mobile Home and room chrome — hamburger for theme/locale, full-width bottom dock, expanding offline broadcast card, microphone test with self-listen and mute restore. Rules [mobile-first-class-separate-layout](/rules/mobile-first-class-separate-layout.md) and [room-settings-and-devices](/rules/room-settings-and-devices.md). Change: [mobile-theater-chrome](/changes/2026-08-24/mobile-theater-chrome/mobile-theater-chrome.md).

* **Fix**: Remote LiveKit microphone and screen-share audio now attach and unlock autoplay; screen share can include tab or system audio in Chromium. Rule [livekit-remote-audio-must-play](/rules/livekit-remote-audio-must-play.md). Change: [livekit-audio-playback](/changes/2026-08-24/livekit-audio-playback/livekit-audio-playback.md).

* **Fix**: Deploy Compose injects `OME_API_ACCESS_TOKEN` into OvenMediaEngine; Server.xml interpolates that env var so REST stream status is not 401. Change: [ome-api-access-token](/changes/2026-08-24/ome-api-access-token/ome-api-access-token.md).

* **Creation**: `deploy/` standalone self-hosting stack (Compose + Caddy/Traefik examples), single production `Dockerfile` (API serves the built web app), `PUBLIC_APP_HOSTNAME`/`PUBLIC_LIVEKIT_HOSTNAME`/`PUBLIC_OME_HOSTNAME` env vars, `docs/self-hosting.md`, human-readable `README.md`, root `CHANGELOG.md`, and a tag-triggered `.github/workflows/release.yml` publishing multi-arch images to Docker Hub (`simstosh/amphitheatre`). Rule [changelog-and-release-process](/rules/changelog-and-release-process.md). Change: [self-hosting-docker-release](/changes/2026-08-24/self-hosting-docker-release/self-hosting-docker-release.md).

* **Update**: `scripts/extract-changelog.sh promote <version>` command to move `[Unreleased]` into a dated version section automatically; fixed the `Dockerfile` multi-arch release build (`--platform=$BUILDPLATFORM` on the JS build stages) after it crashed under QEMU emulation cross-building `linux/arm64`; cut the `v1.0.0` release. Change: [self-hosting-docker-release](/changes/2026-08-24/self-hosting-docker-release/self-hosting-docker-release.md).

* **Update**: Entire OKF catalog in `knowledge/` translated to English. Rules [public-docs-english](/rules/public-docs-english.md) and [self-aware-knowledge](/rules/self-aware-knowledge.md). Change: [okf-english](/changes/2026-08-24/okf-english/okf-english.md).

* **Update**: OKF catalog in `knowledge/` translated to English (changes/2026-08-24, catalog root, log, references, historical plan). Rule [public-docs-english](/rules/public-docs-english.md).

* **Update**: English README (centered logo + shields, OME style); guides in `docs/` (including load-testing); AGENTS, CONTRIBUTING, and infra/README in English. HTTP contract in `docs/api.md`. Rules [public-docs-english](/rules/public-docs-english.md) and [api-contract-frozen](/rules/api-contract-frozen.md). Change: [readme-en-docs-split](/changes/2026-08-24/readme-en-docs-split/readme-en-docs-split.md).

* **Update**: Settings modal with Stage, Devices, and About (About last); About with AGPLv3, version, and licensed stack; xl dialog without double-scroll; Reload next to the pin. Change: [theater-settings-about-chrome](/changes/2026-08-24/theater-settings-about-chrome/theater-settings-about-chrome.md).

* **Update**: Public edition AGPL-3.0-only; SIMSDEV ICLA; CLA Assistant; restructured README and CONTRIBUTING. Rule [agplv3-and-cla](/rules/agplv3-and-cla.md). Change: [agpl-cla-docs](/changes/2026-08-24/agpl-cla-docs/agpl-cla-docs.md).

* **Update**: Stage fills the frame height (no `pb-24` from the old dock; `auto-rows-fr` grid). Home horizontal wordmark on the room header and the About tab. Change: [theater-stage-fill-wordmark](/changes/2026-08-24/theater-stage-fill-wordmark/theater-stage-fill-wordmark.md).

* **Update**: Leave modal on the logo and SPA navigation; page/room 404 with InfiniteGrid3D; OvenPlayer and embeds remount after layout, with Reload. Rules [leave-room-must-confirm](/rules/leave-room-must-confirm.md) and [not-found-infinite-grid](/rules/not-found-infinite-grid.md). Change: [theater-nav-404-player](/changes/2026-08-24/theater-nav-404-player/theater-nav-404-player.md).

* **Update**: Room QOL — dock in the header, vertical tabs, Discord-style Devices, About, chat 1024 + wrap + soft-ban, tile chrome at the top, logos and metatags. Rules [room-settings-and-devices](/rules/room-settings-and-devices.md) and [chat-flood-soft-ban](/rules/chat-flood-soft-ban.md). Change: [theater-qol-header-chat](/changes/2026-08-24/theater-qol-header-chat/theater-qol-header-chat.md).

* **Update**: React room aligned with `room.html` / `room-chat.html`. Stage as auto-grid with pins. Role/moderation modal and settings modal (devices + stream). Broadcast opt-in; OME stream key `{roomId}-{secret}`; Twitch/YouTube/Kick/https embeds. `PATCH /api/rooms/:id/stream` and WS event `broadcast`. Rules [broadcast-opt-in](/rules/broadcast-opt-in.md), [room-floating-interface](/rules/room-floating-interface.md), [stage-selection-per-viewer](/rules/stage-selection-per-viewer.md). Change: [theater-room-rework](/changes/2026-08-24/theater-room-rework/theater-room-rework.md).

* **Update**: SPA icons from Lucide to `@tabler/icons-react`. Initial locale from the browser; `coliseum.locale` only after a choice. Theme in `coliseum.ui`. Rules [no-emoji-in-ui-or-docs](/rules/no-emoji-in-ui-or-docs.md) and [i18n-en-pt-es](/rules/i18n-en-pt-es.md). Change: [tabler-icons-and-locale-detect](/changes/2026-08-24/tabler-icons-and-locale-detect/tabler-icons-and-locale-detect.md).

* **Update**: Home background is `InfiniteGrid3D` (CSS 3D infinite grid, size/color/angle props). `prefers-reduced-motion` pauses the loop. Rule [home-and-join-follow-figma](/rules/home-and-join-follow-figma.md). Change: [home-infinite-grid-3d](/changes/2026-08-24/home-infinite-grid-3d/home-infinite-grid-3d.md).

## 2026-08-23

* **Update**: Visible product name **Amphitheatre** (UI, docs, knowledge). Packages `@coliseum/*` unchanged. Rule [app-name-amphitheatre](/rules/app-name-amphitheatre.md). Change: [rename-amphitheatre](/changes/2026-08-23/rename-amphitheatre/rename-amphitheatre.md).

* **Update**: Home mood chips smaller, icon + tooltip only; hover not clipped (no overflow on the rail).

* **Update**: React Home aligned with the `home.html` prototype (layout, glow, decorative cards). Theme/locale in the center pill. Crash `export { initials }` fixed. Rule [home-and-join-follow-figma](/rules/home-and-join-follow-figma.md). Change: [home-html-fidelity](/changes/2026-08-23/home-html-fidelity/home-html-fidelity.md).

* **Fix**: OvenPlayer WebRTC on the default playlist (`ws://HOST/app/{roomId}`), not `/llhls` (AAC). Change: [ome-webrtc-default-playlist](/changes/2026-08-23/ome-webrtc-default-playlist/ome-webrtc-default-playlist.md).
* **Update**: OME stage with OvenPlayer (WebRTC first, LL-HLS fallback) and `abr_stream` in Server.xml. Change: [ome-abr-ovenplayer](/changes/2026-08-23/ome-abr-ovenplayer/ome-abr-ovenplayer.md). Rule: [ome-webrtc-first-abr](/rules/ome-webrtc-first-abr.md).
* **Creation**: Concept [OBS ingest](/product/obs-ingest/obs-ingest.md) — Windows/macOS encoders, CBR/ABR/VBR/CRF, presets, bypass vs transcode (ingest URL does not choose a profile).
* **Fix**: OME stage plays LL-HLS instead of `ws://` on `<video>`; SegmentDuration 10s for the OBS GOP. Change: [ome-llhls-player](/changes/2026-08-23/ome-llhls-player/ome-llhls-player.md).
* **Update**: Pinned Compose images — LiveKit v1.13.5, OME v0.21.0, Valkey 9.1.1-alpine (instead of Redis Ltd.), Caddy 2.11.4. `Server.xml` on the v0.21 schema. Rules [valkey-for-livekit](/rules/valkey-for-livekit.md) and [pin-compose-images](/rules/pin-compose-images.md). Change: [infra-image-pins](/changes/2026-08-23/infra-image-pins/infra-image-pins.md).
* **Fix**: OME IceCandidates v0.20.5 (`TcpForce`); `ome.reachable`; LiveKit stage clears dead tiles; broadcast banner only if REST responded. Change: [ome-livekit-stage-fixes](/changes/2026-08-23/ome-livekit-stage-fixes/ome-livekit-stage-fixes.md).

## 2026-08-22

* **Initialization**: OKF v0.2 catalog in `knowledge/` (product, rules, changes, references) and `AGENTS.md` at the monorepo root.
* **Creation**: Bootstrap changes in [2026-08-22](/changes/2026-08-22/) — monorepo, LiveKit/OME infra, room/moderation API, theater SPA, load-testing docs.
* **Creation**: Product docs (vision, identity, chat, LiveKit, OME, moderation, safety, clients, out-of-scope) and architecture/process rules.
* **Update**: OKF frontmatter on the [original plan](/references/plano-watchparty-miniDiscord.md) (`status: deprecated`); body preserved at the time (later translated to English).
