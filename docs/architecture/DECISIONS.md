# Architecture decisions

Detailed records are maintained in the [ADR index](ADR/README.md):

- [ADR-0001: Clean Architecture](ADR/ADR-0001-clean-architecture.md)
- [ADR-0002: Generic asset model](ADR/ADR-0002-generic-asset-model.md)
- [ADR-0003: Analysis engine](ADR/ADR-0003-analysis-engine.md)
- [ADR-0004: Forecast abstraction](ADR/ADR-0004-forecast-abstraction.md)
- [ADR-0005: Prediction engine](ADR/ADR-0005-prediction-engine.md)
- [ADR-0006: Evaluation engine](ADR/ADR-0006-evaluation-engine.md)
- [ADR-0007: Recommendation engine](ADR/ADR-0007-recommendation-engine.md)
- [ADR-0008: Read-only simulation runtime](ADR/ADR-0008-read-only-simulation-runtime.md)
- [ADR-0009: Read-only runtime publication](ADR/ADR-0009-read-only-runtime-publication.md)

The summaries below provide a readable overview.

## Domain independence

Business logic stays independent from ioBroker. Lifecycle, state access, logging, and object creation belong outside the optimizer core and behind interfaces.

## Generic assets and compatibility views

The generic asset model is the preferred future representation for heterogeneous systems. Existing grid, PV, battery, and house views remain supported to preserve compatibility during gradual migration.

## Abstract providers before integrations

Forecast and state-provider contracts are defined before concrete providers. This prevents Forecast.Solar, tariff, weather, history, or device-specific assumptions from becoming core concepts.

## Prediction before evaluation

Time alignment, explicit resolution and horizon options, fallbacks, and prediction warnings belong in `PredictionEngine`; evaluation should consume a stable prediction rather than repeat provider-specific handling. Sampling, prediction, and evaluation timing remain separate concerns.

## Planned recommendations are not execution

Recommendations express device-independent intent. A separate `ExecutionPlanner` will match intent against capabilities and constraints. A future execution layer alone may perform side effects; the architecture avoids a monolithic `OptimizerEngine` that mixes reasoning and control.

`RecommendationEngine` now implements the intent-producing step. It ranks known situation/goal combinations deterministically and applies only recommendation-level constraints; it does not plan or execute actions.

## Evaluation produces neutral situations

`EvaluationEngine` consumes analysis and prediction, applies explicit validated thresholds, and produces `EnergySituation` values. It does not recommend, plan, execute, or access runtime infrastructure.

## Behavior stability during domain modeling

Domain work does not alter state IDs, config names, polling, logging, calculations, rounding, or active adapter behavior. Behavior changes require explicit approval.

## Read-only runtime publication

After polling, the simulation pipeline may publish diagnostic JSON and structured recommendation fields only to adapter-owned states. Missing inputs remain explicit, non-ready results clear the projection, and no recommendation is scheduled or executed.

## Lightweight tests

Pure domain modules use Node's built-in test runner to keep tests fast and dependency-free. Strict TypeScript compilation remains mandatory.
