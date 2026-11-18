---
type: Rule
title: CHANGELOG and release process
description: Every feature/fix adds a bullet to CHANGELOG.md's Unreleased section (English, Keep a Changelog). Releases are a manual git tag that triggers GitHub Release + multi-arch Docker Hub publish.
tags: [process, docs, ci, docker, release]
status: stable
generated: { by: coding_agent/composer, at: 2026-08-24T09:00:00Z }
sources:
  - id: changelog
    resource: CHANGELOG.md
    title: Keep a Changelog
  - id: agents
    resource: AGENTS.md
    title: How to record a change / Releases
  - id: workflow
    resource: .github/workflows/release.yml
    title: Release workflow
  - id: app-meta
    resource: apps/web/src/lib/app-meta.ts
    title: APP_VERSION from root package.json
---

# Rule

Every feature or fix gets a bullet under `## [Unreleased]` in the root `CHANGELOG.md`, in English, using [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) categories (`Added` / `Changed` / `Fixed` / `Removed`). This is in **addition** to the OKF change bundle in `knowledge/changes/`, not instead of it — the OKF bundle is the detailed record, `CHANGELOG.md` is the macro one a human skims before upgrading.

Each new bullet ends with a link to its bundle, using the full URL: `([details](https://github.com/simstm/amphitheatre/tree/main/knowledge/changes/<yyyy-MM-dd>/<feature>))`. A relative path would break, because the same text becomes the GitHub Release notes. Do not put link reference definitions (`[name]: url`) inside a version section: `scripts/extract-changelog.sh` stops reading at the first one. Entries released before 2026-11-18 have no link and are not backfilled.

Releasing a new version is a **manual** flow, never automatic on merge to `main`:

1. Run `scripts/extract-changelog.sh promote X.Y.Z` to move `[Unreleased]`'s content into a new `## [X.Y.Z] - YYYY-MM-DD` section (leaves `[Unreleased]` empty above it and refreshes the link references at the bottom).
2. Bump `version` in the root `package.json` to match. Settings → About reads that value at Vite build (`__APP_VERSION__`); do not hardcode a different string in the SPA. Bump the `AMPHITHEATRE_VERSION` default in `deploy/docker-compose*.yml` and `deploy/env.example` too.
3. `git tag vX.Y.Z && git push --tags`.
4. `.github/workflows/release.yml` extracts that version's section (`scripts/extract-changelog.sh`) to create the GitHub Release (always English), then builds and pushes a multi-arch (`linux/amd64` + `linux/arm64`) image to Docker Hub as `simstosh/amphitheatre:vX.Y.Z`, `:X.Y`, and `:latest`.

Do not tag, release, or push to Docker Hub without the user explicitly asking in that message — this is a variant of the "no upstream PRs / no unrequested releases" discipline already in `AGENTS.md`.

# Related

- [Public docs in English](public-docs-english.md)
- [Pin Compose images](pin-compose-images.md)
