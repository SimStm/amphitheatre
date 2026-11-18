---
type: Spec
title: Room redesign — spec
description: Contract for the new visual system, the home and join screens, the floating room interface, per-viewer stage selection, and the dependency refresh.
tags: [change, room-redesign, design-system, theater]
---

# Problem

Observed in the repository on 2026-11-18:

- The web client uses a "cockpit" look: a fixed header, a side panel with tabs, a stage grid with shared pin state per client, and Quicksand labels.
- `apps/web/DESIGN.md` documents that older look. There is no Storybook and no animation library.
- The Figma file "Amphitheatre Hub" holds the new direction. Page `01 · Fundamentos` defines colors, type, indicators, and icons. Page `05 · Fluxo 1 · Salas avulsas` defines the screens.
- Dependencies are behind, and the Compose files pin older images.

# Goal

The theater client looks and behaves like the Figma screens, on a documented design system, without changing the API contract or any rule about rooms, roles, media, or moderation.

# Owner decisions

- Centralized login and the Hub shell are out of scope.
- Screens to follow: `1.2` (home), `1.4` (password), `1.5` (room full), `1.6` (invalid invite).
- The room merges `1.3e` and `1.3d`. The people float on the left comes from `1.3e`. The title, the bottom dock, and the chat come from `1.3d`.
- Every float can be shown or hidden from a control at the top right. Floats also hide when the mouse is idle or outside the window for at least 5 seconds, configurable in settings.
- When more than one person transmits, the left float becomes the `1.3d` thumbnail rail.
- Each viewer chooses what fills the screen: one stream, or several selected streams in an automatic full-screen grid. The choice belongs to that viewer alone.
- `01 · Fundamentos` is followed strictly. Motion handles animation. Monospaced type is not used.
- Storybook documents base components, and every new base component must have a story.
- Dependencies and Compose images are refreshed.

Corrections from the owner after the first review, which replace anything below that disagrees:

- The original Amphitheatre logo stays on every screen, including the room. It is the main mark of the product and is not redrawn from the Figma frames.
- The moving checkered floor returns to the home page, as on `/about` and `/what-is`.
- The create card asks for the person's name in its own field, directly above the room name, as before the redesign. The two fields are stacked at every width, never side by side. The name chip in the header and its dialog stay.
- `/about` and `/what-is` use the same header, buttons, cards, settings dialog, and footer as the new home page.
- A person in the left floating rail opens a popover with an arrow pointing at that person, not a modal. It offers the same details and actions as the member dialog. The people list in the panel keeps the dialog.
- Owners, admins, and moderators stand out with their own icon and color wherever people are listed. `01 · Fundamentos` documents the treatment.

# Scope

## Design system

- Semantic tokens in `apps/web/src/index.css`, taken from Fundamentos, for dark and light themes.
- Base components in `apps/web/src/components/ui`, each with a Storybook story.
- A rewritten `apps/web/DESIGN.md`.
- A check that fails when a base component has no story.

## Home (`1.2`)

- Header with the original logo, settings, and a name chip.
- Moving checkered floor behind the page.
- Greeting by time of day and name.
- "Create room" card: the person's name, room name, public or private, optional password.
- "Join room" card: link or code, and the live list of public rooms.

## Join states (`1.4`, `1.5`, `1.6`)

- Modal dialogs over the home screen, used from the home screen and from invite links.
- Password dialog with show/hide, wrong-password state, remaining attempts, and lockout countdown.
- Room-full dialog with occupancy and retry.
- Invalid-invite dialog showing the code that failed.

## Room

- Full-window stage.
- Floats: title, voice pill, invite, people chip, show/hide control, left rail, chat or people panel, dock.
- Left rail: people mode (`1.3e`) and streams mode (`1.3d`).
- Stage: one stream or an automatic grid of selected streams.
- Separate mobile layout with the same tokens.

## Site pages

- `/about` and `/what-is` share the home page header, floor, and footer, and put their content on cards.
- The settings button opens one dialog with theme, language, and app install.

## Dependencies

- Workspace packages, Docker base images, and Compose image pins.

# Out of scope

- Centralized login, accounts, servers, channels, Hub navigation.
- Moderator-driven stage layouts.
- Recording.
- API path or payload changes.
- Redesign of `apps/admin`, beyond dependency updates.

