# PROJECT_HANDOFF

Stand: 07.07.2026 16:27 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, infrastructure status, validation summary, open risks, and next recommended functional milestone.

It intentionally stays short. Architecture details, historical milestones, workflow rules, and implementation decisions belong in the referenced documents rather than being duplicated here.

## Current Project State

- Active branch: `refactor/core-architecture`.
- Functional runtime remains read-only.
- No device control, scheduling, execution provider, foreign-state writes, SQL history collection, pattern recognition, or first-class Simulation Framework implementation is approved.
- The History Service domain foundation is implemented as pure deterministic domain code only.
- No History Service runtime integration, SQL persistence, new ioBroker states, configuration UI, pattern recognition, or Simulation Framework work is implemented.
- The adapter-owned public ioBroker object namespace and future object-model boundaries are documented in `docs/architecture/OBJECT_MODEL.md`.
- The remaining History Service work is still open and must be split into separately approved milestones.

## Latest Completed Milestone

- Milestone: History Service Domain Foundation.
- Scope: implemented pure domain models and deterministic collection/aggregation for the first History Service slice.
- Result: `src/lib/history/` now defines typed historical metrics, samples, buckets, resolutions, quality metadata, a 1-minute collector from live samples, and an aggregator that advances only through the ADR-0012 resolution chain. Metric-specific aggregation covers power, reset-aware energy counters, state of charge, binary state, temperature, price, and generic numbers with an explicit reducer.
- Runtime impact: none.
- Production code impact: pure domain code only; no runtime wiring.

## Infrastructure Status

- GitHub Actions CI workflow exists at `.github/workflows/ci.yml`.
- The workflow runs on push and pull request events.
- The workflow performs dependency installation, build, tests, and package dry run.
- First successful GitHub Actions CI run was validated for commit `aaa2630` on branch `refactor/core-architecture`.
- CI supplements the existing local and Raspberry Pi validation gates; it does not replace runtime validation for production-code milestones.

## Validation Summary

- Local build: `npm.cmd run build` passed.
- Local tests: `npm.cmd test` passed with 97 passing tests.
- Diff whitespace check: `git diff --check` passed.
- Production code changed: yes, pure history domain code under `src/lib/history/`.
- Tests changed: yes, focused History Service domain tests added.
- Runtime behavior changed: no.
- ioBroker validation required for this domain-only, non-runtime milestone: no.
- Required local validation for this milestone: `npm run build`, `npm test`, `git diff --check`, `git status --short`, and `git diff --stat`.

## Review Outcome

- Blocking issues found: 0.
- Blocking issues resolved before approval: 0.
- Final review status: Approved.

## Open Risks

- History Service implementation remains an open multi-step epic/workstream after the domain foundation.
- SQL/ioBroker history-backend integration remains planned.
- No runtime integration of the History Service has been approved.
- Exact future History Service runtime states remain intentionally unselected until a dedicated runtime milestone approves names, semantics, validation, and migration impact.
- Repository abstraction, retention policy enforcement, temporal context providers, configuration, health reporting, and consumer integration remain open.
- Pattern recognition, virtual-asset persistence, user confirmation flows, and downstream optimization use remain planned and unselected.
- Simulation Framework orchestration, scenario formats, benchmark metrics, demonstration behavior, and implementation order remain open and unselected.

## Deferred Topics

- Runtime integration.
- SQL implementation.
- History collection and aggregation runtime wiring.
- Future History Service ioBroker states.
- Pattern recognition and virtual assets.
- First-class Simulation Framework implementation.
- Scheduling, execution provider, and device control.
- Further Developer Workspace refinements that are private workflow concerns rather than repository documentation.

## Next Recommended Functional Milestone

Select and explicitly approve the next functional milestone from the roadmap before creating an implementation prompt.

Recommended next direction: prepare the next History Service slice as a separately scoped milestone. A conservative next step is an implementation-neutral repository contract and retention-policy design without SQL wiring or runtime integration.

Keep SQL, runtime integration, new ioBroker states, configuration UI, pattern recognition, and the Simulation Framework out of the next step unless explicitly approved.

## Required Reading

1. `docs/development/PROJECT_HANDOFF.md`.
2. `docs/development/WORKFLOW.md`.
3. `docs/architecture/OBJECT_MODEL.md`.
4. Relevant ADRs for the selected milestone.
5. Relevant architecture documents for the selected milestone.
6. `docs/roadmap/ROADMAP.md` only when milestone planning or sequencing is required.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Architecture decisions](../architecture/DECISIONS.md)
- [Object model](../architecture/OBJECT_MODEL.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [ADR-0010](../architecture/ADR/ADR-0010-neutral-execution-planner.md)
- [ADR-0011](../architecture/ADR/ADR-0011-execution-planning-semantics.md)
- [ADR-0012](../architecture/ADR/ADR-0012-history-service.md)
- [ADR-0013](../architecture/ADR/ADR-0013-pattern-based-virtual-energy-assets.md)
- [ADR-0014](../architecture/ADR/ADR-0014-simulation-framework.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
