---
type: Change
title: Room rework (HTML, pin/grid, broadcast opt-in)
description: Room UI aligned with the room.html/room-chat.html prototypes; stage with pin and auto-grid; role and device modals; opt-in stream with secret key and embeds.
tags: [web, api, broadcast, theater]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-24T04:30:00Z }
sources:
  - id: theater
    resource: apps/web/src/components/theater/theater-screen.tsx
    title: TheaterScreen
  - id: stream
    resource: apps/api/src/rooms.ts
    title: setBroadcast
  - id: shared
    resource: packages/shared/src/broadcast.ts
    title: RoomBroadcast
---

# What landed

- Desktop room replicates the prototype layout (header, stage, dock, 340px aside with Audience/Chat).
- Stage as an auto-grid with multiple pins (Meet/Discord). Broadcast, camera, and screen fit in the same grid.
- Clicking a member opens a modal for role, mute, kick, and ban.
- Settings modal: devices (volume, input/output, camera, preview, and mic test) and the admin stream tab.
- Broadcast off by default. `PATCH /api/rooms/:id/stream` enables OME or a Twitch/YouTube/Kick/https embed.
- OME stream key becomes `{roomId}-{secret}`. WS event `broadcast`.

# Why

The old stage filled the screen with the stream and hid shares without scroll. Anyone with the room id could publish from OBS. The room HTML called for its own chrome, and the user asked for config and permissions in a modal.

# Related

- [Broadcast opt-in](/rules/broadcast-opt-in.md)
- [Room follows HTML prototype](/rules/room-floating-interface.md)
- [Stage pin grid](/rules/stage-selection-per-viewer.md)
- [OME broadcast](/product/ome-broadcast/ome-broadcast.md)
