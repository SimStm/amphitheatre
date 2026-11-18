---
type: Change
title: Center empty desktop stage
description: Empty stage copy is centered horizontally and vertically in the desktop stage frame.
generated: { by: coding_agent/composer, at: 2026-08-25T05:25:00Z }
sources:
  - id: stage
    resource: apps/web/src/components/theater/stage.tsx
    title: Stage
  - id: desktop
    resource: apps/web/src/components/theater/desktop-theater-layout.tsx
    title: DesktopTheaterLayout
---

# What landed

When there is no camera, screenshare, or live broadcast, the empty stage (“the stage is yours”) fills the desktop stage frame and centers its icon and copy on both axes. The frame also vertically centers a content-sized offline broadcast card. Live tiles still stretch to fill the frame.

# Why

`Stage` used `h-auto` whenever there was no video, so the empty block sat at the top of a tall frame.

# Related

- [Room follows HTML prototype](/rules/room-floating-interface.md)
- [Theater header chrome](/rules/room-settings-and-devices.md)
