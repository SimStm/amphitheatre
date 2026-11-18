---
type: Change
title: Room QOL — header, chat, About, and logos
description: Dock in the header; vertical modal; Discord-style devices; chat soft-ban; wrap; logos and metatags.
generated: { by: coding_agent/composer, at: 2026-08-24T06:20:00Z }
sources:
  - id: header
    resource: apps/web/src/components/theater/theater-header.tsx
    title: TheaterHeader
  - id: chat
    resource: apps/web/src/components/theater/chat-panel.tsx
    title: ChatPanel
  - id: hub
    resource: apps/api/src/hub.ts
    title: chat_slow
---

# What landed

- Media dock in the center of the header; settings + theme + language on the right with tooltip.
- Settings modal with vertical tabs (Devices, About, Stage). Devices in an input/volume and output/volume grid; mic test after the input; `inputVolume` in localStorage.
- About: logo, project GitHub, OME/OvenPlayer/LiveKit/Valkey, Buy Me a Coffee, and portfolio.
- Chat: autosize textarea, send inside the field, max 1024, wrap long text, 1–2 min soft-ban (`PATCH /api/rooms/:id/chat`, `chat_slow` event).
- Tile chrome at the top, visible on hover, hides after 3s.
- 1:1 and full logos; favicon, apple-touch, manifest, og/twitter, room title.

# Why

User QOL request after the room rework: more area for the stage, a usable chat input, controlled flood, and visual identity from the brand files.

# Related

- [Theater header chrome](/rules/room-settings-and-devices.md)
- [Chat flood soft-ban](/rules/chat-flood-soft-ban.md)
- [Room follows HTML prototype](/rules/room-floating-interface.md)
