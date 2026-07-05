# Energy optimization pipeline

1. **EnergySystemState** - normalized snapshot of grid, PV, batteries, consumers, and compatibility views.
2. **AnalysisEngine -> EnergyAnalysis** - derives current production, consumption, balance, battery, grid, and asset-health facts.
3. **ForecastProvider -> EnergyForecast** - supplies neutral time-series forecasts without exposing provider details.
4. **PredictionEngine -> EnergyPrediction** - applies explicit prediction resolution and horizon options, fills safe fallbacks, and predicts power, price, and battery values.
5. **EvaluationEngine -> EnergySituation[]** - detects meaningful observed and predicted conditions using explicit thresholds.
6. **RecommendationEngine -> Recommendation[]** - ranks device-independent advice from situations, goals, and recommendation-level constraints.
7. **ExecutionPlanner -> ExecutionPlan** - planned capability matching and conversion of recommendations into safe actions.
8. **ExecutionLayer -> device actions** - planned provider-specific execution, only after explicit approval and safety design.

```text
State providers -> EnergySystemState -> Analysis
Forecast providers ------------------> Prediction
Analysis + Prediction -> Evaluation -> Recommendation
Goals + Constraints + Capabilities -> ExecutionPlanner -> ExecutionLayer
```

After successful polling, `SimulationRuntime` exercises the analysis-to-recommendation pipeline from a consistent source-state snapshot. It suppresses recommendations for incomplete configured sources. `SimulationPublication` provides a complete JSON diagnostic snapshot, and the recommendation projection exposes selected read-only fields as adapter-owned states.

This integration does not schedule actions, write foreign states, or control devices. `ExecutionPlanner` and `ExecutionLayer` remain outside the active runtime.

Sampling resolution, prediction resolution, future evaluation resolution, and prediction horizon are separate architecture concepts. See the [timing model](OPTIMIZATION_MODELS.md#timing-model).
