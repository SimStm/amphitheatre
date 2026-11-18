---
type: Rule
title: Room floating interface
description: The room is a full-screen stage with floating controls merged from frames 1.3e and 1.3d. Every float can be hidden, and floats hide by themselves after a configurable idle time.
tags: [web, theater, design, ux]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: desktop
    resource: apps/web/src/components/theater/desktop-theater-layout.tsx
    title: DesktopTheaterLayout
  - id: rail
    resource: apps/web/src/components/room/room-rail.tsx
    title: RoomRail
  - id: chrome
    resource: apps/web/src/hooks/use-floating-chrome.ts
    title: useFloatingChrome
---

# Rule

The stage fills the screen. Everything else floats over it.[^desktop]

- Left: the people float from `1.3e`. People in voice come first, chat-only people are smaller below a divider. When **more than one stream** is active it becomes the thumbnail rail from `1.3d`.[^rail]
- Top left: room title. Top center: voice pill. Top right: invite, people, and the show or hide control.
- Bottom center: dock. Right: the chat or people panel, opened from the dock. The panel side follows `1.3d`.

Selecting a person in the left float opens a popover with an arrow pointing at them, with the same details and actions as the member dialog. The people panel keeps the dialog. Floats stay visible while a popover or dialog is open.

The show or hide control stays on screen at all times. Hiding through it holds until it is used again.

Floats also hide after the time in Settings → General (5, 10, 20, or 30 seconds, or never; default 5; saved per browser) when the pointer is still or outside the window.[^chrome] Pointer movement, a key press, or a tap brings them back. They do not hide while the pointer is over a float, a text field has focus, or a dialog is open.

An invisible layer covers the stage only while floats are asleep, so moving the pointer over a cross-origin player iframe still wakes them. It goes away at once, so the player stays usable.

Floats have no backdrop blur: blur over moving video is expensive.

The dock has no microphone on desktop; the microphone is in the voice pill, as in `1.3d`. Leaving voice turns the microphone off and silences voices for that person only. Screen audio keeps playing, the room connection stays, and other people still see them as connected.

# Related

- [Stage selection per viewer](/rules/stage-selection-per-viewer.md)
- [Room settings and devices](/rules/room-settings-and-devices.md)
- [Leave room must confirm](/rules/leave-room-must-confirm.md)
- [Presence indicators required](/rules/presence-indicators-required.md)
- [Mobile first-class separate layout](/rules/mobile-first-class-separate-layout.md)

[^desktop]: DesktopTheaterLayout
[^rail]: RoomRail
[^chrome]: useFloatingChrome
