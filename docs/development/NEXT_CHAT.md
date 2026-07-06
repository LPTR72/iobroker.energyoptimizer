# NEXT_CHAT

Stand: 06.07.2026 06:52 Uhr

## Session startup

Every new development session must begin with this document.

If `.local/PROJECT_CONTEXT.md` exists, read it immediately afterwards. It contains private environment-specific information and must never be committed or copied into repository documentation.

Repository documentation remains the canonical project documentation.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest fully validated feature milestone: Neutral ExecutionPlanner Foundation.
- Validated feature commit: `8e3ccaa` (`feat: add dormant execution planner foundation`).
- TypeScript 6/7 Readiness analysis is complete and caused no configuration or code changes.
- Current local candidate: extended neutral execution-planning semantics.
- Actions now expose feasible power, energy, duration, and state-of-charge ranges without selecting device setpoints.
- Time windows narrow action validity; expired intent, incompatible ranges, and overlapping charge/discharge intent are blocked.
- The time-semantics review issue is fixed: actions never start before `generatedAt`, and expired opposing intent is ignored.
- The fix passed formal re-review without new findings.
- The planner remains disconnected from polling, publication, scheduling, ioBroker states, and devices.
- Existing simulation and recommendation publication remains read-only and functionally unchanged.

## Validation status

- Local TypeScript build successful.
- Focused ExecutionPlanner tests: 13/13 passed.
- Complete test suite: 79/79 passed.
- Local diff check and formal completion re-review successful.
- Commit, push, Raspberry Pi build/package, and ioBroker regression validation have not occurred for this candidate.

## Next recommended step

Review the local execution-planning candidate and complete the full local quality gate. Commit and push only after explicit approval, then validate the exact revision on the Raspberry Pi and ioBroker test installation before starting another functional milestone.

No runtime integration, plan publication, scheduling, execution provider, setpoint selection, or device control is approved.

## Open risks

- Limits describe allowed ranges; the planner does not evaluate a live state of charge or choose a setpoint.
- Conflict detection currently covers overlapping opposite storage actions, not a general multi-action scheduling graph.
- A future runtime boundary requires separate safety architecture and explicit user approval.
- The candidate is incomplete under the Definition of Done until commit/push and Raspberry/ioBroker validation succeed.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [ADR-0010](../architecture/ADR/ADR-0010-neutral-execution-planner.md)
- [ADR-0011](../architecture/ADR/ADR-0011-execution-planning-semantics.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
