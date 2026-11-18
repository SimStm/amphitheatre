---
type: Change
title: Editorial What is and About pages
description: /what-is and /about leave the glass card, use a full-bleed grid with large type, and explain the product in plain language without naming competing products.
generated: { by: coding_agent/composer, at: 2026-08-25T19:35:00Z }
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
---

# What landed

`/what-is` and `/about` no longer sit in a centered overlay card. The main column is full width: a large display title, a lead in page ink, then a two-column story grid. `/what-is` talks about the gathering, the room, the small-by-design choices, and what is left out — without naming other products. `/about` keeps version, license, author, GitHub, coffee, and software credits, with human descriptions. Settings → About stays the compact modal panel. Copy in `en` / `pt-BR` / `es`.

# Why

A narrow card fought the reading task. Visitors needed a clearer story of what Amphitheatre is for, not a stack dump or a comparison list.

# Related

- [Site editorial pages](/rules/site-editorial-pages.md)
- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Clients](/product/clients/clients.md)
- [i18n en pt es](/rules/i18n-en-pt-es.md)
