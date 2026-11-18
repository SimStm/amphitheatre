---
type: Plan
title: Agent workflow and roadmap — plan
description: How the planning workflow and the public/private roadmap boundary fit the existing OKF catalog.
tags: [change, agents-knowledge-roadmap]
---

# Current code

- `AGENTS.md` has "OKF catalog", "How to record a change", and "Releases" sections.
- `knowledge/` follows OKF 0.2: `index.md` needs no frontmatter, and concepts live at `<name>/<name>.md`.
- `.github/workflows/release.yml` publishes the output of `scripts/extract-changelog.sh` as the release body.
- That script stops a section at the first line that looks like `[name]: url`.

# Affected components

`AGENTS.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `knowledge/index.md`, `knowledge/log.md`, `knowledge/changes/index.md`, `knowledge/rules/index.md`, `knowledge/rules/changelog-and-release-process.md`, plus the new rules and bundle files.

# Technical decisions

- **Full URLs in CHANGELOG bullets.** Relative links would break on the GitHub Release page.
- **Relative reference to the private repository.** `../amphitheatre-docs` works on any machine and exposes no personal path.
- **A missing directory is normal.** Contributors and CI do not have the private repository, so the step is skipped and nothing fails.
- **The private repository owns its format.** This repository does not repeat its roadmap rules, so the two cannot drift apart.

# Data or API changes

None.

# Risks

- The CHANGELOG link returns 404 until this bundle reaches `main`.
- Planning files add work to very small fixes. The rule keeps them short rather than optional.
- The public repository now reveals that a private repository exists, by name only. The owner asked for this reference.

# Implementation sequence

1. Add the planning rule and the roadmap location rule.
2. Update the catalog indexes and log.
3. Update `AGENTS.md`, `CONTRIBUTING.md`, and `CHANGELOG.md`.
4. Validate links, frontmatter, emoji, absolute paths, and the release script.

# Deviations

The first version of this change put an empty roadmap in `knowledge/roadmap/`. The owner then decided the roadmap belongs in the private repository, so that folder was removed before anything was committed.

Pulling `main` during this work left `CHANGELOG.md` in conflict. The resolution keeps the upstream 1.3.1 section and this change's bullet under `[Unreleased]`.

The owner later asked to move the two proposed design rules to the private repository. They were removed from `knowledge/rules/`, its index, and the log before the first commit of this change.
