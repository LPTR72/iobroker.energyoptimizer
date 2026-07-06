# PROJECT_HANDOFF

Stand: 06.07.2026 22:10 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, infrastructure status, validation summary, open risks, and next recommended functional milestone.

It intentionally stays short. Architecture details, historical milestones, workflow rules, and implementation decisions belong in the referenced documents rather than being duplicated here.

## Current Project State

- Active branch: `refactor/core-architecture`.
- Functional runtime remains read-only.
- No device control, scheduling, execution provider, foreign-state writes, SQL history collection, pattern recognition, or simulation runtime is approved.
- The latest functional architecture milestone refined the planned History Service and documented long-term Pattern-based Virtual Energy Assets and Simulation Framework topics.
- The History Service remains planned architecture only; functional implementation is still open.

## Latest Completed Milestone

- Milestone: GitHub Actions CI infrastructure and project handoff refactoring.
- Scope: added and validated the repository CI workflow, then separated functional project status from infrastructure status in this handoff.
- Result: push and pull request validation is available through GitHub Actions, while the project handoff now distinguishes current functional state, infrastructure state, validation, risks, and next milestone.
- Runtime impact: none.
- Production code impact: none.

## Infrastructure Status

- GitHub Actions CI workflow exists at `.github/workflows/ci.yml`.
- The workflow runs on push and pull request events.
- The workflow performs dependency installation, build, tests, and package dry run.
- First successful GitHub Actions CI run was validated for commit `aaa2630` on branch `refactor/core-architecture`.
- CI supplements the existing local and Raspberry Pi validation gates; it does not replace runtime validation for production-code milestones.

## Validation Summary

- GitHub Actions first run for commit `aaa2630`: passed.
- Documentation refactoring scope: `docs/development/PROJECT_HANDOFF.md` and `docs/development/WORKFLOW.md` only.
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
- Pattern recognition, virtual-asset persistence, user confirmation flows, and downstream optimization use remain planned and unselected.
- Simulation Framework orchestration, scenario formats, benchmark metrics, demonstration behavior, and implementation order remain open and unselected.

## Deferred Topics

- Runtime integration.
- SQL implementation.
- History collection and aggregation.
- Pattern recognition and virtual assets.
- Simulation framework implementation.
- Scheduling, execution provider, and device control.
- Further Developer Workspace refinements that are private workflow concerns rather than repository documentation.

## Next Recommended Functional Milestone

Select and explicitly approve the next functional milestone from the roadmap before creating an implementation prompt.

Recommended next direction: prepare the History Service implementation as a scoped, multi-step epic. Pattern-based Virtual Energy Assets and the Simulation Framework are not the next implementation task unless explicitly selected later.

## Required Reading

1. `docs/development/PROJECT_HANDOFF.md`.
2. `docs/development/WORKFLOW.md`.
3. Relevant ADRs for the selected milestone.
4. Relevant architecture documents for the selected milestone.
5. `docs/roadmap/ROADMAP.md` only when milestone planning or sequencing is required.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
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
