# Rules

Code and process rules. The agent must apply them; if the user changes a durable decision, update the matching file (see [self-aware-knowledge](self-aware-knowledge.md)).

* [OME independent of WebRTC](ome-independent-of-webrtc.md) - LiveKit/chat never depend on OME
* [Owner admin is persistent](owner-admin-is-persistent.md) - ownerId is immutable
* [No recording](no-recording.md) - no Egress/DVR
* [Reconnect last priority](reconnect-last-priority.md) - SDK defaults
* [Password lockout 3 strikes 5 min](password-lockout-3-strikes-5-min.md) - 3 failures, 5 minutes
* [Presence indicators required](presence-indicators-required.md) - speaking, transmitting, quality
* [LiveKit remote audio must play](livekit-remote-audio-must-play.md) - attach remote audio; screen share can include tab/system sound
* [Mobile first-class separate layout](mobile-first-class-separate-layout.md) - a layout of its own
* [Self-aware knowledge](self-aware-knowledge.md) - a durable user preference becomes a file here
* [Shared types in packages/shared](shared-types-in-packages-shared.md) - single contract
* [No emoji in UI or docs](no-emoji-in-ui-or-docs.md) - zero emoji
* [i18n en pt es](i18n-en-pt-es.md) - en, pt-BR, es
* [Design tokens light dark](design-tokens-light-dark.md) - tokens, not ad-hoc colors
* [API contract frozen](api-contract-frozen.md) - shared + docs/api.md
* [Valkey for LiveKit](valkey-for-livekit.md) - Valkey RESP, not Redis Ltd.
* [Pin Compose images](pin-compose-images.md) - semver tags; no latest
* [OME WebRTC first ABR](ome-webrtc-first-abr.md) - OvenPlayer; WebRTC first; ABR on the server
* [Home follows HTML prototype](home-follows-html-prototype.md) - Home visually faithful to home.html; mock cards/nav are not product
* [Site editorial pages](site-editorial-pages.md) - /what-is and /about are full-bleed; What-is names no competing products
* [Room follows HTML prototype](room-follows-html-prototype.md) - room faithful to room.html / room-chat.html
* [Stage pin grid](stage-pin-grid.md) - auto-grid + pins
* [Broadcast opt-in](broadcast-opt-in.md) - stream off by default; secret key
* [App name is Amphitheatre](app-name-amphitheatre.md) - visible name Amphitheatre; @coliseum/* packages unchanged
* [Theater header chrome](theater-header-chrome.md) - desktop dock in the header; mobile bottom bar; hamburger; mic test loopback
* [PWA and native share](pwa-and-native-share.md) - installable PWA; icon canvas #2e1b08; locale-aware invite share
* [Join errors are explicit](join-errors-are-explicit.md) - GET preview for existing rooms; not_found vs invalid_password
* [Media permissions need a user gesture](media-permissions-need-a-user-gesture.md) - Allow mic/camera in General; no getUserMedia in useEffect
* [Leave room must confirm](leave-room-must-confirm.md) - logo, Leave, and history open the Leave modal
* [Not found infinite grid](not-found-infinite-grid.md) - 404 and missing room use the Home background
* [Chat flood soft-ban](chat-flood-soft-ban.md) - 1024 chars; 1–2 min pause on flood
* [AGPLv3 and CLA](agplv3-and-cla.md) - public edition AGPL-3.0-only; ICLA + CLA Assistant for SIMSDEV relicensing
* [Public docs in English](public-docs-english.md) - README, CONTRIBUTING, CLA, AGENTS, LICENSE, docs/, infra/README.md, and knowledge/ are English
* [CHANGELOG and release process](changelog-and-release-process.md) - Unreleased bullet per change; manual git tag triggers GitHub Release + Docker Hub
* [Operator admin console](operator-admin-console.md) - separate bind/port; admin session; scrape LiveKit /metrics + OME REST; no Prometheus server
* [Plan before implementing](plan-before-implementing.md) - spec.md, plan.md, and tasks.md exist before code for a feature or fix
* [Roadmap lives in the private docs repository](roadmap.md) - items go to ../amphitheatre-docs; skip the step if it is missing; no absolute paths
