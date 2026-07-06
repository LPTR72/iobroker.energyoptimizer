# Energy optimization pipeline

1. **EnergySystemState** - normalized snapshot of grid, PV, batteries, consumers, and compatibility views.
2. **AnalysisEngine -> EnergyAnalysis** - derives current production, consumption, balance, battery, grid, and asset-health facts.
3. **HistoryService -> HistoricalSeries + TemporalContext** - planned central historical data platform for analysis, prediction, evaluation, simulation, diagnostics, future visualization, and future optimization models.
4. **ForecastProvider -> EnergyForecast** - supplies neutral future-looking time-series forecasts without exposing provider details.
5. **PredictionEngine -> EnergyPrediction** - applies explicit prediction resolution and horizon options, consumes available forecast/history inputs, fills safe fallbacks, and predicts power, price, and battery values without storing history.
6. **EvaluationEngine -> EnergySituation[]** - detects meaningful observed and predicted conditions using explicit thresholds.
7. **RecommendationEngine -> Recommendation[]** - ranks device-independent advice from situations, goals, and recommendation-level constraints.
8. **ExecutionPlanner -> ExecutionPlan** - dormant, deterministic conversion of unambiguous recommendations into neutral actions bounded by capabilities, constraints, time, conflicts, and expiry.
9. **ExecutionLayer -> device actions** - planned provider-specific execution, only after explicit approval and safety design.

```text
State providers -> EnergySystemState -> Analysis
Live samples -> History Service -> Historical series + context -> Prediction
Forecast providers -> EnergyForecast ---------------------------> Prediction
Analysis + Prediction -> Evaluation -> Recommendation
Goals + Constraints + Capabilities -> ExecutionPlanner -> ExecutionLayer
```

The diagram shows the prediction path, not an exclusive dependency: prediction is only one History Service consumer.

After successful polling, `SimulationRuntime` exercises the analysis-to-recommendation pipeline from a consistent source-state snapshot. It suppresses recommendations for incomplete configured sources. `SimulationPublication` provides a complete JSON diagnostic snapshot, and the recommendation projection exposes selected read-only fields as adapter-owned states.

This integration does not schedule actions, write foreign states, or control devices. The implemented `ExecutionPlanner` and the planned `ExecutionLayer` remain outside the active runtime.

Sampling resolution, prediction resolution, future evaluation resolution, and prediction horizon are separate architecture concepts. See the [timing model](OPTIMIZATION_MODELS.md#timing-model).

The History Service path is planned and not part of active polling. Its canonical live-to-daily aggregation chain and storage boundary are defined in [ADR-0012](ADR/ADR-0012-history-service.md).

## Long-term pattern knowledge flow

```text
Data Acquisition
  -> History Service
  -> Pattern Recognition Engine
  -> Pattern-based Virtual Energy Assets / Knowledge Model
  -> Prediction Engine
  -> Cost Model / Battery Strategy
  -> Optimizer / Recommendation Engine
```

Every component in this additional flow is planned where not already implemented. Recognition produces generic hypotheses, not hardcoded device identities. Only user-confirmed hypotheses persist as virtual assets. See [ADR-0013](ADR/ADR-0013-pattern-based-virtual-energy-assets.md).
