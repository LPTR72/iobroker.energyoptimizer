# Changelog

## Unreleased

### Fixed

- Fixed-tariff cost polling now retains legacy `sourceGridImportPower` precedence and falls back to the first enabled grid asset with a configured power state.
- The resolved grid-import source is used consistently for live mirroring, cost accumulation, and polling health counts.

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
- Dedicated central History Service architecture with typed metrics, deterministic aggregation, an implementation-neutral repository, retention, data quality, and extensible temporal context
- Clarified that History Service architecture documentation is complete while functional implementation remains an open multi-step workstream
- Pattern Recognition Engine and user-confirmed Pattern-based Virtual Energy Assets / Knowledge Model as a long-term architecture and roadmap concept

### Preserved

- Existing adapter polling, state IDs, configuration compatibility, live mirroring, fixed-tariff calculations, logging, and rounding
- Dormant planner boundaries and read-only runtime behavior
