---
type: Rule
title: Storybook for base components
description: Every component in apps/web/src/components/ui has a story, and the web lint step fails when one is missing.
tags: [web, design, process]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: check
    resource: apps/web/scripts/check-stories.mjs
    title: Story check
  - id: config
    resource: apps/web/.storybook/main.ts
    title: Storybook config
---

# Rule

Every `apps/web/src/components/ui/<name>.tsx` needs `<name>.stories.tsx` beside it, updated in the same change as the component. `pnpm --filter @coliseum/web lint` runs the check first and fails when a story is missing.[^check]

Stories show each meaningful state, work in both themes, and use no network. `pnpm --filter @coliseum/web storybook` opens them on port 6006; `build-storybook` must keep passing.[^config]

`Room/Layout` renders the whole room with simulated streams, so the rail and grid can be reviewed without LiveKit.

# Related

- [Figma Fundamentos are the visual source](/rules/figma-fundamentos-visual-source.md)

[^check]: Story check
[^config]: Storybook config
