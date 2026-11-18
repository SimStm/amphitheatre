---
type: Change
title: PWA install, native invite share, and Open Graph
description: Installable PWA with #2e1b08 icon canvas, mobile install banner and hamburger action, Web Share invites, and corrected social/PWA meta.
generated: { by: coding_agent/composer, at: 2026-08-25T07:55:00Z }
sources:
  - id: manifest
    resource: apps/web/public/manifest.webmanifest
    title: Web app manifest
  - id: html
    resource: apps/web/index.html
    title: Meta tags
  - id: share
    resource: apps/web/src/lib/share-invite.ts
    title: shareOrCopyInvite
  - id: install
    resource: apps/web/src/components/chrome/pwa-install.tsx
    title: PWA install UI
---

# What landed

- App icons (192/512 any + maskable, apple-touch, favicons) flattened onto `#2e1b08`. Manifest `background_color` matches; `theme_color` stays the dark shell `#1b110a`.
- Production service worker (`/sw.js`) with a GET `fetch` passthrough so Chromium can install. API/WebSocket paths are not intercepted.
- Compact Home always suggests install (session-dismissible banner). Home hamburger and Settings → General offer **Install as app** until standalone. iOS gets Add to Home Screen copy.
- Invite uses `navigator.share` with title/text in `en` / `pt-BR` / `es` (URL inside the text). Clipboard is the fallback.
- Open Graph / Twitter: `summary_large_image`, 1200×630 image dimensions and alt, Apple web-app meta, `viewport-fit=cover`. Removed the GitHub `canonical` (the live origin is the product URL).

# Why

Users asked for native share on Invite, a first-class PWA with a brown icon background instead of white, and a mobile install path that does not depend on hunting the browser menu.

# Related

- [PWA and native share](/rules/pwa-and-native-share.md)
- [Clients](/product/clients/clients.md)
- [Home follows HTML prototype](/rules/home-and-join-follow-figma.md)
- [Theater header chrome](/rules/room-settings-and-devices.md)
