---
type: Product
title: Clients
description: Vite React SPA with separate desktop and mobile layouts, i18n en/pt-BR/es, and light/dark theme via tokens.
tags: [web, i18n, theme, mobile]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-22T08:21:00Z }
sources:
  - id: web
    resource: apps/web/package.json
    title: @coliseum/web
  - id: router
    resource: apps/web/src/router.tsx
    title: / and /rooms/$roomId
  - id: theater
    resource: apps/web/src/components/theater/theater-screen.tsx
    title: TheaterScreen
  - id: infinite-grid
    resource: apps/web/src/components/home/infinite-grid-3d.tsx
    title: InfiniteGrid3D
  - id: i18n-rule
    resource: /rules/i18n-en-pt-es.md
    title: i18n
  - id: mobile-rule
    resource: /rules/mobile-first-class-separate-layout.md
    title: Separate mobile
  - id: tokens-rule
    resource: /rules/design-tokens-light-dark.md
    title: Tokens
---

# Implemented

SPA `@coliseum/web`: Vite 8, React 19, TanStack Router + Query, RHF+Zod, Zustand, i18next, livekit-client, OvenPlayer, hls.js, Tailwind 4, Sonner, Tabler Icons.[^web]

Routes: `/` (create/join), `/rooms/$roomId` (theater), `/what-is`, `/about`. An unknown page uses `NotFoundScreen`. A room URL always goes through the join flow: a missing room opens the invalid-invite dialog, and password, full-room, and name dialogs open over the home page.[^router]

Vite proxy: `/api` -> `http://localhost:3001` with `ws: true`. Port **5173**. Preview 4173 with the same proxy.

**Desktop:** `DesktopTheaterLayout` is a full-screen stage with floating title, voice pill, invite, people, dock, and a chat or people panel. The left float lists people; with more than one stream it becomes a thumbnail rail. Each person chooses one stream or a resizing grid for their own stage. Floats can be hidden and hide when idle (Settings → General). **Mobile:** `MobileTheaterLayout` has the same full-screen stage, a thumbnail strip, a bottom dock with the microphone, and chat and people in a bottom sheet. Unread chat shows on the dock and in the document title. When broadcast is enabled but not playing, a card sits over the stage. Rules: [room-floating-interface](/rules/room-floating-interface.md), [stage-selection-per-viewer](/rules/stage-selection-per-viewer.md).[^theater]

Theme `light` | `dark` on `data-theme` (persisted in `coliseum.ui` when the user switches). Locales `en` | `pt-BR` | `es`: first visit follows the browser; an explicit choice goes to `coliseum.locale`. Header with theme and language toggles.

**Home:** follows Figma frame `1.2`: greeting, create card (name, public or private, optional password), join card with the public room list, and footer links to What is Amphitheatre and About. `/what-is` is a readable document. `/about` is centered: open-source copy, GitHub outline + coffee primary, and a grid of OvenMediaEngine, OvenPlayer, LiveKit, and Valkey. Settings → About stays the compact panel. Compact Home suggests installing as a PWA until the session is standalone. Visual rules are in `apps/web/DESIGN.md`; base components are in Storybook (`pnpm --filter @coliseum/web storybook`).

The stack is **not** Next.js / shadcn / DaisyUI. Do not force that stack in this repo. The **operator console** is a separate package `@coliseum/admin` (Mantine 9, port 5174 / `ADMIN_PORT`), not mixed into this theater SPA. See [Operator admin](/product/operator-admin/operator-admin.md).

**PWA:** `manifest.webmanifest` (standalone, maskable + any icons on `#2e1b08`, `theme_color` `#1b110a`), Apple web-app meta, and a production service worker with a `fetch` passthrough so Chromium will offer install. Invite uses `navigator.share` with copy in the active locale.

# Intended, not implemented

- Native iOS/Android app (browser / PWA only)
- Offline-first cache (the service worker does not store the API or media)

# Related

- [Vision](/product/vision/vision.md)
- [No emoji](/rules/no-emoji-in-ui-or-docs.md)
- [App name is Amphitheatre](/rules/app-name-amphitheatre.md)
- [Home and join follow Figma](/rules/home-and-join-follow-figma.md)
- [Site editorial pages](/rules/site-editorial-pages.md)
- [PWA and native share](/rules/pwa-and-native-share.md)
- [Web theater SPA](/changes/2026-08-22/web-theater-spa/web-theater-spa.md)

[^web]: @coliseum/web
[^router]: / and /rooms/$roomId
[^theater]: TheaterScreen
