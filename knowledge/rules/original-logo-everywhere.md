---
type: Rule
title: Original logo on every screen
description: The original Amphitheatre logo is the main mark of the product. Every screen keeps it, and it is never redrawn or replaced by a logo from a design frame.
tags: [web, brand, design]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T18:00:00Z }
sources:
  - id: brand
    resource: apps/web/src/components/chrome/brand-mark.tsx
    title: BrandMark and BrandWordmark
  - id: header
    resource: apps/web/src/components/chrome/site-header.tsx
    title: SiteHeader
  - id: room
    resource: apps/web/src/components/room/room-top.tsx
    title: RoomTitle
---

# Rule

The original logo files in `apps/web/src/assets` are the Amphitheatre brand. Use `BrandWordmark` or `BrandMark`.[^brand] Do not redraw them, and do not replace them with a logo from a Figma frame or a new SVG.

- The home page, `/about`, and `/what-is` show the wordmark in `SiteHeader`, linking home.[^header]
- The room shows the wordmark in its title float. Where space is short, it shows the original symbol. In the room the logo opens the leave confirmation.[^room]
- The not-found page and Settings > About also use the original files.

This rule wins over the Figma frames.

# Related

- [Figma Fundamentos are the visual source](/rules/figma-fundamentos-visual-source.md)
- [App name is Amphitheatre](/rules/app-name-amphitheatre.md)
- [Leave room must confirm](/rules/leave-room-must-confirm.md)

[^brand]: BrandMark and BrandWordmark
[^header]: SiteHeader
[^room]: RoomTitle
