---
type: Plan
title: Room redesign — plan
description: How the theater client moves to the Figma visual system, with the files it touches, the decisions taken, the risks, and the known deviations.
tags: [change, room-redesign, design-system, theater]
---

# Current code

Observed on 2026-11-18, branch `feat/room-redesign` from `main` at `0999d3e`.

- `apps/web/src/index.css` holds `@theme` tokens (`surface-*`, `ink*`, `accent*`, `border*`, `danger*`) consumed across the app, plus cockpit classes (`.cockpit-shell`, `.dock`, `.stage-frame`, `.glass-panel`).
- `apps/web/src/components/home/home-screen.tsx` holds create and join forms. `lib/api.ts` has no `listRooms()` and does not send `isPublic`, although the API accepts it.
- `apps/web/src/components/theater/theater-screen.tsx` orchestrates session, join, leave guard, and the desktop and mobile layouts. `join-gate.tsx` is the invite-link gate.
- `stage.tsx`, `stage-grid.tsx`, and `stage-tile.tsx` render a shared grid with pin state per client.
- `hooks/use-livekit.ts` exposes `tiles`, device controls, and output and input volume.
- `hooks/use-room-socket.ts` feeds `mediaByUserId` for every member from `presence`, so an entry there does not prove the person is in voice.
- `components/ui` has `alert`, `avatar`, `badge`, `button`, `dialog`, `field`, `input`, `skeleton`, `tooltip`.

# Components affected

| Area | Files |
|---|---|
| Tokens and docs | `apps/web/src/index.css`, `apps/web/DESIGN.md`, `apps/web/index.html` |
| Base components | `apps/web/src/components/ui/*`, each with `*.stories.tsx` |
| Storybook | `apps/web/.storybook/*`, `apps/web/scripts/check-stories.mjs` |
| Home | `apps/web/src/components/home/*` |
| Join dialogs | new `apps/web/src/components/join/*`, `lib/join-flow.ts` |
| Room | `apps/web/src/components/theater/*`, new `components/room/*` |
| State | `stores/ui-store.ts`, `stores/room-store.ts`, new `stores/stage-store.ts` |
| Logic | new `lib/stage-selection.ts`, `lib/stage-grid-layout.ts`, `hooks/use-floating-chrome.ts` |
| Copy | `locales/en.ts`, `locales/pt-BR.ts`, `locales/es.ts` |
| Dependencies | all `package.json`, `Dockerfile`, every Compose file, `knowledge/rules/pin-compose-images.md`, `infra/README.md`, `AGENTS.md` |

# Technical decisions

## Tokens

Existing token names stay, because site pages and settings consume them. Their values move to Fundamentos, and new semantic tokens are added for surfaces, text steps, and the state colors. Each state color keeps a single meaning: green for speaking and healthy, red for live, leave, and mute, cyan for self-host, amber for attention. The light theme keeps the same names with derived values, because [design-tokens-light-dark](/rules/design-tokens-light-dark.md) requires it.

## Fonts

Fundamentos prescribes Hanken Grotesk for titles, names, rooms, and buttons, and Raleway for running text. It also proposes JetBrains Mono for "digital" values, and the screens were drawn in Figtree. The owner rejected monospaced type, so JetBrains Mono is not used. Fonts live behind `--font-display` and `--font-sans`, so moving to Figtree is one line. Quicksand leaves the web client and stays in `apps/admin`.

## Room merge

The stage fills the window. Title, voice pill, invite, people chip, show/hide control, left rail, right panel, and dock float above it.

- The request says the chat is on the left, but frame `1.3d` puts it on the right, and the left side is taken by the rail. The frame is followed.
- The right panel shows chat or people, never both. The dock toggles each one, and the people chip opens people.
- The microphone lives in the voice pill, as in `1.3d`. The dock has no microphone button.
- The red button in the voice pill means "leave voice": the microphone turns off and remote audio goes silent, while the LiveKit connection stays up so streams keep playing. A `voiceLeft` flag is honored by `applyRemoteVolume` in `use-livekit.ts`.

