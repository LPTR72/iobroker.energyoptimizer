# PROJECT_HANDOFF

Stand: 06.07.2026 20:35 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, validation results, open risks, and next recommended milestone. Local development notes may exist outside version control, but repository documentation remains canonical.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest completed milestone: History Service architecture/documentation refinement and polish; functional implementation remains open.
- ADR-0012 defines the planned History Service as the adapter's central historical data platform.
- History Collector, History Aggregator, and the implementation-neutral History Repository remain internal responsibilities behind one service boundary.
- Typed metrics, deterministic 1-minute-to-daily aggregation, temporal context, data quality, hierarchical retention, and repository availability are defined as planned architecture.
- The preferred initial repository implementation uses the ioBroker SQL Adapter with MariaDB/MySQL, while future implementations remain possible.
- `PredictionEngine` is one consumer of history and never stores historical data.
- No production code, tests, APIs, state names, configuration formats, or runtime behavior changed.
- ADR-0013 defines Pattern-based Virtual Energy Assets as a long-term architecture topic; implementation remains unselected.
- Current work is documentation-only: ADR-0014 adopts the Simulation Framework as a permanent long-term architecture capability with open implementation order.

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

Select and explicitly approve the next milestone from the roadmap. Pattern-based Virtual Energy Assets and the Simulation Framework are not the next implementation task unless explicitly selected later. No runtime integration, SQL implementation, history collection, pattern recognition, simulation framework implementation, scheduling, execution provider, or device control is approved by this documentation milestone.

## Open risks

- History Service implementation remains an open, likely multi-step epic/workstream.
- SQL/ioBroker history-backend integration remains planned.
- No runtime integration of the History Service has been approved.
- Pattern recognition, virtual-asset persistence, user confirmation flows, and downstream optimization use remain planned and unselected.
- Simulation Framework orchestration, scenario formats, benchmark metrics, demonstration behavior, and implementation order remain open and unselected.

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
