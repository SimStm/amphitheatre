---
type: Change
title: Settings chrome, About version, mobile drawer card
description: Tighter Stage flood spacing; Discord two-column Devices; About version from root package.json; mobile title/badge row; Audience/Chat tabs inside the drawer card.
generated: { by: coding_agent/composer, at: 2026-08-25T06:05:00Z }
sources:
  - id: flood
    resource: apps/web/src/components/theater/chat-settings-panel.tsx
    title: ChatSettingsPanel
  - id: devices
    resource: apps/web/src/components/theater/media-settings-panel.tsx
    title: MediaSettingsPanel
  - id: version
    resource: apps/web/src/lib/app-meta.ts
    title: APP_VERSION
  - id: vite
    resource: apps/web/vite.config.ts
    title: Vite __APP_VERSION__
  - id: header
    resource: apps/web/src/components/theater/theater-header.tsx
    title: TheaterHeader
  - id: mobile
    resource: apps/web/src/components/theater/mobile-theater-layout.tsx
    title: MobileTheaterLayout
---

# What landed

- Stage → flood pause uses compact spacing (title + hint, tight radios, save) instead of a sparse fieldset with `min-h-11` rows.
- Devices on desktop: two columns like Discord (mic select + input volume | speaker select + output volume). Mic test and the level meter span both columns. Camera preview stays a block below.
- About shows the semver from the monorepo root `package.json`, injected at Vite build as `__APP_VERSION__`. That is the same value as the GitHub Release / git tag `vX.Y.Z` after the release bump.
- Mobile room header: title left, broadcast badge right on the second row.
- Mobile Audience/Chat tabs sit inside the same `glass-panel` as the conversation (panel radius, not a pill). Expanding still grows the card upward.

# Why

Flood options looked loosely stacked. Devices did not match the Discord two-column voice layout. About was hardcoded `0.1.0` while the tagged release is `1.0.0`. The mobile badge sat under the title; the tab bar was a separate overly-round pill.

# Related

- [Theater header chrome](/rules/room-settings-and-devices.md)
- [Mobile first-class separate layout](/rules/mobile-first-class-separate-layout.md)
- [CHANGELOG and release process](/rules/changelog-and-release-process.md)
- [Clients](/product/clients/clients.md)
- [LiveKit media](/product/livekit-media/livekit-media.md)
