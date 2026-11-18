---
type: Rule
title: Design tokens light dark
description: Colors and radii come from CSS tokens in index.css. Theme via data-theme=light|dark. No loose hex in components.
tags: [design, theme, css]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-22T08:21:00Z }
sources:
  - id: css
    resource: apps/web/src/index.css
    title: @theme and :root / [data-theme=dark]
  - id: ui
    resource: apps/web/src/stores/ui-store.ts
    title: theme persistence
  - id: product
    resource: /product/clients/clients.md
    title: Clients
---

# Rule

Tokens in `apps/web/src/index.css`, with the dark values taken from the Figma Fundamentos page: surfaces (`surface-page`, `surface-raised`, `surface-sunken`, `surface-row`, `surface-bright`, `surface-float`), ink (`ink` through `ink-off`, `ink-on-accent`), accent, border, danger, speaking, selfhost, attention, radii (`radius-tile`, `radius-control`, `radius-panel`, `radius-pill`). The light theme is derived from the same names; the Figma file has no light screens.[^css]

Theme: `document.documentElement.dataset.theme = "light" | "dark"`. The user choice lives in Zustand persist `coliseum.ui` (`theme`); locale **does not** enter that persist (it lives in `coliseum.locale` only after an explicit choice).[^ui] Tailwind variant: `@custom-variant dark (&:where([data-theme="dark"], ...))`.

In component JSX/CSS use theme utilities (`bg-surface-page`, `text-ink`, `border-border`, `bg-accent`). Do not invent a parallel palette. Narrow exception: video player `bg-black` on the stage (content, not chrome).

Fonts: Hanken Grotesk (titles) and Raleway (text), behind `--font-display` and `--font-sans`. See [apps/web/DESIGN.md](https://github.com/simstm/amphitheatre/blob/main/apps/web/DESIGN.md) and [Figma Fundamentos are the visual source](/rules/figma-fundamentos-visual-source.md).

Do not add DaisyUI/shadcn “as the house default” if the theater already has this system — this repo **does not** use the Next/shadcn stack; it is Vite + its own tokens.

# Related

- [Clients](/product/clients/clients.md)
- [No emoji in UI or docs](/rules/no-emoji-in-ui-or-docs.md)

[^css]: @theme and :root / [data-theme=dark]
[^ui]: theme persistence
