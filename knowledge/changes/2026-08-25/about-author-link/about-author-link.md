---
type: Change
title: About author link, no Portfolio button
description: About credits Lucas Sims (SIMSDEV) as a link to sims.dev.br. GitHub is an outline button; Buy me a coffee is the filled primary.
generated: { by: coding_agent/composer, at: 2026-08-25T06:35:00Z }
sources:
  - id: about
    resource: apps/web/src/components/theater/about-panel.tsx
    title: AboutPanel
---

# What landed

Settings → About no longer has a Portfolio button. “Lucas Sims (SIMSDEV)” in the created-by line links to `https://sims.dev.br`. CTAs: Source on GitHub as an outline (`secondary`) button to the repo; Buy me a coffee as the filled (`primary`) button.

# Why

A theater About screen is for version, license, source, and optional support. A Portfolio button next to coffee read as a hiring CTA. GitHub and coffee are both on-mission; coffee stays the filled primary so support is the visual ask, and GitHub is an outline button so the repo stays obvious without matching coffee’s weight.

# Related

- [Theater header chrome](/rules/room-settings-and-devices.md)
- [Clients](/product/clients/clients.md)
