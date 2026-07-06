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
- Read-only simulation runtime integration and deterministic JSON publication
- Structured read-only recommendation projection for adapter-state consumers
- Dormant neutral `ExecutionPlanner` foundation with deterministic capability and constraint matching
- Neutral action limits, time-window intersection, expiry handling, and opposite storage-action conflict detection
- Scalable architecture, development, roadmap, and image documentation structure

### Documented for future development

- Separate sampling, prediction, and evaluation resolutions and prediction horizon
- Neutral efficiency, loss, cost, degradation, opportunity-cost, and goal-priority semantics

### Preserved

- Existing adapter polling, state IDs, configuration compatibility, live mirroring, fixed-tariff calculations, logging, and rounding
