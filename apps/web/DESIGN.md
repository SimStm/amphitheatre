# Amphitheatre design system

The web app follows the Figma file **Amphitheatre Hub**: page `01 · Fundamentos` defines colors, type, indicators and icons, and page `05 · Fluxo 1 · Salas avulsas` defines the screens (`1.2`, `1.4`, `1.5`, `1.6`, and the room built from `1.3e` and `1.3d`).

When this file and the Figma file disagree, the Figma file wins and this file gets updated. Tokens live in `src/index.css`. Base components live in `src/components/ui/`, and each one has a Storybook story.

## Character

A dark, warm room with the lights down. The content on stage is the brightest thing on screen, and the interface sits around it and gets out of the way. Surfaces are near-black browns, never neutral gray. Orange is the one accent: it marks the main action and whatever is on stage.

Avoid what makes a page look generated: monospaced text, uppercase labels, purple gradients, glass cards, glowing borders, and identical fade-up on every element.

## Color

Use the Tailwind names below. Never write a hex value in a component. Dark values are from Fundamentos; the light theme keeps the same names.

### Surfaces

| Token | Dark | Use |
|---|---|---|
| `surface-window` | `#0b0907` | Behind everything |
| `surface-page` | `#0e0a07` | Page background |
| `surface-sunken` | `#120d09` | Inputs, side areas |
| `surface-raised` | `#17110c` | Cards and dialogs |
| `surface-row` | `#1b140e` | Rows inside a card |
| `surface-bright` | `#211912` | Raised controls |
| `surface-selected` | `#241a12` | Selected item |
| `surface-float` | page at 78% | Floating panels over video |
| `surface-float-strong` | page at 94% | Floating panels that hold text |

### Text

| Token | Dark | Use |
|---|---|---|
| `ink` | `#f3dfd1` | Titles and main text |
| `ink-soft` | `#e6d2c3` | Names, unselected options |
| `ink-muted` | `#c4b09e` | Secondary text, labels |
| `ink-dim` | `#a8968a` | Descriptions |
| `ink-subtle` | `#8c7a6b` | Hints and footers |
| `ink-faint` | `#6e5e52` | Placeholders |
| `ink-off` | `#5e4f44` | Disabled |
| `ink-on-accent` | `#2e1500` | Text on orange |

`ink-soft`, `ink-dim` and `ink-faint` appear in the screens but are not named in Fundamentos.

### One color, one meaning

| Token | Value | Only means |
|---|---|---|
| `accent` / `accent-text` | `#ff8e04` / `#ffb77c` | Main action, on stage, own avatar, unread |
| `speaking` on `speaking-soft` | `#7dba90` on `#13241a` | Speaking, good connection |
| `danger` / `danger-text` | `#e5484d` / `#ff8a80` | Live, leave, muted, errors |
| `selfhost` on `selfhost-soft` | `#7dd3ff` on `#10242e` | Self-hosted |
| `attention` / `attention-text` | `#e5a23b` / `#f2c27a` | Weak connection, basic mode |
| `role-admin` on `role-admin-soft` | `#c8b4ff` | Room admin |
| `role-moderator` on `role-moderator-soft` | `#f4a6d0` | Room moderator |

The room owner uses `role-owner`, the soft accent `#ffb77c`, always with the crown.

Do not use green for a confirmation button or red for decoration.

## Logo

The original logo is the main mark of the product and appears on every screen. Use `BrandWordmark` and `BrandMark`, which load the files in `src/assets`. Do not redraw it, and do not use a logo from a Figma frame. In tight spaces, use the symbol alone.

## Type

| Role | Font | Weight | Sizes |
|---|---|---|---|
| Titles, names, rooms, buttons | Hanken Grotesk (`font-display`) | 700 | 34, 22, 19, 15, 14.5, 12 |
| Running text | Raleway (`font-sans`) | 400 | 16, 15, 14.5, 13.5, 13, 12.5 |

No monospaced type anywhere the user can see, and no CSS uppercase. Room codes are case-sensitive, so uppercase styling would show the wrong code.

## Shape and elevation

