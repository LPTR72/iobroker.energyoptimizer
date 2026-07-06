# PROJECT_HANDOFF

Stand: 06.07.2026 18:32 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, validation results, open risks, and next recommended milestone. Local development notes may exist outside version control, but repository documentation remains canonical.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest completed milestone: History Service architecture refinement and polish.
- ADR-0012 defines the planned History Service as the adapter's central historical data platform.
- History Collector, History Aggregator, and the implementation-neutral History Repository remain internal responsibilities behind one service boundary.
- Typed metrics, deterministic 1-minute-to-daily aggregation, temporal context, data quality, hierarchical retention, and repository availability are defined as planned architecture.
- The preferred initial repository implementation uses the ioBroker SQL Adapter with MariaDB/MySQL, while future implementations remain possible.
- `PredictionEngine` is one consumer of history and never stores historical data.
- No production code, tests, APIs, state names, configuration formats, or runtime behavior changed.

## Validation status

- Architecture consistency: passed.
- ADR cross-references: passed.
- Terminology review: passed.
- Build: passed.
- Tests: 86/86 passed.
- `git diff --check`: passed.
- No production code or tests changed.

## Review Outcome

- Blocking issues found: 0
- Blocking issues resolved before approval: 0
- Final review status: Approved

## Next recommended step

Select and explicitly approve the next milestone from the roadmap. No runtime integration, SQL implementation, history collection, scheduling, execution provider, or device control is approved by this documentation milestone.

## Open risks

- History Service implementation remains planned.
- SQL/ioBroker history-backend integration remains planned.
- No runtime integration of the History Service has been approved.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [ADR-0010](../architecture/ADR/ADR-0010-neutral-execution-planner.md)
- [ADR-0011](../architecture/ADR/ADR-0011-execution-planning-semantics.md)
- [ADR-0012](../architecture/ADR/ADR-0012-history-service.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
