---
type: Rule
title: Home and join follow Figma
description: The home page and the password, full-room, and invalid-invite dialogs follow frames 1.2, 1.4, 1.5, and 1.6 of the Figma file. Every join failure has its own dialog.
tags: [web, home, join, design]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: home
    resource: apps/web/src/components/home/home-screen.tsx
    title: HomeScreen and HomeLayout
  - id: dialogs
    resource: apps/web/src/components/join/join-dialogs.tsx
    title: JoinDialogs
  - id: flow
    resource: apps/web/src/hooks/use-join-flow.ts
    title: useJoinFlow
  - id: logic
    resource: apps/web/src/lib/join-flow.ts
    title: attemptJoin
---

# Rule

The source is the page `05 · Fluxo 1 · Salas avulsas` of the Figma file **Amphitheatre Hub**. Frame `1.2` is the home page, `1.4` the password dialog, `1.5` the full room, and `1.6` the invalid invite.[^home][^dialogs]

The home page shows a greeting, a create card, and a join card with the public rooms from `GET /api/rooms`, over the moving checkered floor (`InfiniteGrid3D`). The owner chose to keep this floor, the [original logo](/rules/original-logo-everywhere.md), and the name field, although frame `1.2` does not show them.

The create card asks for the person's name in its own field, stacked above the room name at every width, and both are required. The chip in the header changes the same name through a dialog. A changed name is saved with `POST /api/session` before creating or joining, which keeps the same `userId` and therefore the person's room roles. The name dialog still appears when a join needs a name and none was typed.

Home and invite links share one flow.[^flow][^logic] The dialog opens over the home page in both cases:

| API result | What the person sees |
|---|---|
| `not_found` | `1.6` with the code exactly as typed |
| `invalid_password` | `1.4`; no password sent does not count as a failure |
| `locked_out` | `1.4` with a countdown and the submit button disabled |
| `room_full` | `1.5` with a retry |
| `unauthorized` | name dialog, then the join continues |
| `duplicate_display_name` | name dialog with the error |
| anything else | generic problem dialog with a retry |

Owners and returning members enter without a password prompt. Room codes stay case-sensitive: no CSS uppercase, no autocapitalize.

The public list shows only what the API exposes. Do not invent voice counts, member names, or live duration for people outside the room.

The links to `/what-is` and `/about` stay in the home footer ([site-editorial-pages](/rules/site-editorial-pages.md)).

# Related

- [Figma Fundamentos are the visual source](/rules/figma-fundamentos-visual-source.md)
- [Original logo on every screen](/rules/original-logo-everywhere.md)
- [Join errors are explicit](/rules/join-errors-are-explicit.md)
- [Password lockout](/rules/password-lockout-3-strikes-5-min.md)
- [Clients](/product/clients/clients.md)

[^home]: HomeScreen and HomeLayout
[^dialogs]: JoinDialogs
[^flow]: useJoinFlow
[^logic]: attemptJoin
