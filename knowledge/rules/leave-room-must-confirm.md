---
type: Rule
title: Leave room must confirm
description: Any action that takes the user out of the room (Leave, in-app navigation) opens the existing Leave modal. Do not go Home silently.
tags: [web, theater, ux]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-24T06:40:00Z }
sources:
  - id: theater
    resource: apps/web/src/components/theater/theater-screen.tsx
    title: TheaterScreen
  - id: dialog
    resource: apps/web/src/components/theater/leave-room-dialog.tsx
    title: LeaveRoomDialog
---

# Rule

While the guest **is in the room** (`joined`), leaving requires the confirmation modal already used in the dock (Leave). That applies to:

- Leave button in the dock
- in-app navigation to another route (including SPA history back)

Confirmed: `POST /api/rooms/:id/leave`, clear the room store, and go to Home (or the blocked route). Cancel keeps the room.

Do not show the modal on the join dialogs: the person has not joined yet. Native browser `beforeunload` stays off; the custom modal does not replace the system dialog when closing the tab.

# Related

- [Room floating interface](/rules/room-floating-interface.md)
- [Room settings and devices](/rules/room-settings-and-devices.md)
- [Identity and roles](/product/identity-and-roles/identity-and-roles.md)
