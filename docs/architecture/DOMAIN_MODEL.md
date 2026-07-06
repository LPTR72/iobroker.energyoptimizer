# Domain model

Domain objects are adapter-neutral data contracts. They may contain measurements, timestamps, identifiers, confidence, goals, and constraints. They must not contain ioBroker APIs, object-management logic, concrete adapter names, or device commands tied to a vendor. Entries marked planned describe the intended architecture, not implemented code.

- **EnergySystemState**: current normalized grid, PV, battery, house, and heterogeneous asset snapshot. Compatibility/aggregated views remain alongside preferred asset collections.
- **EnergyAnalysis**: derived facts about current consumption, PV production, battery flow, grid flow, surplus, deficit, self-use percentages, and asset availability.
- **EnergyForecast**: provider-neutral PV, consumption, price, and weather time series with generation and validity timestamps.
- **PredictionOptions**: explicit prediction resolution and horizon settings, independent from runtime polling and future evaluation timing.
- **EnergyPrediction**: resolution-aligned prediction intervals with expected power balance, prices, battery state, and data-quality warnings.
- **EvaluationOptions**: explicit relevance, battery-state, and price thresholds used by neutral situation detection. Price defaults are placeholders for demonstration, not recommended tariff values.
- **EnergySituation**: an evaluated condition such as PV surplus, grid import/export, battery level, price period, or forecast uncertainty, produced by `EvaluationEngine`.
- **RecommendationOptions**: the minimum enabled-goal priority relevant to recommendation generation.
- **Recommendation**: ranked device-independent advice with a structured reason, horizon, and related situations/assets, produced by `RecommendationEngine`.
- **ExecutionPlan**: an identified, status-bearing collection of neutral execution actions, source intent, validity, and warnings. Dormant plans are produced by `ExecutionPlanner` but never scheduled or executed.
- **ExecutionAction**: a neutral intended operation such as charging storage, switching or scheduling a consumer, or limiting feed-in. Optional limits describe the feasible power, energy, duration, and state-of-charge range without selecting a device setpoint. Its effective horizon never starts before its plan's `generatedAt`.
- **OptimizationCapability**: declares what an asset can do and its power, energy, duration, or state-of-charge bounds.
- **OptimizationConstraint**: an enabled boundary over time, power, energy, state of charge, capability, cycling, or manual override.
- **OptimizationGoal**: an enabled, prioritized objective such as self-consumption, cost, comfort, battery protection, or feed-in compliance.

Models describe facts and intent. Providers acquire data; engines make deterministic transformations; future execution adapters alone may perform separately approved side effects.

See [Optimization models](OPTIMIZATION_MODELS.md) for canonical timing semantics and the planned efficiency, cost, and priority/goal models.
