---
type: Rule
title: App name is Amphitheatre
description: Visible product name is Amphitheatre in UI, i18n, HTML title, and docs. npm packages @coliseum/* and the repo path do not change under this rule.
tags: [product, i18n, branding]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-23T23:50:00Z }
sources:
  - id: i18n
    resource: apps/web/src/locales/en.ts
    title: app.name
  - id: html
    resource: apps/web/index.html
    title: title and meta description
  - id: agents
    resource: AGENTS.md
    title: AGENTS.md
---

# Rule

The app name is **Amphitheatre**. Use that spelling (English) in `en`, `pt-BR`, and `es` (`app.name`), in `<title>`, in the meta description, in the Home wordmark, and in README / AGENTS / knowledge prose.[^i18n][^html]

Do not revert to "Coliseum Theater" in visible copy.

Technical identifiers **do not** need to be renamed under this rule: packages `@coliseum/web`, `@coliseum/api`, `@coliseum/shared`, git folder, Zustand keys, cookies. Only change those if the user asks for an identifier rename.

# Related

- [Home and join follow Figma](/rules/home-and-join-follow-figma.md)
- [i18n en pt es](/rules/i18n-en-pt-es.md)
- [Clients](/product/clients/clients.md)

[^i18n]: apps/web/src/locales/en.ts
[^html]: apps/web/index.html
