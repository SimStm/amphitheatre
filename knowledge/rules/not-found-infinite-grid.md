---
type: Rule
title: Not found infinite grid
description: An unknown route uses the InfiniteGrid3D background, with title, copy, and home button centered. A missing room opens the invalid-invite dialog instead.
tags: [web, home, ux]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-24T06:40:00Z }
sources:
  - id: notfound
    resource: apps/web/src/components/not-found-screen.tsx
    title: NotFoundScreen
  - id: theater
    resource: apps/web/src/components/theater/theater-screen.tsx
    title: GET room 404
---

# Rule

Pages that do not exist (`/anything`) render `NotFoundScreen`: `InfiniteGrid3D`, content **centered** (mark, title, copy, button to `/`).

Room URLs never use this screen. A missing room opens the invalid-invite dialog with the code, and an existing room opens the join flow. See [home-and-join-follow-figma](/rules/home-and-join-follow-figma.md) and [join-errors-are-explicit](/rules/join-errors-are-explicit.md).

Copy in `en` / `pt-BR` / `es`. No emoji.

# Related

- [Home and join follow Figma](/rules/home-and-join-follow-figma.md)
- [Identity and roles](/product/identity-and-roles/identity-and-roles.md)
- [i18n en pt es](/rules/i18n-en-pt-es.md)
