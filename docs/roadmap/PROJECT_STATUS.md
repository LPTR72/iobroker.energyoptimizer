# Project status

Stand: 06.07.2026 18:32 Uhr

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
- Concrete forecast, tariff, and weather providers
- History Service implementation, SQL integration, typed metrics, retention, quality reporting, and temporal context
- Explicitly approved device execution
- Counter resets, richer tariffs, history, simulation, and CI
- Evaluation timing and neutral efficiency, cost, degradation, opportunity-cost, and goal trade-off logic

The validated test suite contains 86 tests. Active polling invokes the read-only simulation pipeline, but the planner is not runtime-integrated and adapter behavior remains free of scheduling, execution, and device control.

## Latest milestone validation

The History Service architecture refinement and polish completed with architecture consistency, ADR cross-reference, terminology, build, 86/86 test, and diff validation. ADR-0012 now defines the central historical data platform, its internal responsibilities, typed aggregation model, implementation-neutral repository, preferred initial SQL integration, temporal context, retention, and consumer boundaries. No production code, tests, configuration, state, or runtime behavior changed.

The last production milestone remains commit `1385a57`, whose Raspberry Pi and ioBroker validation restored grid-asset-backed live import and cost accumulation.

## Milestone Insights

- Local validation does not replace Raspberry Pi and ioBroker validation.
- Runtime source resolution must cover both retained legacy configuration and the preferred asset model.
- The integration package must be rebuilt from the exact revision pulled on the Raspberry Pi before installation.
- Full object snapshots before and after installation make unexpected runtime object changes observable.
- Dormant domain planning must remain absent from the runtime object tree until a separate integration milestone is approved.
- Historical storage must remain behind an implementation-neutral repository boundary, and prediction must remain storage-free.

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
| History Service | Architecture accepted; implementation planned |
| Optimization domain models | Medium/high |
| Evaluation | Implemented and validated |
| Recommendation | Implemented and validated through the simulation pipeline |
| Simulation runtime | Integrated read-only and test-server validated |
| Recommendation projection | Integrated read-only and test-server validated |
| Execution planning | Extended dormant semantics implemented and fully validated |
| Device execution | Planned and approval-gated |
