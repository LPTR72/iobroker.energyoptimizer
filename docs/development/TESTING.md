# Testing

The project uses strict TypeScript compilation and Node's built-in test runner without an additional test framework.

Current tests cover:

- `AnalysisEngine`
- Forecast-provider abstraction contracts
- `PredictionEngine`
- Default, custom, and invalid `PredictionOptions`
- `EvaluationEngine` situation detection, the default 20 W relevance boundary, custom thresholds, and `EvaluationOptions` validation
- `RecommendationEngine` empty inputs, ranking, deterministic ordering, relevance, constraints, and input immutability
- `ExecutionPlanner` no-op, dormant and blocked plans, physical-limit intersection, time windows, expiry, future-effective opposite-action conflicts, deterministic output, validation, and input immutability
- `SimulationRuntime` surplus, deficit, neutral-threshold, and incomplete-source scenarios
- `TimeSeriesMerger`
- Optimization domain models

Every change should run:

```bash
npm run build
npm test
git diff --check
git status
```

Add focused tests for success paths, missing or invalid values, zero values, multiple assets or timestamps, fallbacks, warnings, and boundary conditions. Runtime integrations require proportional integration testing on an ioBroker test installation.

Permanent ExecutionPlanner time-boundary coverage includes fully future horizons, partially elapsed but still valid horizons, fully expired horizons, expired opposing intent, and overlapping future opposing intent. Every produced action must start at or after `generatedAt`.
