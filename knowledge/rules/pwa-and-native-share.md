---
type: Rule
title: PWA and native share
description: Installable PWA with brown icon canvas, mobile install prompts, and locale-aware Web Share for room invites.
tags: [web, pwa, share, mobile]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-25T07:55:00Z }
sources:
  - id: manifest
    resource: apps/web/public/manifest.webmanifest
    title: Web app manifest
  - id: sw
    resource: apps/web/public/sw.js
    title: Installability service worker
  - id: share
    resource: apps/web/src/lib/share-invite.ts
    title: shareOrCopyInvite
  - id: install
    resource: apps/web/src/components/chrome/pwa-install.tsx
    title: PWA install UI
---

# Rule

Amphitheatre is an **installable PWA** (browser only; no native iOS/Android app). Chromium needs HTTPS (or localhost), a web app manifest, and a service worker with a `fetch` handler. The SW in `apps/web/public/sw.js` is a network passthrough so the app is installable; it does **not** cache the API, WebSockets, or LiveKit. Register it only in production builds. Serve `/sw.js` with `Cache-Control: no-cache`.

**Icons:** raster app icons (any + maskable 192/512, apple-touch 180, favicons) sit on a solid `#2e1b08` canvas, not white or transparent (iOS fills transparency with white). `background_color` in the manifest is `#2e1b08`. Chrome/status `theme_color` stays `#1b110a` in dark (and the light page token when the user picks light). Maskable icons keep the mark inside the inner 80% safe zone.

**Install UI:** while the session is not `display-mode: standalone` (or iOS `navigator.standalone`), compact Home always suggests installing (banner; dismiss is session-only). The Home settings dialog includes **Install as app**, and so does Settings → General in the room. iOS has no `beforeinstallprompt`; show Add to Home Screen steps instead.

**Invite:** desktop and mobile Invite uses `navigator.share` when it exists, with title and text in the active UI locale (`en` / `pt-BR` / `es`). Put the room URL **inside the text** (WhatsApp often ignores `url`). AbortError is silent. If share is missing or fails, copy that same text to the clipboard.

Do not invent an offline-first cache, push notifications, or a store listing.

# Related

- [Clients](/product/clients/clients.md)
- [Home and join follow Figma](/rules/home-and-join-follow-figma.md)
- [Room settings and devices](/rules/room-settings-and-devices.md)
- [i18n en pt es](/rules/i18n-en-pt-es.md)
