# PROJECT_HANDOFF

Stand: 11.07.2026

## Purpose

This tool-neutral document is the canonical project handoff. It records the current project state, latest completed milestone, validation result, open risks, and next recommended milestone.

It intentionally stays concise. Architecture details, workflow rules, historical reasoning, and implementation decisions belong in the referenced documents.

## Current Project State

- Active branch: `refactor/core-architecture`.
- Functional runtime remains read-only.
- No device control, execution provider, foreign-state writes, or autonomous actuation is approved.
- The History Service Domain Foundation remains implemented and Raspberry-/ioBroker-validated.
- The subsequent **Domain Model Consolidation** documentation milestone is completed.
- `docs/architecture/DOMAIN_MODEL.md` now includes first-class planned concepts for Asset Health, Data Quality, Plausibility Assessment, Result Confidence, and Capability Timing.
- Goal-oriented planning, Asset Profiles, Forecast, Prediction, Simulation, Information Interpreter responsibilities, and parameter-system evaluation are consolidated in the canonical domain language.
- The Developer Workspace Schnipselkompost was consolidated to v2.1 and its Development Platform Refresh addendum was marked as integrated.
- History collection from external SQL/ioBroker history backends and runtime persistence remain separate future milestones.
- Recommendation and Simulation publication remain operational from the last successful Raspberry Pi regression validation.

## Latest Completed Milestone

- Milestone: **Domain Model Consolidation**.
- Status: **Completed and approved**.
- Scope:
  - consolidate mature Schnipselkompost knowledge into the canonical domain model;
  - define and separate Asset Health, Data Quality, Plausibility Assessment, and Result Confidence;
  - define Capability Timing as domain-relevant semantics for natural horizon, validity, refresh strategy, and computation budget;
  - preserve the separation between domain timing requirements and scheduler/infrastructure implementation;
  - confirm Standard Profile and calibrated Asset Profile as related but distinct concepts;
  - preserve Goal Task as a planned working term while keeping its final name and aggregate boundary open;
  - consolidate Forecast, Prediction, Simulation, and parameter-system semantics;
  - integrate the Development Platform Refresh addendum without mixing infrastructure migration into functional adapter development.
- Documentation result:
  - `docs/architecture/DOMAIN_MODEL.md` updated;
  - `Brainstorming/Schnipselkompost_v2.0.md` consolidated as Schnipselkompost v2.1 in the Developer Workspace;
  - `Brainstorming/SK_ADDENDUM_DEVELOPMENT_PLATFORM_REFRESH.md` marked as content-integrated and retained as provenance;
  - stable knowledge moved to the `Übernommen` lifecycle state while unresolved contracts and naming questions remain explicit.

## Validation Summary

### Documentation validation

- Canonical domain model reread after update: passed.
- Schnipselkompost consolidation self-review: passed.
- No intentional knowledge deletion: confirmed by the consolidation review.
- Addendum integration status: confirmed.
- Open naming and contract questions remain explicitly documented instead of being decided implicitly.

### Runtime validation baseline

No runtime or implementation behavior changed in this documentation-only milestone, so no new Raspberry deployment was required.

The last Raspberry Pi / ioBroker validation remains valid for the unchanged runtime baseline. It successfully covered:

- adapter runtime and polling;
- configured, valid, and missing fixed-source health states;
- grid import publication;
- current tariff cost counters;
- recommendation availability and count;
- Simulation readiness and publication JSON.

The earlier deliberately inconsistent energy-balance input remains the trigger for the now-documented Plausibility Assessment, Data Quality, and Result Confidence concepts. Their appearance in the domain model does not imply runtime implementation.

## Review Outcome

- Blocking documentation issues found: 0 remaining.
- Blocking architecture inconsistencies found: 0 remaining for the consolidation scope.
- Runtime changes introduced: none.
- New implementation approved: none.
- Final review status: **Approved**.
- Milestone status: **Closed**.

## Architecture Confidence

