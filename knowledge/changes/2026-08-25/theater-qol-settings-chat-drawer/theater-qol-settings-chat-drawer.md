---
type: Change
title: Room QOL — General settings, unread chat, mobile drawer
description: Settings-only room header; General tab for theme/locale; unread chat badge and title; mobile fullscreen Settings; Audience/Chat bottom drawer; Meet-style mobile camera grid.
generated: { by: coding_agent/composer, at: 2026-08-25T05:40:00Z }
sources:
  - id: header
    resource: apps/web/src/components/theater/theater-header.tsx
    title: TheaterHeader
  - id: settings
    resource: apps/web/src/components/theater/room-settings-modal.tsx
    title: RoomSettingsModal
  - id: mobile
    resource: apps/web/src/components/theater/mobile-theater-layout.tsx
    title: MobileTheaterLayout
  - id: grid
    resource: apps/web/src/components/theater/stage-grid.tsx
    title: StageGrid
  - id: unread
    resource: apps/web/src/hooks/use-unread-chat.ts
    title: useUnreadChat
---

# What landed

- Room header (desktop and mobile) shows Settings only. Theme and locale moved to Settings → **General** (first tab). Stage / Devices / About follow. On mobile, Settings is a fullscreen dialog.
- When Chat is not visible, new messages from others show a count badge on the Chat tab and prefix the document title with `(n)`. Opening Chat clears the count. Join history and own messages do not count.
- Mobile Audience/Chat is a floating bar above the dock, closed by default. Tap a tab to expand the panel upward; tap the selected tab again to collapse. The stage fills leftover height when the drawer is closed.
- Mobile camera tiles use a 1–2 column Meet-style grid (no pin rail). An odd leftover tile spans the row.

# Why

The room header was crowded with theme and locale next to Settings. Chat had no unread signal. Mobile Chat/Audience sat above the stage and stole vertical space even when unused. The compact camera grid stacked two people in a single column.

# Related

- [Theater header chrome](/rules/room-settings-and-devices.md)
- [Mobile first-class separate layout](/rules/mobile-first-class-separate-layout.md)
- [Stage pin grid](/rules/stage-selection-per-viewer.md)
- [Realtime chat](/product/realtime-chat/realtime-chat.md)
- [Clients](/product/clients/clients.md)
