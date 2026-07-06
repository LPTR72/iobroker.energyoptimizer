# PROJECT_HANDOFF

Stand: 06.07.2026 16:51 Uhr

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project status, latest completed milestone, validation results, open risks, and next recommended milestone. Local development notes may exist outside version control, but repository documentation remains canonical.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest fully validated milestone: grid-import asset fallback for fixed-tariff cost polling.
- Validated commit: `1385a57` (`fix: use grid asset fallback for cost polling`).
- A nonblank legacy `sourceGridImportPower` remains authoritative for backward compatibility.
- When the legacy source is blank, polling uses the first enabled grid asset with a nonblank `powerStateId`.
- The resolved source drives `live.grid.importPower`, fixed-tariff cost accumulation, and polling health counts.
- The planner remains disconnected from polling, publication, scheduling, ioBroker states, and devices.
- No state names, reset logic, execution behavior, or unrelated simulation behavior changed.

## Validation status

- Local build successful; complete suite 86/86; diff check successful.
- Formal completion review approved with no blocking issues.
- Commit and push successful.
- The Raspberry Pi pulled the pushed branch, rebuilt the package, and supplied that local build for ioBroker installation.
- The deployed build contained `GridImportSourceResolver`; adapter upload and restart succeeded.
- `health.lastPollingTimestamp` and `live.grid.importPower` received fresh timestamps.
- Both cost states increased from `0.092742` EUR to `0.095004` EUR, including in the Admin object tree.

## Review Outcome

- Blocking issues found: 0
- Blocking issues resolved before approval: 0
- Final review status: Approved

## Next recommended step

Select and explicitly approve the next milestone from the roadmap. A future documentation-refactoring milestone should review source-of-truth verification guidance. No runtime integration, plan publication, scheduling, execution provider, setpoint selection, or device control is currently approved.

## Open risks

- Daily and monthly cost states do not yet reset at calendar boundaries.
- Optional base-price allocation and richer tariff models remain future work.
- Resolver and cost behavior have focused coverage, but there is no direct `main.ts` polling integration test yet.
- Planner limitations and any future runtime boundary remain separate, approval-gated work.

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
