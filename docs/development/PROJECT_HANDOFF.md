# PROJECT_HANDOFF

Stand: 07.07.2026 14:04 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, infrastructure status, validation summary, open risks, and next recommended functional milestone.

It intentionally stays short. Architecture details, historical milestones, workflow rules, and implementation decisions belong in the referenced documents rather than being duplicated here.

## Current Project State

- Active branch: `refactor/core-architecture`.
- Functional runtime remains read-only.
- No device control, scheduling, execution provider, foreign-state writes, SQL history collection, pattern recognition, or first-class Simulation Framework implementation is approved.
- The latest documentation work consolidated durable architecture decisions and public object-model boundaries into repository documentation.
- The adapter-owned public ioBroker object namespace and future object-model boundaries are documented in `docs/architecture/OBJECT_MODEL.md`.
- The History Service remains planned architecture only; functional implementation is still open.

## Latest Completed Milestone

- Milestone: Architecture Knowledge Consolidation with Object Model reconciliation.
- Scope: preserved the Object Model boundary documentation and the Architecture Knowledge Consolidation decisions without changing production code.
- Result: `docs/architecture/DECISIONS.md` owns durable architecture decisions and milestone boundaries. `docs/architecture/OBJECT_MODEL.md` owns the public ioBroker object/state model, reserved namespaces, read/write policy, JSON publication boundaries, object validation rules, compatibility, and brainstorming documentation rule. `docs/architecture/ARCHITECTURE.md` and this handoff cross-link those summaries.
- Runtime impact: none.
- Production code impact: none.

## Infrastructure Status

- GitHub Actions CI workflow exists at `.github/workflows/ci.yml`.
- The workflow runs on push and pull request events.
- The workflow performs dependency installation, build, tests, and package dry run.
- First successful GitHub Actions CI run was validated for commit `aaa2630` on branch `refactor/core-architecture`.
- CI supplements the existing local and Raspberry Pi validation gates; it does not replace runtime validation for production-code milestones.

## Validation Summary

- Documentation-only scope: `docs/architecture/DECISIONS.md`, `docs/architecture/OBJECT_MODEL.md`, `docs/architecture/ARCHITECTURE.md`, `docs/development/PROJECT_HANDOFF.md`, and `docs/development/WORKFLOW.md`.
- Production code changed: no.
- Tests changed: no.
- Runtime behavior changed: no.
- ioBroker validation required for this documentation-only milestone: no.
- Required local validation for this documentation-only milestone: `git diff --check` and `git status`.

## Review Outcome

- Blocking issues found: 0.
- Blocking issues resolved before approval: 0.
- Final review status: Approved.

## Open Risks

- History Service implementation remains an open, likely multi-step epic/workstream.
- SQL/ioBroker history-backend integration remains planned.
- No runtime integration of the History Service has been approved.
- Exact future History Service runtime states remain intentionally unselected until a dedicated runtime milestone approves names, semantics, validation, and migration impact.
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

Recommended next direction: prepare the first History Service implementation slice as a scoped domain-foundation milestone only: typed metrics, samples, buckets, quality metadata, supported resolutions, and deterministic collector/aggregator logic.

Explicitly keep SQL, runtime integration, new ioBroker states, configuration UI, pattern recognition, and the Simulation Framework out of the first History slice unless a later milestone separately approves them.

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
