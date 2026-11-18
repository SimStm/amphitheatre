---
type: Change
title: Settings modal, About, and reload chrome
description: Stage-Devices-About order; centered About with AGPLv3 and versions; modal without double-scroll; reload next to the pin.
generated: { by: coding_agent/composer, at: 2026-08-24T07:15:00Z }
sources:
  - id: settings
    resource: apps/web/src/components/theater/room-settings-modal.tsx
    title: RoomSettingsModal
  - id: about
    resource: apps/web/src/components/theater/about-panel.tsx
    title: AboutPanel
  - id: dialog
    resource: apps/web/src/components/ui/dialog.tsx
    title: Dialog xl fill
  - id: chrome
    resource: apps/web/src/components/theater/stage-tile.tsx
    title: StageTileChrome reload
---

# What landed

- Settings modal tabs: Stage (admin only), Devices, About (always last).
- Centered About: description (open-source AGPLv3, Lucas Sims / SIMSDEV), buttons (coffee and portfolio), then Made with (OME 0.21.0, OvenPlayer 0.10.53, LiveKit 1.13.5, Valkey 9.1.1 with license and use). Version `0.1.0`. No API stack paragraph (Bun/Hono).
- Dialog xl with fixed height; header `items-center` + Raleway. Tabs do not scroll; only the tab content does. That removes the double-scroll.
- Reload stream at the top right of the tile, to the left of the pin, on the same 3s hover. The OME failure overlay still keeps the button visible.

# Why

About in the middle and dialog + panel scroll made for poor UX. Reload in the lower corner covered the player and did not follow the pin chrome.

# Related

- [Theater header chrome](/rules/room-settings-and-devices.md)
- [AGPLv3 and CLA](/rules/agplv3-and-cla.md)
- [No recording](/rules/no-recording.md)
- [Valkey for LiveKit](/rules/valkey-for-livekit.md)
- [Pin Compose images](/rules/pin-compose-images.md)
