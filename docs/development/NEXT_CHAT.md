# Next-chat handoff

Use this document as the opening context for the next ChatGPT session.

## Repository context

- **Branch:** `refactor/core-architecture`
- **Recent commits:**
  - `84aa3b9 Add npm lockfile`
  - `77781fb Add configurable prediction timing`
  - `67ed772 Add neutral optimization domain models`
  - `1666783 Add prediction engine`
  - `ac0c0fe Add forecast provider abstraction`
  - `1b0b7aa Add neutral energy analysis engine`
  - `b35dbd3 feat(health): expose normalized asset counts`

## Implemented architecture

- Generic asset model and legacy configuration normalization
- `EnergySystemFactory` and `OptimizerInputFactory`
- Asset-health and normalized-asset counters
- `AnalysisEngine` and `EnergyAnalysis`
- Forecast abstraction, `EnergyForecast`, and `ForecastProvider`
- `PredictionEngine`, configurable `PredictionOptions`, `EnergyPrediction`, and `TimeSeriesMerger`
- Neutral situations, recommendations, execution plans/actions, capabilities, constraints, and goals

The new domain pipeline is not integrated into active polling. Adapter runtime behavior remains the existing state mirroring and fixed-tariff cost calculation.

## Next steps

1. Implement `EvaluationEngine` using `EnergyAnalysis`, `EnergyPrediction`, and the neutral situation model when explicitly requested.
2. Keep recommendation, execution planning, execution providers, and polling integration out of scope until explicitly requested.
3. Preserve the separate sampling, prediction, evaluation, and horizon concepts documented in the architecture.

## Validation

```bash
npm run build
npm test
git diff --check
git status
```

If npm is unavailable in the local Codex runtime, invoke the installed TypeScript compiler and Node built-in test runner directly, and report that substitution clearly.
