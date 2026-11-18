---
type: Rule
title: Join errors are explicit
description: GET /api/rooms/:id returns an existing room even if private. Join uses not_found vs invalid_password. Room ids are case-sensitive and must not be CSS-uppercased.
tags: [api, join, ux]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-25T18:40:00Z }
sources:
  - id: rooms
    resource: apps/api/src/rooms.ts
    title: getVisible and join
  - id: theater
    resource: apps/web/src/components/theater/theater-screen.tsx
    title: Invite join flow
  - id: home
    resource: apps/web/src/components/home/home-screen.tsx
    title: Home join
---

# Rule

An invite link `/rooms/:id` must open the **join flow** when the room exists, including private and password-protected rooms. `GET /api/rooms/:id` returns **404 `not_found` only when the id is missing**. Existence is not hidden behind a fake 404 for private rooms. Non-members get the public preview (`id`, `name`, `hasPassword`, …) **without** `members`.

`POST /api/rooms/:id/join`:

| Situation | Error |
|---|---|
| Room id does not exist | `not_found` (404). Does **not** count as a lockout strike. |
| Password missing or wrong | `invalid_password` (403), public or private. Empty password does not lock out. Wrong password still uses the 3-strike lockout. |
| No display name | Client validation + `join.needName`. Do not map this to a password error. |

The legacy code `cannot_join` stays in `errorCodes` but the API no longer emits it for missing rooms or wrong passwords. The SPA must not treat `cannot_join` as “wrong password”.

A missing room opens the invalid-invite dialog with the exact code, from the home page and from an invite link. See [home-and-join-follow-figma](/rules/home-and-join-follow-figma.md).

Room ids use a mixed-case alphabet. The Home code field must **not** use `text-transform: uppercase` (that only changes the look and makes people doubt the code). Disable mobile autocapitalize on that input.

# Related

- [API contract frozen](/rules/api-contract-frozen.md)
- [Password lockout](/rules/password-lockout-3-strikes-5-min.md)
- [Not found infinite grid](/rules/not-found-infinite-grid.md)
- [Identity and roles](/product/identity-and-roles/identity-and-roles.md)
