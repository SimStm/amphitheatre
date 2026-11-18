---
type: Rule
title: Figma Fundamentos are the visual source
description: Colors, type, indicators, and icons come from the Fundamentos page of the Figma file, through the tokens and rules in apps/web/DESIGN.md. Animation uses Motion.
tags: [design, web, motion]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: design
    resource: apps/web/DESIGN.md
    title: Design rules
  - id: css
    resource: apps/web/src/index.css
    title: Tokens
---

# Rule

The page `01 · Fundamentos` of the Figma file **Amphitheatre Hub** defines colors, type, indicators, and icons. Screens follow their frames. When the code and Figma disagree, Figma wins, unless a deviation is recorded in the change plan with its reason.[^design]

- Build screens from tokens and from `apps/web/src/components/ui`. No loose colors in components.[^css]
- Fonts are Hanken Grotesk for titles and Raleway for text. **No monospaced type in the interface.**
- Icons are Tabler, stroke 1.75 to 1.9. No emoji.
- Animate with `motion/react`. Every animation shows a state change, a relationship, or feedback. Prefer transform, opacity, clip-path, and filter. `MotionConfig reducedMotion="user"` stays at the app root.

# Related

- [Design tokens light dark](/rules/design-tokens-light-dark.md)
- [Storybook for base components](/rules/storybook-for-base-components.md)
- [No emoji in UI or docs](/rules/no-emoji-in-ui-or-docs.md)

[^design]: Design rules
[^css]: Tokens
