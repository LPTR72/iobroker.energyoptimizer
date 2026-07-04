# Testing

The project uses strict TypeScript compilation and Node's built-in test runner without an additional test framework.

Current tests cover:

- `AnalysisEngine`
- Forecast-provider abstraction contracts
- `PredictionEngine`
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
