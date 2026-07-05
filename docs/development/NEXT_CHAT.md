# NEXT_CHAT

Stand: 05.07.2026 21:28 Uhr

## Session startup

Every new ChatGPT or Codex session must begin with this document.

If `.local/PROJECT_CONTEXT.md` exists, read it immediately afterwards. It contains private environment-specific information and must never be committed or copied into repository documentation.

Repository documentation remains the canonical project documentation.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest fully validated feature milestone: Neutral ExecutionPlanner Foundation.
- Validated feature commit: `8e3ccaa` (`feat: add dormant execution planner foundation`).
- `ExecutionPlanner` deterministically creates `noop`, `blocked`, or `dormant` neutral plans from recommendations, capabilities, and constraints.
- It maps only unambiguous actions and never guesses behavior for abstract recommendations.
- The planner is not connected to polling, publication, scheduling, ioBroker states, or devices.
- The existing simulation and recommendation publication remains read-only and functionally unchanged.

## Validation status

- Local TypeScript build successful.
- Focused ExecutionPlanner tests: 6/6 passed.
- Complete test suite: 72/72 passed.
- Local diff check and working-tree review successful.
- Commit and push successful.
- Raspberry Pi pull, dependency installation, build, tests, and package creation successful.
- ioBroker installation and regression validation successful.

## Next recommended step

Design the remaining neutral execution-planning semantics for power, energy, duration, state of charge, conflicts, and expiry before considering any runtime integration.

This milestone has not started and requires explicit user approval. No runtime integration, plan publication, scheduling, execution provider, or device control is approved.

## Open risks

- Abstract recommendations intentionally remain blocked until explicit action-selection policy exists.
- Power, energy, duration, state-of-charge, conflict, and expiry rules need further design.
- A future runtime boundary requires separate safety architecture and explicit user approval.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [ADR-0010](../architecture/ADR/ADR-0010-neutral-execution-planner.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
