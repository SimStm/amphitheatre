# Contributing to Amphitheatre

Thank you for contributing. Bug reports, documentation fixes, and code make the theater better for people who self-host. By participating you agree to license your contributions under [AGPL-3.0-only](LICENSE) for the public edition **and** to sign the [ICLA](CLA.md) in favor of SIMSDEV.

This guide is in English. The ICLA is also in English (controlling language of the agreement).

## Contents

- [CLA (required on every PR)](#cla-required-on-every-pr)
- [Ways to contribute](#ways-to-contribute)
- [Before you start](#before-you-start)
- [Development environment](#development-environment)
- [Monorepo layout](#monorepo-layout)
- [Code rules](#code-rules)
- [Tests and checks](#tests-and-checks)
- [Pull request flow](#pull-request-flow)
- [What CLA Assistant does](#what-cla-assistant-does)
- [Governance](#governance)
- [Maintainer notes](#maintainer-notes)

## CLA (required on every PR)

The public repository is **AGPL-3.0-only**. AGPL means a hosted modified version must offer source. SIMSDEV, as steward, wants to offer a **paid hosted edition** (infrastructure) later. Third-party contributions therefore need an extra inbound license: the [Individual Contributor License Agreement](CLA.md).

**When you open a Pull Request, the [CLA Assistant](.github/workflows/cla.yml) GitHub Action comments on the PR.** It fails the status check until **every author** of the commits has signed. The signature is a comment on the PR, with this **exact** sentence:

```
I have read the CLA Document and I hereby sign the CLA
```

Read the full term in [`CLA.md`](CLA.md) before pasting. Posting that sentence is your electronic signature. Comments such as `recheck` ask the bot to reprocess signatures.

What the ICLA covers (summary; the English text controls):

- You **keep copyright** in your contributions (license, not assignment).
- You license the contributions to the public under AGPL-3.0-only (forks stay free).
- You grant **SIMSDEV** a copyright license with the right to **relicense**, including proprietary/commercial terms, and to offer paid SaaS.
- There is a patent grant limited to claims necessarily infringed by your contribution.
- If an employer (or other entity) owns the IP, **do not** sign the ICLA for that work until the entity executes a Corporate CLA (CCLA). Request a CCLA from SIMSDEV via the repository.

Bot PRs (`dependabot`, `github-actions`, and so on) are allowlisted and do not need an ICLA.

## Ways to contribute

- Report a bug (reproduction, version, logs without secrets).
- Improve documentation (typo, example, HTTP contract).
- Fix a bug.
- Propose a feature **after** checking what is already implemented versus what is only intended in `knowledge/`.

Do not invent features. Distinguish **implemented** (code + tests) from **intended** (historical plan or docs). The plan in `knowledge/references/plano-watchparty-miniDiscord.md` is **not** the source of truth.

## Before you start

1. Read [`README.md`](README.md) and [docs/getting-started.md](docs/getting-started.md).
2. Read [`AGENTS.md`](AGENTS.md) and the OKF catalog: [`knowledge/index.md`](knowledge/index.md), then `knowledge/product/` and `knowledge/rules/`.
3. Check open issues and PRs.
4. Substantial features: open an issue first so we can align on scope. Recording, custom reconnection, email accounts, and a “Netflix mode” are **out of scope**.

## Development environment

**Prerequisites:** [Bun](https://bun.com) 1.2+, [pnpm](https://pnpm.io) 10+, Docker Compose v2.

```bash
git clone <this-repository-url>
cd coliseum-theater
pnpm install
cp .env.example .env
cp apps/api/.env.example apps/api/.env
make up          # Valkey + LiveKit; OME off
pnpm dev         # API :3001 + Vite :5173
```

OME only if you are testing OBS ingest:

```bash
make ome-up
```

Checks: `GET http://localhost:3001/health` → `{ "ok": true }`; `make smoke`; SPA at `http://localhost:5173`.

The API starts with OME stopped. Chat, voice, camera, and screenshare never require OME.

## Monorepo layout

```
apps/api                   Bun + Hono (REST, WS, JWT, SQLite, LiveKit, OME poll)
apps/web                   Vite + React (desktop SPA + its own mobile layout)
packages/shared            TS contract: types, roles, paths, events, errors
infra/                     Compose, LiveKit, OME, Valkey, Caddy, k6
docs/                      Getting started, API, identity, broadcast, license
knowledge/                 Product, rules, changes (OKF 0.2)
.github/workflows/cla.yml  CLA Assistant
CLA.md                     ICLA
LICENSE                    AGPL-3.0-only
```

Room state: **SQLite**. Valkey is only LiveKit DB 1 (`hostname` `redis`).

## Code rules

Mandatory rules live in `knowledge/rules/`. The ones that show up most in PRs:

- **Frozen HTTP/WS contract:** any path, field, or event change must, in the same change, update `packages/shared`, [docs/api.md](docs/api.md), API, web, and an OKF change. There is no `POST /webhooks/ome/admission`.
- **Domain types** only in `packages/shared`.
- **OME independent:** voice/text/screen never require a healthy OME.
- **Persistent owner:** `ownerId` is immutable; nobody is promoted to owner.
- **No recording:** no LiveKit Egress, no OME File/DVR.
- **Mobile:** its own layout (`MobileTheaterLayout`), not a shrunk desktop.
- **Zero emoji** in UI, i18n, markdown, and knowledge. Tabler icons (`@tabler/icons-react`) are allowed.
- **i18n:** every user-visible string in `en`, `pt-BR`, and `es`.
- **Theme:** CSS tokens (`data-theme`), not one-off colors.
- **Broadcast opt-in:** stream off by default; OME stream key = `{roomId}-{secret}`.
- **Public docs in English:** README, CONTRIBUTING, CLA, AGENTS, and the `docs/` guides.

Do not commit `.env`, secrets, `node_modules`, or build artifacts.

A durable preference stated by the maintainer becomes a file in `knowledge/rules/` ([self-aware-knowledge](knowledge/rules/self-aware-knowledge.md)) — do not leave it only in chat.

## Tests and checks

Before opening the PR:

```bash
pnpm test
pnpm typecheck
```

`pnpm test` covers lockout (3 failures → 5 min), roles, owner/admin persistence after leave/rejoin (including a “new process” on the same SQLite), and the API staying up with OME down. The SPA is included in root `pnpm typecheck`.

Load: [docs/load-testing.md](docs/load-testing.md). The k6 script in `infra/loadtest/k6/api-rooms.js` still uses old paths; if you touch load tests, align the script to the `/api/...` contract, not the other way around.

## Pull request flow

1. Branch from `main`. Suggested prefixes: `feat/`, `fix/`, `docs/`, `test/`, `refactor/`, `chore/`.
2. For a feature or behavior fix, open a change record in `knowledge/changes/<yyyy-MM-dd>/<feature>/` with `spec.md`, `plan.md`, and `tasks.md` before editing code (see `AGENTS.md`).
3. Implement following `AGENTS.md` and `knowledge/rules/`. Then finish the change record, update `knowledge/log.md` and the matching `index.md` files, and add a `CHANGELOG.md` bullet linked to the record.
4. Update [docs/api.md](docs/api.md) and shared if the HTTP/WS contract changed.
5. Open the PR with an English description: what changed and why, linked issue, what you tested and what you did not. Visual change: describe the flow (a screenshot helps; it does not replace behavior).
6. **Sign the ICLA** on the CLA Assistant comment (exact sentence above). Without a signature the check fails and the PR will not be merged.
7. Tests/typecheck CI (when present) must pass. Squash merge is up to the maintainer.

Do not open PRs against upstream dependency repositories (LiveKit, OME, and so on) from this flow.

## What CLA Assistant does

The workflow [`.github/workflows/cla.yml`](.github/workflows/cla.yml) uses `contributor-assistant/github-action` and runs on `pull_request_target` (opened / synchronize / closed) and on PR comments.

1. You open the PR.
2. The Action comments asking for a signature and points at [`CLA.md`](CLA.md).
3. Each author pastes `I have read the CLA Document and I hereby sign the CLA`.
4. The signature (username, timestamp, PR number) is stored in `signatures/version1/cla.json` on branch `main`. **Do not create that file by hand** — the workflow creates and updates it.
5. After merge, the Action may **lock** the PR conversation so signatures cannot be deleted later.

If the check stays red after signing, comment `recheck`.

## Governance

Amphitheatre is stewarded by **SIMSDEV** (https://sims.dev.br). SIMSDEV has the final word on roadmap, merges, the public outbound license (AGPL-3.0-only), dual-license of the hosted edition, security response, and repository access.

Contributors keep authorship under the ICLA + AGPL of the public tree. Material product and process decisions should show up in issues, OKF rules, or this file.

## Maintainer notes

- **Protected `main`:** the Action needs to commit `signatures/version1/cla.json` on `main`. If `main` is locked, point `branch` in the workflow at an unprotected branch (for example `cla-signatures`) or use `remote-organization-name` / `remote-repository-name` + `PERSONAL_ACCESS_TOKEN` (repo scope). Do not enable the remote token if signatures stay in this repo.
- **Do not create** `signatures/version1/cla.json` manually.
- **Allowlist:** bots are already covered (`bot*`). Put SIMSDEV usernames on the allowlist only if you want to skip their ICLA (the steward already holds copyright in the original code).
- **New ICLA version:** bump `path-to-signatures` to `signatures/version2/...` and update the date/version in `CLA.md`. A v1 signature does not automatically cover v2.
- **CCLA:** there is no corporate template in this repo yet; when a company contributes, publish a CCLA and the signing process (do not use the ICLA for employer IP).
- **Legal review:** the ICLA is a simplified model inspired by Harmony/Apache ICLA, adapted for SaaS relicensing. Before relying on it in production, SIMSDEV should have counsel review it. This paragraph is not part of the agreement.
- The `contributor-assistant/github-action` upstream is archived; `v2.6.1` still works. If the project is revived or a successor fork appears, update the pin.

Usage questions: repository issues or discussions. Vulnerabilities: do not open a public issue with an exploit; contact SIMSDEV privately.
