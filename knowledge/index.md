---
okf_version: "0.2"
---

# Amphitheatre — OKF catalog

Root bundle of this repository: `knowledge/`. Format: **OKF 0.2** ([SPEC](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)).

Agents: read **product** and **rules** before changing code. After a durable user preference, update [self-aware-knowledge](rules/self-aware-knowledge.md) (create or edit a file in `rules/`). Do not leave the constraint only in chat.

Operational instructions for the repo: [`AGENTS.md`](../AGENTS.md) at the monorepo root (outside the bundle).

# Product

Product vision (macro). Does not replace the contract in `packages/shared`.

* [Vision](product/vision/vision.md) - open-source mini-Discord theater; ephemeral rooms; optional OME
* [Identity and roles](product/identity-and-roles/identity-and-roles.md) - guest JWT; persistent immutable owner
* [Realtime chat](product/realtime-chat/realtime-chat.md) - room WebSocket; short in-memory history
* [LiveKit media](product/livekit-media/livekit-media.md) - voice, camera, screenshare, indicators
* [OME broadcast](product/ome-broadcast/ome-broadcast.md) - optional OBS ingest; stream key = roomId + secret; opt-in
* [OBS ingest](product/obs-ingest/obs-ingest.md) - OBS encoders, CBR/VBR/CRF, bypass vs transcode
* [Moderation](product/moderation/moderation.md) - kick, mute, ban, roles
* [Safety limits](product/safety-limits/safety-limits.md) - rate limit, lockout, room caps
* [Clients](product/clients/clients.md) - desktop SPA + separate mobile layout; i18n; theme
* [Out of scope](product/out-of-scope/out-of-scope.md) - recording; Netflix is not a legal requirement
* [Operator admin](product/operator-admin/operator-admin.md) - host monitoring console (separate port)

# Rules

Rules the agent must apply when writing code.

