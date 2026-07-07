# PROJECT_HANDOFF

Stand: 07.07.2026 13:00 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, infrastructure status, validation summary, open risks, and next recommended functional milestone.

It intentionally stays short. Architecture details, historical milestones, workflow rules, and implementation decisions belong in the referenced documents rather than being duplicated here.

## Current Project State

- Active branch: `refactor/core-architecture`.
- Functional runtime remains read-only.
- No device control, scheduling, execution provider, foreign-state writes, SQL history collection, pattern recognition, or first-class Simulation Framework implementation is approved.
- The adapter-owned public ioBroker object namespace and future object-model boundaries are now documented in `docs/architecture/OBJECT_MODEL.md`.
- The History Service remains planned architecture only; functional implementation is still open.

## Latest Completed Milestone

- Milestone: Object model boundary documentation.
- Scope: documented the current implemented `energyoptimizer.0.*` public state tree, reserved future namespaces, History Service object boundaries, JSON publication rules, read/write policy, validation requirements, and compatibility rules.
- Result: the next History Service implementation planning can use an explicit object-model boundary and does not need to infer future state structure from older chat context.
- Runtime impact: none.
- Production code impact: none.

## Infrastructure Status

- GitHub Actions CI workflow exists at `.github/workflows/ci.yml`.
- The workflow runs on push and pull request events.
- The workflow performs dependency installation, build, tests, and package dry run.
- First successful GitHub Actions CI run was validated for commit `aaa2630` on branch `refactor/core-architecture`.
- CI supplements the existing local and Raspberry Pi validation gates; it does not replace runtime validation for production-code milestones.

## Validation Summary

- Documentation-only milestone: `docs/architecture/OBJECT_MODEL.md`, `docs/architecture/ARCHITECTURE.md`, and `docs/development/PROJECT_HANDOFF.md`.
- Production code changed: no.
- Tests changed: no.
- Runtime behavior changed: no.
- ioBroker validation required for this documentation-only milestone: no.

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

Recommended next direction: prepare the History Service Domain Foundation as the first scoped implementation slice. It should define typed historical metrics, samples, buckets, quality metadata, resolutions, and pure deterministic collector/aggregator behavior without SQL, runtime integration, new ioBroker states, configuration/UI changes, pattern recognition, or Simulation Framework work.

## Required Reading

1. `docs/development/PROJECT_HANDOFF.md`.
2. `docs/development/WORKFLOW.md`.
3. `docs/architecture/OBJECT_MODEL.md`.
4. `docs/architecture/ADR/ADR-0012-history-service.md`.
5. Relevant architecture documents for the selected milestone.
6. `docs/roadmap/ROADMAP.md` only when milestone planning or sequencing is required.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
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