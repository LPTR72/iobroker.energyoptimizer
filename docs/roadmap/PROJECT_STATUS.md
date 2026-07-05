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
- Validated dormant read-only `SimulationRuntime` with source snapshot and completeness warnings
- Scalable documentation structure

## Open

- `ExecutionPlanner`, capability matching, and constraint enforcement
- Execution layer
- Concrete forecast, tariff, history, and weather providers
- Explicitly approved device execution
- Runtime integration of the new domain pipeline
- Public recommendation-state contract and read-only publication lifecycle
- Counter resets, richer tariffs, history, simulation, and CI
- Evaluation timing and neutral efficiency, cost, degradation, opportunity-cost, and goal trade-off logic

The test suite should be validated with `npm test` in an environment with npm available. The active adapter behavior remains unchanged.

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
| Simulation runtime | Foundation implemented and test-server validated; publication not integrated |
| Execution | Planned |
