# Next-chat handoff

Use this document as the opening context for the next ChatGPT session.

## Repository context

- **Branch:** `refactor/core-architecture`
- **Recent commits:**
  - `7da5238 Add optimization domain models` — present in history, but the current accepted project status treats these models as not yet implemented; inspect and reconcile before proceeding
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
- `PredictionEngine`, `EnergyPrediction`, and `TimeSeriesMerger`

The new domain pipeline is not integrated into active polling. Adapter runtime behavior remains the existing state mirroring and fixed-tariff cost calculation.

## Next steps

1. Implement or reconcile the neutral optimization domain models: situations, recommendations, execution plans/actions, capabilities, constraints, and goals.
2. After those models are accepted, implement `EvaluationEngine` using `EnergyAnalysis` and `EnergyPrediction`.
3. Keep recommendation, execution planning, execution providers, and polling integration out of scope until explicitly requested.

## Validation

```bash
npm run build
npm test
git diff --check
git status
```

If npm is unavailable in the local Codex runtime, invoke the installed TypeScript compiler and Node built-in test runner directly, and report that substitution clearly.
