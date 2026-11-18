---
type: Change
title: Home tabs and fullscreen appearance sheet
description: Centered Home hero on compact chrome; join/create as tabs; hamburger opens a fullscreen appearance dialog that holds the guest avatar.
generated: { by: coding_agent/composer, at: 2026-08-25T05:15:00Z }
sources:
  - id: home-screen
    resource: apps/web/src/components/home/home-screen.tsx
    title: HomeScreen
  - id: home-panel
    resource: apps/web/src/components/home/home-panel.tsx
    title: HomeActionTabs
  - id: appearance
    resource: apps/web/src/components/chrome/appearance-menu.tsx
    title: AppearanceMenu
  - id: header
    resource: apps/web/src/components/home/home-header.tsx
    title: HomeHeader
---

# What landed

- Home hero column (title, lead, mood chips) is centered on compact chrome; desktop (`xl`) stays left-aligned.
- Join and create are tabs in the Home panel, matching Audience/Chat in the room. Join is the default tab. Display name stays above the tablist.
- Compact Home header is wordmark + hamburger. The guest avatar is inside the appearance sheet.
- The hamburger (Home, join gate, room) opens a fullscreen native dialog with a close button, not a popover.

# Why

Mobile Home had left-aligned hero copy, two stacked action cards that overflowed, and a header crowded by hamburger plus avatar. The previous appearance menu was a small popover.

# Related

- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Theater header chrome](/rules/room-settings-and-devices.md)
- [Mobile first-class separate layout](/rules/mobile-first-class-separate-layout.md)
- [Clients](/product/clients/clients.md)