| Token | Size | Use |
|---|---|---|
| `--radius-tile` | 12 px | Stream cards, rows, icon tiles |
| `--radius-control` | 14 px | Inputs, buttons, option cards |
| `--radius-panel` | 20 px | Cards, dialogs, floating panels |
| `--radius-pill` | full | Chips and badges |

Elevation comes from a lighter surface and a 1 px border. Floating panels get `--shadow-float`. Do not add backdrop blur over video: it costs a lot of GPU on top of a live decode.

## Indicators

These come from Fundamentos and keep the same meaning everywhere.

| State | Shown as |
|---|---|
| Speaking | Green ring (`speaking-ring`) |
| In voice, silent | Avatar without ring |
| Muted | Crossed microphone in red |
| Listening only | Headphones |
| Camera | Camera icon by the name |
| Screen | Monitor icon by the name |
| Room live | Antenna or red dot with "Live" |
| Self-hosted | Cyan badge with a server icon |
| Signal | Three green bars, two green bars, one amber bar |
| Roles | Owner: crown, orange. Admin: shield with check, violet. Moderator: gavel, orchid. Members have no mark |

Every indicator has text for screen readers. Color is never the only signal.

## Icons

Tabler icons only (`@tabler/icons-react`), stroke 1.75 to 1.9. No emoji in the UI or the docs.

## Components

| Component | Purpose |
|---|---|
| `Button` | Actions. Variants `primary`, `secondary`, `ghost`, `danger` |
| `IconButton` | Square or round icon action with a required label and tooltip |
| `Tooltip` | Short label on hover and focus |
| `Dialog`, `DialogFrame` | Modal with title and footer, or a free layout |
| `Popover` | Speech bubble beside an anchor, with an arrow, in the top layer |
| `RoleBadge`, `RoleMark`, `RoleIcon` | Room role as a pill, an avatar mark, or an inline icon |
| `FloatSurface` | Panel floating over the stage |
| `Avatar`, `AvatarStack` | Person, with speaking and self states |
| `SignalBars`, `StatusDot` | Connection and status |
| `IconTile` | Icon in a tinted square |
| `RadioCard` | Option with title and description |
| `OptionGroup` | Short choices in a row, such as theme or time |
| `Card`, `CardBody` | Titled card on the home and site pages |
| `Field`, `Label`, `Input`, `Textarea`, `PasswordInput`, `Select` | Forms |
| `Badge`, `Alert`, `Skeleton` | Status, messages, loading |

### Storybook

Run `pnpm --filter @coliseum/web storybook`. Every `.tsx` file directly in `src/components/ui/` needs a matching `.stories.tsx`. `pnpm --filter @coliseum/web lint` fails when one is missing.

## Motion

Use Motion from `motion/react`. `MotionConfig reducedMotion="user"` wraps the app, so movement turns into short fades for people who ask for less.

Each animation shows a change of state, a relationship, or feedback. Prefer `transform`, `opacity`, `clip-path` and `filter`.

| Moment | Treatment |
|---|---|
| Floating panels hide or return | Each slides toward its own screen edge |
| Left panel changes between people and streams | Width and content morph with `layout` |
| Stage grid changes | Tiles move to their new place with `layout` |
| Dialogs | Scrim fades, panel rises with a soft spring, and both leave in 160 ms |
| Popovers | Grow from the arrow with a short spring |
| Home and site pages | The checkered floor moves toward the viewer; headline and cards rise in sequence out of a light blur |
| Empty stage | Amphitheatre rows draw themselves in |

Default spring: `{ type: "spring", bounce: 0.2, visualDuration: 0.4 }`. Small controls take 150 to 300 ms, large surfaces up to about 500 ms.

## Layout

The home page, `/about`, and `/what-is` share `SiteShell`: the moving floor, `SiteHeader`, and a floating footer. Text that needs reading sits on a card or floating surface, not directly on the floor.

The room is one full-screen stage with panels floating over it. Top and bottom scrims keep panels readable over bright video. Mobile has its own layout (coarse pointer or width up to 767 px), with touch targets of at least 44 px.
