# NEXT_CHAT

Stand: 05.07.2026 21:04 Uhr

## Session startup

Every new ChatGPT or Codex session must begin with this document.

If `.local/PROJECT_CONTEXT.md` exists, read it immediately afterwards. It contains private environment-specific information and must never be committed or copied into repository documentation.

Repository documentation remains the canonical project documentation.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest fully validated feature milestone: Read-only Recommendation Projection.
- Validated feature commit: `88180c8` (`Add read-only recommendation projection`); later branch commits contain repository hygiene work.
- Current local candidate: Neutral ExecutionPlanner Foundation.
- `ExecutionPlanner` deterministically creates `noop`, `blocked`, or `dormant` neutral plans from recommendations, capabilities, and constraints.
- It maps only unambiguous actions and never guesses behavior for abstract recommendations.
- The planner is not connected to polling, publication, scheduling, ioBroker states, or devices.
- The existing simulation and recommendation publication remains read-only and functionally unchanged.

## Validation status

- Local TypeScript build successful.
- Focused ExecutionPlanner tests: 6/6 passed.
- Complete test suite: 72/72 passed.
- Final `git diff --check` and working-tree review remain part of the current handoff.
- Commit, push, Raspberry Pi build/package, and ioBroker regression validation have not yet occurred.

## Next recommended step

Review the local ExecutionPlanner candidate, complete local diff validation, then commit and push only after explicit approval. Pull and validate that exact revision on the Raspberry Pi and ioBroker test installation before starting another architecture milestone.

No runtime integration, plan publication, scheduling, execution provider, or device control is approved.

## Open risks

- Abstract recommendations intentionally remain blocked until explicit action-selection policy exists.
- Power, energy, duration, state-of-charge, conflict, and expiry rules need further design.
- A future runtime boundary requires separate safety architecture and explicit user approval.
- The local candidate is not a completed milestone under the project Definition of Done until repository and ioBroker validation succeed.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [ADR-0010](../architecture/ADR/ADR-0010-neutral-execution-planner.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