* [OME independent of WebRTC](rules/ome-independent-of-webrtc.md) - voice/text/screen never require OME
* [Owner admin is persistent](rules/owner-admin-is-persistent.md) - owner is not lost on leave
* [No recording](rules/no-recording.md) - no Egress, DVR, or dump
* [Reconnect last priority](rules/reconnect-last-priority.md) - SDK defaults; no custom protocol
* [Password lockout 3 strikes 5 min](rules/password-lockout-3-strikes-5-min.md) - lockout by IP and userId
* [Presence indicators required](rules/presence-indicators-required.md) - speaking, transmitting, quality
* [LiveKit remote audio must play](rules/livekit-remote-audio-must-play.md) - attach remote mic and screen-share audio; autoplay unlock
* [Mobile first-class separate layout](rules/mobile-first-class-separate-layout.md) - own layout, not a shrunk desktop
* [Self-aware knowledge](rules/self-aware-knowledge.md) - a durable preference becomes a catalog rule
* [Shared types in packages/shared](rules/shared-types-in-packages-shared.md) - single contract
* [No emoji in UI or docs](rules/no-emoji-in-ui-or-docs.md) - zero emoji; Tabler ok
* [i18n en pt es](rules/i18n-en-pt-es.md) - en, pt-BR, es
* [Design tokens light dark](rules/design-tokens-light-dark.md) - CSS tokens; data-theme
* [API contract frozen](rules/api-contract-frozen.md) - packages/shared + docs/api.md
* [Valkey for LiveKit](rules/valkey-for-livekit.md) - Valkey RESP for LiveKit; not Redis Ltd.
* [Pin Compose images](rules/pin-compose-images.md) - semver tags in Compose; no latest
* [OME WebRTC first ABR](rules/ome-webrtc-first-abr.md) - OvenPlayer; WebRTC first; ABR on the server
* [Home and join follow Figma](rules/home-and-join-follow-figma.md) - frames 1.2, 1.4, 1.5, 1.6; one dialog per join failure
* [Site editorial pages](rules/site-editorial-pages.md) - /what-is and /about are full-bleed; What-is names no competing products
* [Room floating interface](rules/room-floating-interface.md) - full-screen stage; floats hide on demand and when idle
* [Stage selection per viewer](rules/stage-selection-per-viewer.md) - each person picks one stream or a resizing grid
* [Broadcast opt-in](rules/broadcast-opt-in.md) - stream off by default; secret key; embeds
* [App name is Amphitheatre](rules/app-name-amphitheatre.md) - visible name Amphitheatre; @coliseum/* ids unchanged
* [Room settings and devices](rules/room-settings-and-devices.md) - settings tabs, device grid, mic test loopback
* [Figma Fundamentos are the visual source](rules/figma-fundamentos-visual-source.md) - tokens, type, icons, indicators, Motion
* [Storybook for base components](rules/storybook-for-base-components.md) - every ui component has a story; lint enforces it
* [PWA and native share](rules/pwa-and-native-share.md) - installable PWA; icon canvas #2e1b08; locale-aware invite share
* [Join errors are explicit](rules/join-errors-are-explicit.md) - GET preview for existing rooms; not_found vs invalid_password
* [Media permissions need a user gesture](rules/media-permissions-need-a-user-gesture.md) - Allow mic/camera in General; no getUserMedia in useEffect
* [Leave room must confirm](rules/leave-room-must-confirm.md) - leave the room only through the modal
* [Not found infinite grid](rules/not-found-infinite-grid.md) - 404 with InfiniteGrid3D
* [Chat flood soft-ban](rules/chat-flood-soft-ban.md) - 1024 chars; 1–2 min soft-ban
* [AGPLv3 and CLA](rules/agplv3-and-cla.md) - AGPL-3.0-only; ICLA so SIMSDEV can relicense (SaaS)
* [Public docs in English](rules/public-docs-english.md) - README/CONTRIBUTING/AGENTS/docs and knowledge/ in English
* [Operator admin console](rules/operator-admin-console.md) - separate bind; admin identity; scrape LiveKit /metrics + OME REST; no Prometheus server
* [CHANGELOG and release process](rules/changelog-and-release-process.md) - Unreleased bullet linked to its bundle; manual tag triggers the release
* [Plan before implementing](rules/plan-before-implementing.md) - spec.md, plan.md, and tasks.md exist before code for a feature or fix
* [Roadmap lives in the private docs repository](rules/roadmap.md) - items go to ../amphitheatre-docs; skip the step if it is missing; no absolute paths

# Changes

What landed in the code, by date. One directory per feature.

* [2026-11-18](changes/2026-11-18/) - Agent workflow: spec/plan/tasks before code, CHANGELOG entries linked to bundles, roadmap kept in the private docs repository; room redesign from the Figma file
* [2026-08-25](changes/2026-08-25/) - Operator occupancy/reset; operator admin console; Home join/create tabs; fullscreen appearance sheet with guest avatar; empty desktop stage centered; room QOL (General settings, unread chat, mobile drawer); Settings chrome, About version, integrated mobile tabs; About author link; YouTube embed Referer (Error 153); PWA install and native invite share; explicit join errors; mic/camera permission prompts; What is / About pages; editorial What is / About layout
* [2026-08-24](changes/2026-08-24/) - InfiniteGrid3D on the Home background; Tabler Icons; browser locale; room rework (pin/grid, broadcast opt-in); QOL header/chat/About/logos; 404 + Leave modal + player reload; full-height stage and horizontal wordmark; settings modal (tabs, AGPLv3 About, reload in chrome); AGPLv3 + ICLA; English README, split docs, and OKF catalog; LiveKit remote audio playback and screen-share sound
* [2026-08-23](changes/2026-08-23/) - Amphitheatre name; OME ABR + OvenPlayer; Home faithful to HTML; WebRTC on the default playlist (not /llhls); LL-HLS stage; LiveKit/OME/Valkey/Caddy pins; OME XML v0.21
* [2026-08-22](changes/2026-08-22/) - bootstrap: monorepo, LiveKit/OME infra, API, SPA, load-testing docs, OKF catalog

# References

Historical or external material. Not a contract.

* [Original Watch Party plan](references/plano-watchparty-miniDiscord.md) - superseded on Redis-as-state, email accounts, and required OME

# Log

* [Directory update log](log.md) - chronological history of the bundle