- Canonical domain-language consistency: high.
- Separation of Asset Health, Data Quality, and Result Confidence: high at concept level.
- Information Interpreter boundary: high at concept level.
- Capability Timing semantics: good baseline; exact contracts remain open.
- Goal-oriented planning model: good baseline; final Goal Task boundary remains open.
- Asset Profile lifecycle: good baseline; persistence and calibration ownership remain open.

Architecture Confidence supplements, but does not replace, implementation tests, runtime validation, Review Outcome, or approval.

## Open Risks and Deferred Topics

- SQL/ioBroker history-backend integration remains unimplemented.
- Runtime history collection and persistence remain unimplemented.
- Future History Service ioBroker states remain intentionally unselected.
- Pattern recognition and calibrated Asset Profiles remain planned domain concepts, not current runtime functionality.
- The final name and aggregate boundary for `Goal Task` remain open.
- Ownership of Asset Profile persistence and calibration state remains open.
- Exact contracts and classification scales for Asset Health, Data Quality, Plausibility Assessment, and Result Confidence remain open.
- Ownership of cross-information plausibility evaluation between the Information Interpreter and downstream domain services remains open.
- Capability Timing contract boundaries, dependency invalidation, and scheduling semantics remain open.
- A broader capability-spanning Temporal Contract remains a candidate rather than an accepted model.
- `Context Information` versus `Context Asset` remains unresolved.
- Final domain treatment and implementation names for Hard Constraint, Soft Constraint, and Preference remain unresolved.
- Rechenintensive simulations and large parameter searches still require explicit performance budgets, caching, scheduling, or optional offloading.
- Development Platform Refresh to a complete `arm64` operating system remains a separate infrastructure milestone.
- Scheduling, execution providers, device control, and autonomous actuation remain deferred.

## Knowledge and Workflow State

The exploratory findings were consolidated in the private Developer Workspace:

- `Brainstorming/Schnipselkompost_v2.0.md` — consolidated to v2.1 through commit `edd5886`;
- `Brainstorming/SK_ADDENDUM_DEVELOPMENT_PLATFORM_REFRESH.md` — marked as content-integrated;
- `workflow/DEVELOPMENT_PLATFORM.md` — canonical infrastructure facts and arm64 migration boundary.

The Schnipselkompost remains the working memory for new or unresolved knowledge. Stable domain decisions belong in the project architecture documentation and ADRs.

## Next Recommended Milestone

Do not start implementation automatically.

First scope the next domain-contract milestone. The strongest current candidate is **Goal-oriented Planning Domain**, focused on:

- the final responsibility and aggregate boundary of Goal Task / Zielauftrag;
- relationships among Goal, Target Value, Constraint, Preference, Priority, Recommendation, and Planning;
- temporal and operational freedom of user-described target states;
- explicit exclusions from execution and device-specific control.

Before approving that milestone, compare it against the other mature contract candidates:

- Asset Profile persistence and calibration ownership;
- Data Quality, Plausibility Assessment, and Result Confidence contracts;
- Capability Timing, invalidation, and scheduling semantics.

Choose one bounded contract slice, define acceptance criteria, and keep implementation outside the milestone unless separately approved.

## Required Reading

1. `docs/development/PROJECT_HANDOFF.md`.
2. `docs/development/WORKFLOW.md`.
3. `docs/architecture/DOMAIN_MODEL.md`.
4. `docs/architecture/ARCHITECTURE.md`.
5. `docs/architecture/ADR/ADR-0015-information-interpreter-boundary.md` when information quality or system-boundary work is in scope.
6. `docs/architecture/ADR/ADR-0012-history-service.md` when history or temporal aggregation work is in scope.
7. `docs/development/TESTING.md` before implementation work.
8. `docs/roadmap/ROADMAP.md` only when milestone sequencing is required.
9. Relevant Schnipselkompost entries from the Developer Workspace for unresolved naming or cross-domain questions.

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
