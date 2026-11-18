---
type: Change
title: Mobile Home and room chrome
description: Compact header (settings + hamburger), full-width bottom dock, expanding offline broadcast card, and microphone test loopback with restore.
generated: { by: coding_agent/composer, at: 2026-08-24T22:05:00Z }
sources:
  - id: mobile-layout
    resource: apps/web/src/components/theater/mobile-theater-layout.tsx
    title: MobileTheaterLayout
  - id: header
    resource: apps/web/src/components/theater/theater-header.tsx
    title: TheaterHeader
  - id: dock
    resource: apps/web/src/components/theater/control-bar.tsx
    title: ControlBar
  - id: devices
    resource: apps/web/src/components/theater/media-settings-panel.tsx
    title: MediaSettingsPanel
  - id: stage
    resource: apps/web/src/components/theater/stage.tsx
    title: Stage
---

# What landed

- Compact chrome (`pointer: coarse` or `max-width: 767px`): wordmark + Settings + hamburger for theme and locale (Home, join gate, and room). Room title moves to a second header row so controls no longer overlap the logo.
- Mobile dock is a full-width floating bar in the footer (app-style). Compact buttons are icon-only and vertically centered; caption space is not reserved.
- Broadcast enabled but not playing: full-width offline/waiting card sized to its content, not a video tile. Live playback still uses the player tile.
- Settings: Devices sections spaced apart; Stage tab copy fields stack on narrow viewports; visible mic level meter; test mutes the room mic when it was on, enables self-listen, and restores the previous mute state.
- Home: tighter padding and hamburger chrome so the header and form fit a phone width.

# Why

Mobile screenshots showed overlapping header controls, a header dock with empty caption gaps, an offline card trapped in the player, a missing mic meter, and cramped Stage/Devices settings.

# Related

- [Mobile first-class separate layout](/rules/mobile-first-class-separate-layout.md)
- [Theater header chrome](/rules/room-settings-and-devices.md)
- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Clients](/product/clients/clients.md)
