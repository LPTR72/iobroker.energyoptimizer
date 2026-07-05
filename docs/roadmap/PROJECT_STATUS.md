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
- Neutral dormant `ExecutionPlanner` foundation with conservative capability and constraint matching
- Validated read-only `SimulationRuntime` integration with source snapshot and completeness warnings
- Deterministic simulation publication JSON and structured read-only recommendation projection
- Scalable documentation structure

## Open

- Extended execution-planning semantics for power, energy, state of charge, conflicts, and expiry
- Execution layer
- Concrete forecast, tariff, history, and weather providers
- Explicitly approved device execution
- Counter resets, richer tariffs, history, simulation, and CI
- Evaluation timing and neutral efficiency, cost, degradation, opportunity-cost, and goal trade-off logic

The validated test suite contains 72 tests. Active polling invokes the read-only simulation pipeline, but the planner is not runtime-integrated and adapter behavior remains free of scheduling, execution, and device control.

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
| Execution planning | Dormant foundation implemented and fully validated |
| Device execution | Planned and approval-gated |