## Who is in voice

`mediaByUserId` holds an entry for every member, so a new `voiceUserIds` store field is filled from LiveKit participants in `use-livekit.ts`. A person is "in voice" when connected to the LiveKit room.

## Stage selection

- `lib/stage-selection.ts` holds pure functions: `defaultSelection`, `reconcileSelection`, `focusStream`, `toggleStream`.
- `lib/stage-grid-layout.ts` holds `computeGrid(count, width, height, aspect, gap)`.
- `stores/stage-store.ts` is a zustand store without persistence, so a reload and a new session start from the default. Nothing is sent to the server.

## Floating interface

`hooks/use-floating-chrome.ts` tracks pointer and keyboard activity, pointer leaving the window, hover over `[data-floating]`, focus in text fields, and open dialogs. Rail thumbnails unmount while hidden, which lets adaptive stream lower video use. The delay lives in `ui-store` and persists with the theme.

## Join flow

`lib/join-flow.ts` holds the error-to-dialog mapping, so the home screen and invite links share it. The join is attempted without a password first, so owners and returning members enter without a prompt. Remaining attempts are counted on the client per room, because the API reports only the lockout.

## Motion

`motion/react` with `MotionConfig reducedMotion="user"`. The dialog keeps native `<dialog>` semantics and gains its own animated scrim and panel. The empty stage draws concentric amphitheatre arcs.

## Storybook

Storybook 10 with `@storybook/react-vite`. `scripts/check-stories.mjs` fails when a file in `components/ui` has no story, and it runs in the web `lint` script.

# Data and API changes

No path or payload changes. The client starts sending the existing `isPublic` field and starts reading the existing `GET /api/rooms`.

# Risks

- TypeScript 7 and other major upgrades can break tooling. Each major is verified by typecheck, tests, and build, and held back with a reason when it fails.
- Compose image bumps can change configuration schemas, mainly OvenMediaEngine `Server.xml`. Release notes are checked before a bump.
- Live media cannot be exercised end to end without several real participants. Stage behavior is covered by unit tests and by a browser check with the data available.

# Sequence

1. Dependencies and images.
2. Tokens, base components, Storybook, `DESIGN.md`.
3. Home and join dialogs.
4. Room shell, rail, stage, floats, mobile.
5. Tests, browser verification, documentation, and rules.

# Owner corrections

Observed: `BrandLogo` redrew the mark from the Figma frame, `HomeLayout` replaced `InfiniteGrid3D` with a glow, the create card had no name field, and the site pages still used `HeaderTools`, `AppearanceMenu`, and the editorial components. `POST /api/session` keeps the `userId` of an existing session and changes only the name.

Approach:

- Remove `BrandLogo`. `SiteHeader` shows `BrandWordmark` on home and the site pages. `RoomTitle` shows the wordmark from `xl` and the original symbol below it, as a button that opens the leave dialog.
- Put `InfiniteGrid3D` back in `HomeLayout`, with the shared values as its defaults, and remove the glow.
- Add `displayName` to `createRoomSchema`. The field writes to `displayNameDraft`. `useJoinFlow` saves a changed draft through `POST /api/session` before creating or joining.
- Add `Card`, `Select`, and `OptionGroup` to `components/ui`, with stories. Use them in the site pages, settings, and home cards. Replace `HeaderTools`, `ThemeLocaleBar`, and `AppearanceMenu` with one `SiteHeader`.
- Add `Site/Pages` stories with a memory router.

Risk: text over the moving floor is hard to read, so page content sits on cards and the footer uses a floating surface.

## Rail person popover

Observed: `PeopleRail` renders `MemberPermissionsModal` inside a `nav` with `pointer-events: none`. `pointer-events` is inherited, so the native `dialog` and its buttons ignored the mouse while the modal made the rest of the page inert. Only Escape could close it.

Approach:

