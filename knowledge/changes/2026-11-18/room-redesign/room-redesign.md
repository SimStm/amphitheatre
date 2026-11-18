---
type: Change
title: Room redesign
description: The home page, join dialogs, and room now follow the Figma file, with a token system, Storybook, Motion animation, per-viewer stage selection, and updated dependencies.
tags: [web, design-system, theater, dependencies]
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: design
    resource: apps/web/DESIGN.md
    title: Design rules
  - id: tokens
    resource: apps/web/src/index.css
    title: Tokens
  - id: home
    resource: apps/web/src/components/home/home-screen.tsx
    title: Home
  - id: join
    resource: apps/web/src/hooks/use-join-flow.ts
    title: Join flow
  - id: site
    resource: apps/web/src/components/site/site-shell.tsx
    title: Home and site page shell
  - id: room
    resource: apps/web/src/components/theater/theater-screen.tsx
    title: Room
  - id: floats
    resource: apps/web/src/components/room
    title: Room floats and stage
---

# What landed

- **Design system.** Tokens from the Figma Fundamentos page, 22 base components in `components/ui`, `apps/web/DESIGN.md`, Storybook, and a lint check that requires a story for each base component.
- **Home.** Frame `1.2`: create card with the person's name, room name, and public or private choice, join card, the real public room list, and the moving checkered floor.
- **Logo.** The original wordmark and symbol stay on the home page, site pages, and room.
- **Site pages.** `/about` and `/what-is` share the home page shell, buttons, cards, settings dialog, and footer.
- **Join.** Frames `1.4`, `1.5`, and `1.6`, plus name and generic problem dialogs, in one flow used by the home page and invite links.
- **Room.** Full-screen stage with floats merged from `1.3e` and `1.3d`, a people rail that becomes a stream rail, a show or hide control, auto-hide with a setting, a chat and people panel, and a mobile layout with a bottom sheet.
- **People rail.** Selecting a person opens a popover with an arrow pointing at them. It shares its details and actions with the member dialog used by the people panel.
- **Roles.** Owner, admin, and moderator each have an icon and a color in the rail, people panel, member details, and chat.
- **Stage.** Each person picks one stream or a resizing grid. The choice stays in their browser session.
- **Motion.** Entrances, sliding floats, grid reflow, dialog changes, and an animated empty stage, all respecting reduced-motion settings.
- **Dependencies.** Workspace packages, the `Dockerfile`, and Compose image pins.

No API path or payload changed. Removed: the join gate, the header dock, and the pin grid.

Spec, plan, task results, and limitations are in this folder: [spec](spec.md), [plan](plan.md), [tasks](tasks.md).

# Related

- [Figma Fundamentos are the visual source](/rules/figma-fundamentos-visual-source.md)
- [Home and join follow Figma](/rules/home-and-join-follow-figma.md)
- [Original logo on every screen](/rules/original-logo-everywhere.md)
- [Site editorial pages](/rules/site-editorial-pages.md)
- [Room floating interface](/rules/room-floating-interface.md)
- [Stage selection per viewer](/rules/stage-selection-per-viewer.md)
- [Storybook for base components](/rules/storybook-for-base-components.md)
- [Clients](/product/clients/clients.md)
