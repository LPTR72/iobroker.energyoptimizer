# PROJECT_HANDOFF

Stand: 11.07.2026

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project state, latest completed milestone, validation result, open risks, and next recommended milestone.

It intentionally stays concise. Architecture details, workflow rules, historical reasoning, and implementation decisions belong in the referenced documents.

## Current Project State

- Active branch: `refactor/core-architecture`.
- Functional runtime remains read-only.
- No device control, execution provider, foreign-state writes, or autonomous actuation is approved.
- The History Service Domain Foundation is implemented and validated.
- History collection from external SQL/ioBroker history backends and runtime persistence remain separate future milestones.
- Recommendation and Simulation publication remain operational and were included in the Raspberry Pi regression validation.
- The Information Interpreter remains the semantic system boundary for normalization, validation, direction/sign interpretation, temporal meaning, quality, freshness, and availability.

## Latest Completed Milestone

- Milestone: **History Service Domain Foundation**.
- Status: **Completed and approved**.
- Scope:
  - typed history metrics, samples, buckets, resolutions, and quality metadata;
  - deterministic collector and aggregation domain logic;
  - complete aggregation chain through `1d`;
  - exact binary-value contract accepting only `0` and `1`;
  - rejected-sample accounting for invalid binary inputs;
  - typed Day Boundary Strategy with `rolling24h` and `calendarDayLocal`;
  - unchanged `first` aggregation semantics;
  - no runtime or ioBroker dependency added to the domain layer.
- Architecture result:
  - `rolling24h` represents epoch-aligned intervals of exactly 24 hours;
  - `calendarDayLocal` represents local calendar-day boundaries using JavaScript calendar arithmetic, including DST behavior;
  - temporal semantics are explicit rather than hidden inside the aggregator.

## Validation Summary

### Local validation

- Strict TypeScript build: passed.
- Automated tests: passed.
- History aggregation chain through `1d`: passed.
- Binary contract and rejected-sample behavior: passed.
- Day Boundary Strategy coverage: passed.
- Existing `first` semantics regression coverage: passed.
- No runtime or ioBroker dependency introduced into the History domain foundation.

### Raspberry Pi / ioBroker validation

Runtime validation on the ioBroker Raspberry Pi completed successfully.

Verified adapter states included:

- `health.lastPollingTimestamp`
- `health.configuredSources`
- `health.validSources`
- `health.missingSources`
- `live.grid.importPower`
- `costs.today.currentTariffEuro`
- `costs.month.currentTariffEuro`
- `recommendation.available`
- `recommendation.count`
- `simulation.ready`
- `simulation.publication.json`

Observed validation outcome:

- configured fixed sources: `2`;
- valid fixed sources: `2`;
- missing fixed sources: `0`;
- recommendation available: `true`;
- recommendation count: `1`;
- simulation ready: `true`;
- simulation publication: valid JSON containing analysis, prediction, situations, recommendations, and warnings.

The different source counts in Health and Simulation are intentional: Health counts the fixed configured source objects, while Simulation also represents normalized/modelled inputs and assets.

The deliberately configured test values were not energy-balanced (`PV 500 W`, consumption `620 W`, grid export `120 W`, grid import `0 W`). This was an input-data characteristic, not a failure of publication. The resulting discussion identified future domain work for data-quality and plausibility classification at the system boundary; it is not part of this completed milestone.

## Review Outcome

- Blocking implementation issues found: 0 remaining.
- Blocking architecture issues found: 0 remaining.
- Blocking runtime issues found: 0 remaining.
- Local build and tests: passed.
- Raspberry Pi / ioBroker validation: passed.
- Runtime publication regression: passed.
- Final review status: **Approved**.
- Milestone status: **Closed**.

## Architecture Confidence

- Domain isolation: high.
- Determinism: high.
- Aggregation semantics: high.
- Binary-value contract: high.
- Temporal semantics: high after introducing explicit Day Boundary Strategy.
- Runtime compatibility: confirmed by Raspberry Pi / ioBroker validation.
- Extensibility: good; backend integration and further temporal contracts remain intentionally separate.

Architecture Confidence supplements, but does not replace, tests, runtime validation, Review Outcome, or approval.

## Open Risks and Deferred Topics

- SQL/ioBroker history-backend integration remains unimplemented.
- Runtime history collection and persistence remain unimplemented.
- Future History Service ioBroker states remain intentionally unselected.
- Pattern recognition and calibrated Asset Profiles remain domain candidates, not current runtime functionality.
- Goal Task / Zielauftrag naming and contract remain open.
- Data Quality, energy-balance plausibility, and Result Confidence require later domain consolidation.
- Capability-specific natural horizons and refresh intervals require later temporal-domain work.
- Rechenintensive simulations and large parameter searches require explicit performance budgets, caching, scheduling, or optional offloading.
- Development Platform Refresh to a complete `arm64` operating system remains a separate infrastructure milestone; it is not part of functional adapter development.
- Scheduling, execution providers, device control, and autonomous actuation remain deferred.

## Knowledge and Workflow Follow-up

The related exploratory findings are recorded in the Developer Workspace:

- `Brainstorming/Schnipselkompost_v2.0.md`
- `Brainstorming/SK_ADDENDUM_DEVELOPMENT_PLATFORM_REFRESH.md`

The addendum currently preserves:

- Development Platform Refresh;
- natural capability horizons and update intervals;
- plausibility validation at the system boundary;
- separation of Asset Health, Data Quality, and Result Confidence;
- links to Standard Profiles and calibrated Asset Profiles.

These topics must be consolidated into stable domain or workflow documentation before implementation is approved.

## Next Recommended Milestone

Do not start another implementation slice automatically.

First perform a scoped **Domain Model Consolidation** to evaluate and name the mature knowledge candidates around:

- Goal State / Goal Task;
- Standard Profile and Calibrated Asset Profile;
- Data Quality and Result Confidence;
- capability-specific horizons and refresh intervals;
- energy-system plausibility at the Information Interpreter boundary.

The consolidation should decide which topics become stable domain contracts, which remain Schnipsel, and which require an ADR. SQL integration, runtime history wiring, device control, and autonomous execution remain outside that consolidation unless separately approved.

## Required Reading

1. `docs/development/PROJECT_HANDOFF.md`.
2. `docs/development/WORKFLOW.md`.
3. `docs/architecture/DOMAIN_MODEL.md`.
4. `docs/architecture/ARCHITECTURE.md`.
5. `docs/architecture/ADR/ADR-0012-history-service.md`.
6. `docs/architecture/ADR/ADR-0015-information-interpreter-boundary.md`.
7. `docs/development/TESTING.md`.
8. `docs/roadmap/ROADMAP.md` only when milestone sequencing is required.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Architecture decisions](../architecture/DECISIONS.md)
- [Object model](../architecture/OBJECT_MODEL.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [ADR-0012 History Service](../architecture/ADR/ADR-0012-history-service.md)
- [ADR-0013 Pattern-based Virtual Energy Assets](../architecture/ADR/ADR-0013-pattern-based-virtual-energy-assets.md)
- [ADR-0014 Simulation Framework](../architecture/ADR/ADR-0014-simulation-framework.md)
- [ADR-0015 Information Interpreter Boundary](../architecture/ADR/ADR-0015-information-interpreter-boundary.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
