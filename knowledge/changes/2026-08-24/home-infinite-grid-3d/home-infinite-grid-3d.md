---
type: Change
title: Infinite grid 3D on the Home background
description: React InfiniteGrid3D component (CSS-only, size/color/angle props) on the Home background, replacing the solid radial.
tags: [web, home, design]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-24T03:10:00Z }
sources:
  - id: component
    resource: apps/web/src/components/home/infinite-grid-3d.tsx
    title: InfiniteGrid3D
  - id: home
    resource: apps/web/src/components/home/home-screen.tsx
    title: HomeScreen
  - id: css
    resource: apps/web/src/index.css
    title: Grid styles
  - id: rule
    resource: /rules/home-and-join-follow-figma.md
    title: Home follows HTML prototype
  - id: pen
    resource: https://codepen.io/TonyBaldascino/pen/ZOjXBp
    title: CSS 3D Animated Grid
---

# What landed

- `InfiniteGrid3D` behind the Home content: perspective + `rotateX` + a pattern that advances one cell per cycle.
- Props: `cellSize` (square shortcut), `cellWidth`/`cellHeight` (aspect), `lineWidth`, `lineColor`, `fadeColor`, `angle`, `perspective`, `horizon`, `duration`, `opacity`.
- Default colors from tokens (`--accent`, `--home-page`). `prefers-reduced-motion` pauses the animation.
- No WebGL, Three.js, or new dependencies.

# Why

Request to apply the 3D Infinite Grid effect (CodePen ZOjXBp) on the Home background as a customizable component.

# Related

- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Clients](/product/clients/clients.md)
- [Design tokens light dark](/rules/design-tokens-light-dark.md)
