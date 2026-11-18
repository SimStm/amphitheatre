---
type: Spec
title: Agent workflow and roadmap — spec
description: What the planning workflow, CHANGELOG linking, and public/private roadmap boundary must provide.
tags: [change, agents-knowledge-roadmap]
---

# Problem

Observed in the repository on 2026-11-18:

- `AGENTS.md` and the OKF catalog exist and are detailed, but they do not say where future work goes.
- Two uncommitted rules in `knowledge/rules/` describe features that do not exist (`status: proposed`).
- Change bundles contain one `<feature>.md` written after the work. None has a spec, plan, or task list.
- `CHANGELOG.md` entries do not link to their bundles.

# Goal

Agents know what to write before coding, what finished means, and which content belongs in the public repository or the private one.

# Owner decision

The roadmap stays in the private `amphitheatre-docs` repository, beside this one. If that directory does not exist, the roadmap step is ignored. Public files do not contain absolute machine paths. The two proposed rules move to that repository too.

# Scope

## In scope

- A rule for the roadmap location and the public/private boundary.
- A planning rule and matching `AGENTS.md` sections.
- A link from each new CHANGELOG bullet to its bundle.

## Out of scope

- Application code.
- Commits in the private repository.
- Backfilling older bundles or CHANGELOG entries.

# Expected behavior

An agent reading `AGENTS.md` finds the start checklist, the planning requirement, the definition of done, and the roadmap location. Repository conventions stay as they are: `index.md` for indexes and `<name>/<name>.md` for concepts.

# Scenarios

## Main

A new feature: the agent opens a bundle with the three planning files, implements, records results, and adds a linked CHANGELOG bullet.

## Error

A release: the linked bullet must survive `scripts/extract-changelog.sh` unchanged and still work on the GitHub Release page.

## Edge cases

- `../amphitheatre-docs` is missing, as it is for contributors and CI: the agent skips the roadmap step and finishes the task. If someone asked for a roadmap item, the agent says it was not recorded.
- Older bundles without planning files remain valid.

# Acceptance criteria

- [x] `knowledge/roadmap/` does not exist, and no file links to it.
- [x] `knowledge/rules/roadmap.md` names `../amphitheatre-docs`, says to skip the step when it is missing, and forbids absolute machine paths.
- [x] `knowledge/rules/roadmap.md` and `knowledge/rules/plan-before-implementing.md` are indexed.
- [x] `AGENTS.md` covers the start checklist, planning, roadmap, write-back table, definition of done, and what not to do.
- [x] Tracked and new files contain no absolute home-directory paths.
- [x] `CHANGELOG.md` has no conflict markers, keeps the 1.3.1 section, and its linked bullet passes through `promote` and extraction intact.
- [x] Every bundle-relative link in the new and changed knowledge files resolves.
- [x] New concept files have a non-empty `type`, and new files contain no emoji.
- [x] The two proposed rules are gone from `knowledge/rules/`, and no public file links to them.
- [x] No application code changed.
