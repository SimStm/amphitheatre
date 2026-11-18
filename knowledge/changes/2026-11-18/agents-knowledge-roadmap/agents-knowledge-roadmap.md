---
type: Change
title: Agent workflow and roadmap
description: Requires spec, plan, and tasks before code, links new CHANGELOG entries to their change bundles, and keeps the roadmap in the private docs repository.
tags: [process, okf, agents, roadmap, public-private]
generated: { by: coding_agent/claude, at: 2026-11-18T00:00:00Z }
sources:
  - id: agents
    resource: AGENTS.md
    title: Agent instructions
  - id: changelog
    resource: CHANGELOG.md
    title: Macro history
  - id: extract
    resource: scripts/extract-changelog.sh
    title: Release notes extraction
---

# What landed

`AGENTS.md` gained a start checklist, a planning section, a table of where each kind of knowledge goes, a definition of done, and a list of what not to do.

Every new feature or fix opens `spec.md`, `plan.md`, and `tasks.md` before code changes. New CHANGELOG bullets link to their bundle with a full URL, because the same text becomes the GitHub Release notes.

Roadmap items stay out of this public repository. They go to the private `amphitheatre-docs` repository, normally at `../amphitheatre-docs`. When that directory is missing, agents skip the roadmap step. Files here never contain absolute machine paths.

No application code changed.

# Why

Change records explained what landed but not what had been agreed beforehand, so a new session could not pick up a change from the repository alone. Future work also needed one agreed place, and the project has a public part and a private part that must stay clearly separate.

# Related

- [Roadmap rule](/rules/roadmap.md)
- [Plan before implementing](/rules/plan-before-implementing.md)
- [CHANGELOG and release process](/rules/changelog-and-release-process.md)
