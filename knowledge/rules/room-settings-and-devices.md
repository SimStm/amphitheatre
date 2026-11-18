---
type: Rule
title: Room settings and devices
description: Tabs, layout, and behavior of the room settings dialog, including device selection and the microphone test.
tags: [web, theater, ux]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: modal
    resource: apps/web/src/components/theater/room-settings-modal.tsx
    title: RoomSettingsModal
  - id: general
    resource: apps/web/src/components/theater/general-settings-panel.tsx
    title: GeneralSettingsPanel
  - id: devices
    resource: apps/web/src/components/theater/media-settings-panel.tsx
    title: MediaSettingsPanel
  - id: about
    resource: apps/web/src/components/theater/about-panel.tsx
    title: AboutPanel
---

# Rule

The dock opens Settings. Tabs, in order: **General**, Stage (admin only), Devices, About last.

General holds theme, language, the time before floats hide, **Allow microphone** and **Allow camera** ([media-permissions-need-a-user-gesture](/rules/media-permissions-need-a-user-gesture.md)), and **Install as app** while the session is not a standalone PWA ([pwa-and-native-share](/rules/pwa-and-native-share.md)).

Invite uses the device share sheet with a localized title and text containing the room URL. Clipboard is the fallback.

The dialog has a fixed height on desktop (`min(40rem, 100dvh - 2rem)`) with fixed vertical tabs, and is full screen on mobile with equal-width horizontal tabs. Only the tab panel scrolls.

About shows the version from the **root** `package.json`, injected at Vite build. Do not hardcode it. **Source on GitHub** is an outline button and **Buy me a coffee** is the primary button. The author line links to `https://sims.dev.br`. Do not add a Portfolio button.

Devices on desktop uses **two columns** (microphone and input volume, speaker and output volume). The microphone test and level meter span both columns; the camera is a full-width block below. Device preferences stay in `localStorage` (`coliseum.devices`).

**Microphone test:** starting it mutes the LiveKit microphone if it was on (and the member is not moderator-muted), plays a self-listen loopback, and shows a level meter. Stopping it, leaving Devices, or closing the dialog ends the loopback and turns the microphone back on **only if it was on before**.

# Related

- [Room floating interface](/rules/room-floating-interface.md)
- [AGPLv3 and CLA](/rules/agplv3-and-cla.md)
- [PWA and native share](/rules/pwa-and-native-share.md)
