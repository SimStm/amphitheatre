---
type: Change
title: Full-height stage and horizontal wordmark
description: Stream fills the frame after the dock moved to the header; room and About branding uses the Home horizontal logo.
generated: { by: coding_agent/composer, at: 2026-08-24T06:50:00Z }
sources:
  - id: stage
    resource: apps/web/src/components/theater/stage.tsx
    title: Stage without pb-24
  - id: wordmark
    resource: apps/web/src/components/chrome/brand-mark.tsx
    title: BrandWordmark
---

# What landed

- Removed the `pb-24` the stage still reserved for the old dock. Desktop flex chain (`flex-1` + `min-h-0`) and `auto-rows-fr` grid so the stream occupies 100% of the frame height.
- Shared `BrandWordmark` (full horizontal logo) on Home, the room header, and the About tab. The 1:1 circle stays only where a compact avatar/mark makes sense.

# Why

With the dock in the header, bottom padding left an empty strip on the stage. The room still showed the 1:1 icon + “Amphitheatre” text instead of the Home wordmark.

# Related

- [Theater header chrome](/rules/room-settings-and-devices.md)
- [App name is Amphitheatre](/rules/app-name-amphitheatre.md)
