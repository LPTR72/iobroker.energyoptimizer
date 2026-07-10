# PROJECT_HANDOFF

Stand: 10.07.2026 23:00 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records only the current project state, active milestone, validation status, open completion work, immediate risks, and next executable step.

Long-lived architecture topics belong in `ARCHITECTURE_BACKLOG.md`. Milestone candidates and sequencing belong in `NEXT_MILESTONES.md`. Workflow rules and informal brainstorming are not duplicated here.

## Current Project State

- Active branch: `integration/history-domain-foundation`.
- Target branch: `refactor/core-architecture`.
- The integration branch is temporary and must not become a new long-lived development branch.
- Functional runtime remains read-only.
- The History Service domain foundation is implemented as pure deterministic domain code only.
- No History Service runtime integration, SQL persistence, new ioBroker states, configuration UI, pattern recognition, scheduling, execution provider, foreign-state writes, or first-class Simulation Framework implementation is approved.

## Active Milestone

- Milestone: History Domain Foundation Contract Alignment.
- Status: validation and closeout in progress.
- Scope: pure domain models and deterministic collection and aggregation for the first History Service slice, aligned with the Information Interpreter boundary.
- Result:
  - typed historical metrics, samples, buckets, resolutions, and quality metadata,
  - 1-minute collection from interpreted or explicitly typed historical samples,
  - aggregation through `1m → 5m → 15m → 60m → 1d`,
  - metric-specific aggregation for power, reset-aware energy counters, state of charge, strict binary state, temperature, price, and generic numbers with an explicit reducer,
  - explicit `rolling24h` and `calendarDayLocal` day-boundary strategies,
  - preserved `first` semantics,
  - strict binary contract accepting only `0` and `1` and accounting for rejected samples.
- Runtime impact: none.

## Validation Summary

Completed locally:

- `npm.cmd run build` passed.
- `npm.cmd test` passed with 100 passing tests.
- `npm.cmd run lint` passed.
- `npm.cmd run test:package` passed.
- `git diff --check` passed.
- Architecture Review passed with no open architecture blockers.

Still required for the agreed milestone closeout:

- Raspberry/ioBroker regression validation on the actual target system.
- Final Review Outcome.
- Handoff and, where required, testing documentation update after target-system validation.
- Merge decision for `integration/history-domain-foundation` into `refactor/core-architecture`.
- Deletion of the temporary integration branch after successful integration.

Because the History code has no Runtime wiring, no new History states are expected during target-system validation. Existing Runtime behavior must remain unchanged.

## Target-System Regression Checks

Verify at minimum:

- branch and commit on the Raspberry,
- dependency installation,
- build,
- tests,
- lint,
- package dry run,
- adapter installation or update,
- adapter start,
- logs without new errors,
- existing public Runtime states without regressions.

Relevant existing states include:

- `energyoptimizer.0.health.lastPollingTimestamp`
- `energyoptimizer.0.live.grid.importPower`
- `energyoptimizer.0.costs.today.currentTariffEuro`
- `energyoptimizer.0.recommendation.available`
- `energyoptimizer.0.simulation.ready`

## Review Outcome

- Architecture review: passed.
- Blocking issues identified and corrected during contract alignment:
  - binary-value reinterpretation,
  - undefined daily-boundary semantics,
  - incomplete resolution-chain coverage,
  - documentation status inconsistencies.
- Final review status: Pending target-system validation and closeout review.

## Immediate Risks

- The milestone is not merge-ready until the agreed target-system validation and final Review Outcome are recorded.
- The Raspberry currently runs a 64-bit kernel with a 32-bit `armhf` userland. This blocks the full VS Code Remote-SSH Extension Host but does not block normal SSH-based validation.
- Platform modernization must remain separate from the current functional milestone.
- No new milestone may start on the temporary integration branch.

Long-lived architecture and product risks are tracked in [ARCHITECTURE_BACKLOG.md](ARCHITECTURE_BACKLOG.md).

## Next Executable Step

Prepare and perform the Raspberry/ioBroker regression validation of the current integration branch.

After successful validation:

1. finalize Review Outcome,
2. update this handoff and `TESTING.md` where required,
3. decide and perform the merge into `refactor/core-architecture`,
4. delete the temporary integration branch,
5. select the next milestone from `NEXT_MILESTONES.md` with explicit approval.

Do not start a new functional or infrastructure milestone before the History closeout is complete.

## Required Reading

1. `docs/development/PROJECT_HANDOFF.md`
2. `docs/development/WORKFLOW.md`
3. `docs/development/ARCHITECTURE_BACKLOG.md` only when architecture backlog context is needed
4. `docs/development/NEXT_MILESTONES.md` only when milestone selection or sequencing is needed
5. relevant ADRs and architecture documents for the active or proposed milestone

## References

- [Architecture backlog](ARCHITECTURE_BACKLOG.md)
- [Next milestones](NEXT_MILESTONES.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
- [Architecture](../architecture/ARCHITECTURE.md)
- [Object model](../architecture/OBJECT_MODEL.md)
- [ADR-0012 History Service](../architecture/ADR/ADR-0012-history-service.md)
- [Roadmap](../roadmap/ROADMAP.md)
