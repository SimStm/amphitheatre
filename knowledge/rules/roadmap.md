---
type: Rule
title: Roadmap lives in the private docs repository
description: Roadmap items belong in the sibling amphitheatre-docs repository, normally ../amphitheatre-docs. If that directory is missing, skip the roadmap step.
tags: [process, agents, roadmap, public-private]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T00:00:00Z }
sources:
  - id: agents
    resource: AGENTS.md
    title: Roadmap and public/private boundary
---

# Rule

This repository is public and records what exists. The private `amphitheatre-docs` repository holds what may come next, including the roadmap.

| Content | Where it goes |
|---|---|
| Code, public docs, rules, product behavior, finished changes | This repository |
| Roadmap items, ideas for later, commercial plans | `amphitheatre-docs` |

**Location.** Look for `amphitheatre-docs` beside this repository, normally `../amphitheatre-docs` from the repository root. Roadmap items live in its `knowledge/roadmap/`. Follow that repository's own `AGENTS.md` and rules for format and language.

**If the directory is missing,** ignore the roadmap step. This is the normal case for contributors and CI. Do not create the directory, clone it, ask for access, or fail the task. Do not create a roadmap in this repository instead. If someone asked you to record a roadmap item, tell them it was not recorded.

**Do:**

- Refer to the private repository only by its name or by the relative path `../amphitheatre-docs`.
- Write change bundles here so they make sense without the private repository.

**Do not:**

- Write absolute machine paths, such as a home directory, in any file of this repository.
- Keep roadmap, "later", or TODO lists in this repository.
- Copy private content into this repository, its commits, or its pull requests. That includes roadmap item text, links to private files, plans, and prices.

# Related

- [Plan before implementing](/rules/plan-before-implementing.md)
- [Self-aware knowledge](/rules/self-aware-knowledge.md)
