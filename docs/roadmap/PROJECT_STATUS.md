# Project status

## Implemented

- Existing ioBroker source-state polling and live mirroring
- Fixed-tariff interval cost accumulation
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

The current local candidate test suite contains 79 tests. Active polling invokes the read-only simulation pipeline, but the planner is not runtime-integrated and adapter behavior remains free of scheduling, execution, and device control.

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
| Execution planning | Extended dormant semantics implemented and locally validated |
| Device execution | Planned and approval-gated |
