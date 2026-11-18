---
type: Change
title: What is Amphitheatre and About pages
description: Home footer nav links to /what-is and /about. About reuses the Settings About panel. What is Amphitheatre is the product explainer.
generated: { by: coding_agent/composer, at: 2026-08-25T18:40:00Z }
sources:
  - id: footer
    resource: apps/web/src/components/site/site-footer.tsx
    title: SiteFooter
  - id: router
    resource: apps/web/src/router.tsx
    title: /what-is and /about
---

# What landed

Home has a centered footer nav: **What is Amphitheatre?** (`/what-is`) and **About** (`/about`), plus the existing open-source / no-recording line. Those routes started as a card wrapper around the Settings About panel and a short explainer. They are now full-bleed editorial pages — see [site-editorial-pages](/changes/2026-08-25/site-editorial-pages/site-editorial-pages.md). Copy in `en` / `pt-BR` / `es`. No emoji.

# Why

The About content lived only inside a room Settings modal. New visitors on Home had no place to read what the product is.

# Related

- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Clients](/product/clients/clients.md)
- [App name is Amphitheatre](/rules/app-name-amphitheatre.md)
