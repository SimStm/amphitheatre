---
type: Rule
title: Site editorial pages
description: /what-is and /about use the home page shell and shared cards, with plain-language copy. What-is names no competing products.
tags: [web, copy, home]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T18:00:00Z }
sources:
  - id: what-is
    resource: apps/web/src/components/site/what-is-page.tsx
    title: WhatIsPage
  - id: about
    resource: apps/web/src/components/site/about-page.tsx
    title: AboutPage
  - id: locales
    resource: apps/web/src/locales/en.ts
    title: pages.* copy
  - id: clients
    resource: /product/clients/clients.md
    title: Clients
---

# Rule

`/what-is` and `/about` use `ContentPage`, built on the same `SiteShell` as the home page: moving floor, `SiteHeader` with the original logo and settings, and the floating `SiteFooter`. Their content sits on `Card` surfaces, because text directly over the moving floor is hard to read.

Layout:

- `/what-is`: a badge, title, lead, the "open a room" button, and four cards in two columns.
- `/about`: the version badge, title, and lead, a project card, and a card that lists the four shipped open-source tools (OvenMediaEngine, OvenPlayer, LiveKit, Valkey) with a short human description each. Buy me a coffee is the **primary** button and GitHub is **secondary**. There is no "open a room" button. Settings > About stays the compact `AboutPanel` in the room settings.
- Both pages stack into one column on mobile, with no horizontal scroll.

Copy:

- Plain language. Say what a room is for and how it was thought (small gathering, no account, no recording), not stack jargon (SFU, RTMP, ingest, RESP).
- **`/what-is` must not name competing products or catalogs** (no Netflix, no Discord, no other watch-party brands). Credits for the software we ship live on `/about` and in Settings → About, with human descriptions.

Icons: Tabler only. No emoji.

# Related

- [Not found infinite grid](/rules/not-found-infinite-grid.md)
- [Original logo on every screen](/rules/original-logo-everywhere.md)
- [i18n en pt es](/rules/i18n-en-pt-es.md)
- [No emoji in UI or docs](/rules/no-emoji-in-ui-or-docs.md)
- [Design tokens light dark](/rules/design-tokens-light-dark.md)
- [Clients](/product/clients/clients.md)
