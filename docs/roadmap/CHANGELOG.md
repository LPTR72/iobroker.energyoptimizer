# Changelog

## Unreleased

### Added

- Neutral `AnalysisEngine` and energy-analysis domain model
- Forecast-provider abstraction and neutral forecast model
- `PredictionEngine` and prediction domain model
- Configurable prediction resolution and horizon through `PredictionOptions`
- Reusable `TimeSeriesMerger`
- Neutral situation, recommendation, execution-plan/action, capability, constraint, and optimization-goal models
- Neutral `EvaluationEngine` with explicit validated thresholds
- Neutral `RecommendationEngine` with deterministic ranking and relevance options
- Dormant read-only simulation orchestration with conservative incomplete-source handling, validated on the ioBroker test server
- Scalable architecture, development, roadmap, and image documentation structure

### Documented for future development

- Separate sampling, prediction, and evaluation resolutions and prediction horizon
- Neutral efficiency, loss, cost, degradation, opportunity-cost, and goal-priority semantics

### Preserved

- Existing adapter polling, state IDs, configuration compatibility, live mirroring, fixed-tariff calculations, logging, and rounding
