---
type: Tasks
title: Room redesign — tasks
description: Ordered work for the room redesign, with the check for each step and its status.
tags: [change, room-redesign]
---

# Tasks

| # | Task | Depends on | Verification | Status |
|---|---|---|---|---|
| 1 | Update workspace packages, add `motion` and Storybook | - | `pnpm typecheck`, `pnpm test`, web build | done |
| 2 | Update `Dockerfile` and Compose image pins with their docs | - | `docker compose config` on each file | done |
| 3 | Fundamentos tokens, fonts, `DESIGN.md` | 1 | web build, Storybook | done |
| 4 | Base components with stories and the story check | 3 | `pnpm --filter @coliseum/web lint`, Storybook build | done |
| 5 | Home screen `1.2` with public rooms | 4 | browser at 1440x900 against the frame | done |
| 6 | Join dialogs `1.4`, `1.5`, `1.6` and shared join flow | 5 | unit tests, browser from home and invite link | done |
| 7 | Stage selection and grid logic | 1 | unit tests | done |
| 8 | Floating interface and auto-hide setting | 4 | unit tests, browser | done |
| 9 | Room layout: rail, stage, voice pill, dock, panel | 7, 8 | browser, leave confirmation | done |
| 10 | Mobile room layout | 9 | browser at 375x812 | done |
| 11 | Copy in `en`, `pt-BR`, `es` | 5-10 | typecheck against `Messages` | done |
| 12 | Rules, product docs, change record, CHANGELOG, private roadmap status | 1-11 | every acceptance criterion checked | done |
| 13 | Owner corrections: original logo everywhere | 5, 9 | browser on home, site pages, room | done |
| 14 | Owner corrections: moving floor on home | 5 | browser, reduced-motion rule in CSS | done |
| 15 | Owner corrections: name field above room name, stacked | 5, 6 | unit tests, browser create flow | done |
| 16 | Owner corrections: `/about` and `/what-is` in the new style, stories | 4 | browser desktop and mobile, Storybook build | done |
| 17 | Rail person popover and dialog pointer-events fix | 9 | unit tests, browser in a real room, Storybook build | done |
| 18 | Role icons and colors, Fundamentos section | 9 | browser in a real room, Storybook build, Figma screenshot | done |
| 19 | Release 2.0.0: version, changelog, production image | 1-18 | local image build, published release | done |

# Results

Checked on 2026-11-18 on branch `feat/room-redesign`.

| Check | Result |
|---|---|
| `pnpm typecheck` | pass |
| `pnpm test` (API, Bun 1.3.14) | 45 pass |
| `bun test apps/web/src` | 56 pass |
| `pnpm --filter @coliseum/web lint` | no errors; story check passes for 22 base components |
| `pnpm --filter @coliseum/web build`, `build-storybook`, `pnpm --filter @coliseum/admin build` | pass |
| `docker compose config -q` on the four Compose files | pass |

| Criterion | Result | How it was checked |
|---|---|---|
| 1 Screens match Figma | met, with recorded deviations | browser at 1440x900 against exported frames |
| 2 Public or private on create; real public list | met | browser and local API |
| 3 Each join error has its screen | met | wrong password, full room, and invalid code from invite links; dialog logic in unit tests |
| 4 Merged floats, each can hide | met | browser, `Room/Layout` stories |
| 5 Auto-hide and setting | met | floats left after the idle time; setting saved in the browser; hold rules in unit tests |
| 6 Rail switches between people and streams | met with simulated streams | `Room/Layout` stories |
| 7 One stream or grid, per viewer | met with simulated streams | story with three selected streams; logic in unit tests |
| 8 Indicators with accessible text | met in the interface | accessible names read in the browser; live LiveKit data not exercised |
| 9 Leave and navigation confirm | met | Back inside the app opened the dialog; confirming returned home |
| 10 Mobile layout | met | 375x812, no horizontal scroll, sheet opened |
| 11 Copy in three languages, no emoji | met | typecheck against `Messages`; script found no missing key |
| 12 Storybook | met | build and lint check |
| 13 Project checks | met | table above |
| 14 Compose images pinned and parsing | met | `docker compose config -q` |
| 15 Original logo on home, site pages, and room | met | browser at 1440x900 and 375x812; the room logo opened the leave dialog |
| 16 Moving floor on home | met | computed animation `infinite-grid-fly` in the browser; the existing reduced-motion CSS rule stops it |
| 17 Name above room name | met | the two fields are stacked at every width; empty name blocked the form; a new name was saved on create and on join by code, with the same `userId`; `nameToSave` unit tests |
| 18 Site pages in the new style | met | browser on desktop and mobile with no horizontal scroll, settings dialog, `Site/Pages` stories |
| 19 Rail person popover | met | real room: the popover opened beside the person with its arrow on them, and closed with X, outside click, Escape, and a second click; it followed a switch to another person and stayed open past the auto-hide time |
| 21 Role icons and colors | met | real room with an owner, admin, moderator, and member: marks in the rail, badges in the people panel, icon and name color in chat, and the role in each rail button's accessible name |
| 22 Fundamentos documents roles | met | new `Cargos` section with mark and badge components on `01 · Fundamentos`, checked by screenshot |
| 20 Dialogs inside floats | met | from the popover, mute confirmation cancelled by button and by scrim returned to the popover, and a confirmed kick removed a test guest; the panel's member dialog closed with X and outside click |

# Limitations

- The first pass ran with Docker off. LiveKit was later exercised with a generated camera track and a second participant, in [dev-media-keys-from-env](/changes/2026-11-18/dev-media-keys-from-env/dev-media-keys-from-env.md). A real microphone, camera, screen share, a live broadcast, and the production image still need a manual pass.
- The Figwright plugin was closed, so the Figma section was added through the Figma connector.
- The stream rail and grid with several streams were checked with simulated video in Storybook.
- After a cancelled confirmation the popover returns, but keyboard focus does not go back into it. Escape still closes it.
- The light theme is derived from the dark tokens. The Figma file has no light screens to compare it with.
