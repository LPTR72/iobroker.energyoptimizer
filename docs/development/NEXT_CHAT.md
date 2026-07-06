# NEXT_CHAT

Stand: 06.07.2026 07:19 Uhr

## Session startup

Every new development session must begin with this document.

If `.local/PROJECT_CONTEXT.md` exists, read it immediately afterwards. It contains private environment-specific information and must never be committed or copied into repository documentation.

Repository documentation remains the canonical project documentation.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest fully validated milestone: extended neutral ExecutionPlanner semantics.
- Validated commit: `986d722` (`feat: extend dormant execution planner semantics`).
- Actions expose feasible power, energy, duration, and state-of-charge ranges without selecting device setpoints.
- Actions never start before `generatedAt`; expired opposing intent does not create false conflicts.
- The planner remains disconnected from polling, publication, scheduling, ioBroker states, and devices.
- Existing simulation and recommendation publication remains read-only and functionally unchanged.

## Validation status

- Local build successful; focused tests 13/13; complete suite 79/79; diff check successful.
- Formal completion review and time-semantics re-review approved.
- Commit and push successful.
- Raspberry Pi dependency installation, build, tests, and package creation successful.
- ioBroker installation and restart successful; no adapter errors or warnings observed.
- Health values validated: `configuredSources=1`, `validSources=1`, `missingSources=0`, and `lastPollingTimestamp` updated.
- Full object inspection confirmed that no planner, execution, or action runtime states were introduced.

## Next recommended step

Select and explicitly approve the next functional milestone from the roadmap. No runtime integration, plan publication, scheduling, execution provider, setpoint selection, or device control is currently approved.

## Open risks

- Limits describe allowed ranges; the planner does not evaluate a live state of charge or choose a setpoint.
- Conflict detection covers overlapping opposite storage actions, not a general multi-action scheduling graph.
- A future runtime boundary requires separate safety architecture and explicit approval.

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
