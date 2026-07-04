# Project status

## Implemented

- Existing ioBroker source-state polling and live mirroring
- Fixed-tariff interval cost accumulation
- Generic energy assets and legacy configuration normalization
- Energy-system and optimizer-input factories
- Health and normalized asset counters
- Neutral `AnalysisEngine` and `EnergyAnalysis`
- Forecast-provider abstraction and `EnergyForecast`
- `PredictionEngine`, `EnergyPrediction`, and `TimeSeriesMerger`
- Scalable documentation structure

## Open

- `EnergySituation` and `EnergyRecommendation` models
- `ExecutionPlan` and `ExecutionAction` models
- `DeviceCapability`, `EnergyConstraint`, and `OptimizationGoal` models
- `EvaluationEngine` and `RecommendationEngine`
- `ExecutionPlanner`, capability matching, and constraint enforcement
- Execution layer
- Concrete forecast, tariff, history, and weather providers
- Explicitly approved device execution
- Runtime integration of the new domain pipeline
- Counter resets, richer tariffs, history, simulation, and CI

The test suite should be validated with `npm test` in an environment with npm available. The active adapter behavior remains unchanged.

## Maturity overview

| Area | Maturity |
| --- | --- |
| Architecture | High |
| Core domain foundation | Medium/high |
| Forecast abstraction | Medium/high |
| Prediction | Medium/high |
| Evaluation | Planned |
| Recommendation | Planned |
| Execution | Planned |