# Expected behavior

## Floating interface

- Floats start visible.
- With auto-hide on, floats hide after the configured time without pointer or keyboard activity. The same applies when the pointer has left the window.
- Moving the pointer, pressing a key, or tapping the stage shows them again.
- Floats do not auto-hide while the pointer is over one, while focus is in a text field, or while a dialog is open.
- The top-right control stays reachable while floats are hidden. Using it to hide keeps floats hidden until it is used again.
- Settings offer 5, 10, 20, and 30 seconds, and off. The default is 5 seconds. The value persists per browser.

## Left rail

- People mode shows present members in voice, then chat-only members in a quieter style.
- Avatars show speaking, camera, screen, muted, and weak connection. Names appear on hover or focus and while speaking.
- Streams mode shows cards grouped as screens and cameras, plus the broadcast when one exists.
- Streams mode starts when more than one stream is active. One person with both a screen and a camera therefore gets streams mode, because each stream is its own card and must stay selectable.

## Stage selection

- Selection is stored only in the viewer's browser session and is never sent to the server.
- Default selection: the broadcast, then the first screen, then the first camera.
- Clicking a card shows that stream alone. The add control, or Ctrl/Cmd+click, adds or removes it from the grid.
- When a selected stream ends, it leaves the selection. If nothing is left, the default applies.
- With one stream, no selection controls appear.
- The grid picks the row and column count that makes tiles largest for the window size.

## Join errors

- `not_found` opens `1.6` with the code.
- `invalid_password` opens `1.4`. Sending no password does not count as a failure, so owners and returning members enter without a prompt.
- `locked_out` shows the countdown and disables submit.
- `room_full` opens `1.5`.
- Room codes stay case-sensitive.

# Edge cases

- No stream: an animated empty stage.
- No public rooms: an empty message in the list.
- LiveKit unavailable: chat still works and the room shows the existing warning.
- OME down: the room keeps working.
- A broadcast is mounted once. Its rail card is a placeholder, not a second player.
- `prefers-reduced-motion`: movement is replaced by short fades.

# Acceptance criteria

1. Home, password, room-full, and invalid-invite screens match the Figma frames at 1440x900 in layout, color, and copy, using the fonts defined in Fundamentos.
2. Public or private is sent on create, and the list shows real public rooms.
3. Each join error opens its own screen, from the home screen and from an invite link.
4. The room shows the merged floats, and each one can be hidden and shown.
5. Floats auto-hide after the configured time and return on activity. Changing the setting changes the delay.
6. The left float switches between people and streams as streams start and end.
7. A viewer can show one stream or a grid of several, and another viewer's stage does not change.
8. Speaking, transmitting, and connection-quality indicators still work and have accessible text.
9. Leaving through Leave or in-app navigation still asks for confirmation.
10. Mobile has its own layout with usable touch targets.
11. All new text exists in `en`, `pt-BR`, and `es`. No emoji appear.
12. Storybook builds, every base component has a story, and the check fails if one is missing.
13. `pnpm typecheck`, `pnpm test`, web tests, web lint, and web build pass.
14. Compose images use explicit version tags, and every Compose file parses.
15. The original logo appears on home, `/about`, `/what-is`, and the room. In the room it opens the leave confirmation.
16. The home page shows the moving floor, and it stays still with reduced motion.
17. Creating a room requires the person's name, in a separate field stacked above the room name. A changed name is saved to the same user, so room roles are kept, and it also applies when joining from the same page.
18. `/about` and `/what-is` have no old header controls, and use the shared buttons, cards, settings dialog, and footer on desktop and mobile.
19. Selecting a person in the left rail opens a popover beside that person with an arrow pointing at them, showing the same details and actions as the member dialog. It closes with its close button, a click outside, Escape, or a second click on the person.
20. Every dialog stays interactive when it is rendered inside a float that ignores pointer events. Actions that need confirmation still open the confirmation dialog from the popover.
21. Owner, admin, and moderator each have an icon and a color used only for that role. They appear in the left rail, the people panel, the member details, and next to chat names. Plain members get no mark, and the role is available to screen readers.
22. `01 · Fundamentos` in Figma documents the role icons, colors, and badges.
