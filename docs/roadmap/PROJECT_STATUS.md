# Project status

Stand: 06.07.2026 16:51 Uhr

## Implemented

- Existing ioBroker source-state polling and live mirroring
- Fixed-tariff interval cost accumulation with legacy-first grid-asset source fallback
- Generic energy assets and legacy configuration normalization
- Energy-system and optimizer-input factories
- Health and normalized asset counters
- Neutral `AnalysisEngine` and `EnergyAnalysis`
- Forecast-provider abstraction and `EnergyForecast`
- `PredictionEngine`, configurable `PredictionOptions`, `EnergyPrediction`, and `TimeSeriesMerger`
- Neutral `EnergySituation`, `Recommendation`, `ExecutionPlan`, `ExecutionAction`, `OptimizationCapability`, `OptimizationConstraint`, and `OptimizationGoal` models
- Neutral `EvaluationEngine` and validated `EvaluationOptions`
- Neutral `RecommendationEngine` and validated `RecommendationOptions`
- Neutral dormant `ExecutionPlanner` with conservative capability, physical-limit, time-window, conflict, and expiry semantics
- Validated read-only `SimulationRuntime` integration with source snapshot and completeness warnings
- Deterministic simulation publication JSON and structured read-only recommendation projection
- Scalable documentation structure

## Open

- Live-state validation, setpoint selection, broader conflict policy, scheduling, and execution safety
- Execution layer
- Concrete forecast, tariff, history, and weather providers
- Explicitly approved device execution
- Counter resets, richer tariffs, history, simulation, and CI
- Evaluation timing and neutral efficiency, cost, degradation, opportunity-cost, and goal trade-off logic

The validated test suite contains 86 tests. Active polling invokes the read-only simulation pipeline, but the planner is not runtime-integrated and adapter behavior remains free of scheduling, execution, and device control.

## Latest milestone validation

Commit `1385a57` passed the full completion workflow: local build, 86/86 tests, diff validation, formal review, push, Raspberry Pi rebuild/package validation, and ioBroker installation and runtime validation. With the legacy grid-import source blank, the first enabled grid asset supplied fresh `live.grid.importPower` values and restored both fixed-tariff cost accumulators. Each increased from `0.092742` EUR to `0.095004` EUR during validation.

The milestone is complete only because Raspberry Pi and ioBroker validation succeeded after the reviewed commit was pushed.

## Milestone Insights

- Local validation does not replace Raspberry Pi and ioBroker validation.
- Runtime source resolution must cover both retained legacy configuration and the preferred asset model.
- The integration package must be rebuilt from the exact revision pulled on the Raspberry Pi before installation.
- Full object snapshots before and after installation make unexpected runtime object changes observable.
- Dormant domain planning must remain absent from the runtime object tree until a separate integration milestone is approved.

## Review Outcome

- Blocking issues found: 0
- Blocking issues resolved before approval: 0
- Final review status: Approved

## Maturity overview

| Area | Maturity |
| --- | --- |
| Architecture | High |
| Core domain foundation | Medium/high |
| Forecast abstraction | Medium/high |
| Prediction | Medium/high |
| Optimization domain models | Medium/high |
| Evaluation | Implemented and validated |
| Recommendation | Implemented and validated through the simulation pipeline |
| Simulation runtime | Integrated read-only and test-server validated |
| Recommendation projection | Integrated read-only and test-server validated |
| Execution planning | Extended dormant semantics implemented and fully validated |
| Device execution | Planned and approval-gated |
