---
type: Tasks
title: Agent workflow and roadmap — tasks
description: Ordered execution and verification for the planning workflow and the public/private roadmap boundary.
tags: [change, agents-knowledge-roadmap]
---

# Tasks

| # | Task | Depends on | Verification | Status |
|---|---|---|---|---|
| 1 | Add the planning rule and the roadmap location rule | — | Link check | done |
| 2 | Remove the in-repo roadmap folder | 1 | Search for references | done |
| 3 | Update catalog indexes and log | 1, 2 | Link check | done |
| 4 | Update `AGENTS.md` and `CONTRIBUTING.md` | 1 | Section check | done |
| 5 | Resolve the `CHANGELOG.md` conflict and add the linked bullet | — | `promote` and extraction on a temporary copy | done |
| 6 | Confirm no absolute paths and no application code changes | 1-5 | Search and `git status --short` | done |
| 7 | Move the two proposed rules to the private repository | 1 | Search for references | done |

# Results

Checked on 2026-11-18:

- Bundle-relative links, `type` frontmatter, and emoji: a one-off script over the new and changed knowledge files reported no problems. It also found every required `AGENTS.md` section and resolved its `knowledge/` links.
- Roadmap references: the remaining mentions of `knowledge/roadmap/` point to the private repository or describe the removed folder. No link targets it.
- Absolute paths: a search of tracked and new files found no home-directory paths.
- Release notes: `CHANGELOG.md` has no conflict markers. On a temporary copy, `scripts/extract-changelog.sh promote 9.9.9` followed by extraction returned the new bullet with its full URL. The 1.3.1 section still extracted.
- `git status --short` lists only `AGENTS.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and `knowledge/` paths.
- Moved rules: the two files are gone from `knowledge/rules/`, and a search of the repository finds no reference to them.

`pnpm test` and `pnpm typecheck` were not run, because no application code changed.

# Limitations

- The private repository is versioned separately, so the moved content is not part of this repository's history.
