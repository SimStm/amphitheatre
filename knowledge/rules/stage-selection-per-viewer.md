---
type: Rule
title: Stage selection per viewer
description: Each person chooses which streams fill their own stage. The choice stays in that browser session and never reaches the server or other people.
tags: [web, theater, livekit]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T12:00:00Z }
sources:
  - id: selection
    resource: apps/web/src/lib/stage-selection.ts
    title: Selection rules
  - id: grid
    resource: apps/web/src/lib/stage-grid-layout.ts
    title: computeGrid
  - id: store
    resource: apps/web/src/stores/stage-store.ts
    title: useStageStore
  - id: view
    resource: apps/web/src/components/room/stage-view.tsx
    title: StageView
---

# Rule

Streams are screens, cameras, and the room broadcast. Without a choice the stage shows the broadcast, else the first screen, else the first camera.[^selection]

- Clicking a card shows only that stream.
- The add control, or Ctrl or Cmd with a click, adds or removes it from the stage.
- A stream that ends leaves the selection. An empty selection returns to the default.
- With a single stream there is nothing to choose, so no selection controls appear.

Several selected streams form a full-screen grid. The column count is the one that makes each 16:9 tile largest.[^grid] It recalculates when the stage size or the selection changes.

The choice lives in memory for that browser session and is cleared on room change.[^store] Do not send it to the API or to LiveKit. A moderator-driven layout is a different feature.

Mount the broadcast player only on the stage.[^view] Its card in the rail is a placeholder, so the player never runs twice.

# Related

- [Room floating interface](/rules/room-floating-interface.md)
- [Broadcast opt-in](/rules/broadcast-opt-in.md)
- [OME WebRTC first ABR](/rules/ome-webrtc-first-abr.md)

[^selection]: Selection rules
[^grid]: computeGrid
[^store]: useStageStore
[^view]: StageView
