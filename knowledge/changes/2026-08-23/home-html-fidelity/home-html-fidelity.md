---
type: Change
title: Home aligned with the Amphitheatre HTML prototype
description: Home layout mirrors home.html (hero, decorative cards, 480px dashboard). initials export crash fixed. Theme/locale on the center pill.
tags: [web, home, design]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-23T22:00:00Z }
sources:
  - id: home-screen
    resource: apps/web/src/components/home/home-screen.tsx
    title: HomeScreen
  - id: prototype
    resource: knowledge/references/prototypes/home.html
    title: Prototype
  - id: rule
    resource: /rules/home-and-join-follow-figma.md
    title: Fidelity rule
---

# What landed

- Home in three zones like the HTML: brand, center pill, profile with status dot.
- Hero with line break (`whitespace-pre-line`), 160x120 atmosphere-only cards, `xl:w-[480px]` panel with `p-1`/`p-8`.
- Center pill = theme and locale (not Discover/Library/Create routes).
- `--surface-bright` token for the Join button, matching the prototype's surface-bright.
- Boot fix: `export { initials }` in the header crashed the SPA (empty `#root`).

# Why

Request to compare React with the HTML in the browser and close the Home visual gap, without turning nav/card mocks into features.

# Related

- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Clients](/product/clients/clients.md)
