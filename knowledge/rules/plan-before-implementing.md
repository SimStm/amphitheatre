---
type: Rule
title: Plan before implementing
description: Every feature or fix opens a change bundle with spec.md, plan.md, and tasks.md before code is edited, and closes it with checked criteria and recorded test results.
tags: [process, okf, agents]
status: stable
generated: { by: coding_agent/claude, at: 2026-11-18T00:00:00Z }
sources:
  - id: agents
    resource: AGENTS.md
    title: Planning and implementation
---

# Rule

Before editing code for a feature or fix, create or update one bundle. Follow-up work on the same change reuses it.

```
knowledge/changes/<yyyy-MM-dd>/<feature>/
  <feature>.md   # type: Change; what landed and why (finished after the work)
  spec.md        # contract
  plan.md        # technical approach
  tasks.md       # ordered execution
```

- **`spec.md`** (`type: Spec`): problem, goal, scope, expected behavior, main and error scenarios, edge cases, observable acceptance criteria.
- **`plan.md`** (`type: Plan`): current code with real file paths, affected components, technical decisions, data or API changes, risks, implementation sequence, deviations.
- **`tasks.md`** (`type: Tasks`): small ordered tasks, dependencies, a check for each, status, and results.

A new session must be able to execute the change from these files alone. Separate facts observed in the repository from proposals and assumptions. Do not invent behavior, files, commands, or product decisions.

**Plan-only request:** write and review the bundle; do not change code.

**Implementation request:** confirm the bundle matches the current code, update it before editing, and keep it current.

**On finish:** check every acceptance criterion, run the relevant tests, record results and limitations, mark tasks done, and justify technical deviations in `plan.md`. If a discovery changes behavior defined in `spec.md`, state that decision before editing the spec.

Bundles created before 2026-11-18 have only `<feature>.md`. Do not backfill them.

# Related

- [Roadmap](/rules/roadmap.md)
- [CHANGELOG and release process](/rules/changelog-and-release-process.md)
- [Self-aware knowledge](/rules/self-aware-knowledge.md)