- Set `pointer-events: auto` on `dialog.ui-dialog`, so a dialog works wherever it is rendered.
- Add `components/ui/popover.tsx` with a story: a manual native popover in the top layer, so the rail's scroll area cannot clip it. It handles outside clicks, Escape, focus, the arrow, and the exit animation.
- Add `lib/popover-position.ts`, a pure placement function with unit tests. The position follows the anchor while the popover is open.
- Move the member details, actions, and confirmation into `theater/member-actions.tsx`. `MemberPermissionsModal` and the rail popover become two shells around it.
- Keep the floats visible while a popover is open, as already happens for dialogs.
- Close the native dialog when its fade ends, by timer. It stayed modal for about 0.8 s after fading, which kept the reopened popover inert.

Risk: the popover closes when its confirmation dialog opens, so the confirmation must live outside the popover and the person's selection must survive until it ends.

## Role indicators

Observed: the role appears only as a text badge in the people panel and member details, the owner in orange and the others in neutral gray. The rail and chat show no role. `ChatMessage` has no role field, and the room store already has the members.

Approach:

- Add `--role-*` color tokens. Fundamentos gives green, red, cyan, and amber one meaning each, so admin is violet and moderator is orchid. The owner keeps the brand orange.
- Add `RoleBadge`, `RoleMark`, and `RoleIcon` in `components/ui/role-badge.tsx`, with a story. Icons: crown, shield with check, gavel.
- Use the mark on rail avatars, the badge in the panel and member details, and the icon plus name color in chat. Chat reads the role from the room's members, so the API does not change.
- Add the role to the rail button's accessible name.
- Add a roles section to `01 · Fundamentos` through the Figma connector, because the Figwright plugin is not open.

# Deviations

Recorded against the Figma frames, because the data or a repository rule requires them.

- Room rows show no "N in voice", and `1.5` shows no member names or "live for": the public API does not expose these to people outside the room.
- The member limit field leaves the create form, matching `1.2`. The default of 20 stays.
- Signal bars use the three levels from Fundamentos. Frame `1.3d` draws four bars on cards.
- Names in the left rail appear on hover, focus, and while speaking, as in `1.3e`. The people panel lists every name.
- The logo is the original wordmark, not the redrawn mark of the frames, and the room also shows it. The owner asked for this.
- The home page has the moving floor and the create card has a name field, which frame `1.2` does not show. The owner asked for both.
- The chat floats on the right, as in `1.3d`, although the request mentioned the left. The left side is taken by the people float and the stream rail.
- Fonts are Hanken Grotesk and Raleway, already in the project, at the sizes of the frames, which use Figtree. They sit behind `--font-display` and `--font-sans`, so changing them is one line.
- The footer says no account is needed, instead of "with or without an account", because accounts do not exist yet.
- `1.5` shows seats taken instead of member avatars, for the same reason as the first deviation.
- A room row with no broadcast and no password shows a green dot only when someone is inside.
- Three neutral text colors used by the frames but missing from Fundamentos (`#A8968A`, `#6E5E52`, `#E6D2C3`) became ink tokens.

# Outcome notes

- All workspace packages moved to their latest versions, including TypeScript 7, i18next 27, and react-i18next 18. pnpm stays on the 11 line; Node now needs 22.12 or newer for Vite and Storybook.
- `simstosh/amphitheatre` is pinned through `AMPHITHEATRE_VERSION` (default `1.3.1`), so self-hosters receive this interface only after a new release.
- `apps/api/tests/admin-create-room.test.ts` had a wrong import that the new TypeScript rejects; it was corrected.
- Floats use no backdrop blur, because blur over moving video is expensive.
- A person who leaves voice stays connected to LiveKit so streams keep playing. Other people still see them as connected, because showing it would need an API change.
- Hiding floats unmounts them. The chat draft lives in the room store, so it survives.
- An invisible layer covers the stage while floats are asleep, because pointer movement over a cross-origin iframe never reaches the page.
