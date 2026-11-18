---
type: Rule
title: Mobile first-class separate layout
description: Phone and narrow viewport use MobileTheaterLayout, not desktop with breakpoints.
tags: [mobile, layout, a11y]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-24T22:00:00Z }
sources:
  - id: hook
    resource: apps/web/src/hooks/use-media.ts
    title: useTheaterLayout
  - id: mobile
    resource: apps/web/src/components/theater/mobile-theater-layout.tsx
    title: MobileTheaterLayout
  - id: desktop
    resource: apps/web/src/components/theater/desktop-theater-layout.tsx
    title: DesktopTheaterLayout
  - id: product
    resource: /product/clients/clients.md
    title: Clients
---

# Rule

`useTheaterLayout` chooses `"mobile"` if `pointer: coarse` **or** `max-width: 767px`.[^hook] `useCompactChrome` is the same predicate for the site chrome and settings.

- Mobile: full-screen stage. Title, invite, and the voice pill float at the top; a thumbnail strip (when more than one stream is active) and a full-width dock float at the bottom, and the dock includes the microphone. Chat and People open in a bottom sheet with `role="tab"` tabs that closes by dragging or from its close button. Floats hide like on desktop, except while the sheet is open.[^mobile]
- Desktop: full-screen stage with the floats in [room-floating-interface](/rules/room-floating-interface.md).[^desktop]

Do not implement the mobile theater as “the same three columns with `hidden lg:flex`”. Controls keep a touch target of at least 44px, and the sheet tabs use `role="tab"`.

When the shared broadcast is enabled but **not** playing, do not trap the offline or waiting copy inside a video tile. Show it as a card over the stage; camera and screen tiles stay in place.

Infra: UDP may fail on 4G; LiveKit already publishes ICE/TCP `7881`. Do not assume UDP on the mobile client. Tests: `docs/load-testing.md` section 9.

# Related

- [Clients](/product/clients/clients.md)
- [Room settings and devices](/rules/room-settings-and-devices.md)
- [Reconnect last priority](/rules/reconnect-last-priority.md) (iOS background tab)

[^hook]: useTheaterLayout
[^mobile]: MobileTheaterLayout
[^desktop]: DesktopTheaterLayout
