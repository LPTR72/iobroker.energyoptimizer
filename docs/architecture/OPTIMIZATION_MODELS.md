# Optimization models

This document defines the architectural meaning of timing, efficiency, cost, and priorities in the vendor-neutral optimization core. Except where explicitly marked implemented, these sections describe future domain contracts and do not imply runtime integration or evaluation logic.

## Timing model

Energy data and optimization decisions operate at several intentionally separate time scales:

- **Sampling resolution** is how often measurements are acquired from an integration. It depends on source capabilities, rate limits, and the physical signal. The active ioBroker adapter currently polls every 60 seconds by default, but that runtime setting is not a core prediction setting.
- **Prediction resolution** is the width of each predicted interval. It is implemented through `PredictionOptions.resolutionMinutes` and determines the step size of `EnergyPrediction` time series.
- **Evaluation resolution** is how often future `EnergySituation` values are recalculated from analysis and prediction. It remains planned and may differ from both polling and prediction resolution.
- **Prediction horizon** is how far a prediction extends into the future. It is implemented through `PredictionOptions.horizonMinutes` and is independent from how frequently measurements or evaluations occur.
- **Historical resolution** is the width of a persisted History Service bucket. The canonical planned chain is 1, 5, 15, and 60 minutes followed by daily buckets; only the 1-minute level receives live samples.

These concepts are separate because faster sampling does not necessarily improve forecast granularity, evaluation does not need to run for every measurement, and a long planning horizon can still use coarse intervals. Keeping them independent prevents provider or runtime timing from becoming an implicit optimization rule.

Historical aggregation is deterministic and metric-specific rather than a prediction concern. See [ADR-0012](ADR/ADR-0012-history-service.md).

## Efficiency model

The future efficiency model will describe physical conversion and storage losses without encoding a manufacturer or protocol. Candidate neutral properties include:

- battery charge efficiency;
- battery discharge efficiency;
- battery roundtrip efficiency;
- inverter efficiency;
- conversion losses between electrical domains;
- fixed or state-dependent standby losses.

Efficiencies should identify the applicable asset and direction, state their units and valid range, and distinguish measured values from configured assumptions. The model must avoid double-counting—for example, roundtrip efficiency must not be applied in addition to separate charge and discharge efficiencies for the same calculation. No efficiency calculation is implemented yet.

## Cost model

The future cost model will translate neutral energy flows and time intervals into comparable economic effects. It may include:

- electricity purchase price;
- feed-in tariff or export compensation;
- battery degradation cost in a future lifecycle model;
- opportunity costs, such as consuming stored energy now instead of during a later high-price period.

Prices require an explicit currency, energy unit, validity interval, and import/export direction. Estimated costs such as degradation and opportunity cost must remain distinguishable from billed tariff values. The existing fixed-tariff adapter calculation remains a runtime compatibility feature; it is not yet this future core cost model.

## Priority and goal model

`OptimizationGoal` is implemented as a neutral, enabled, prioritized objective. Future evaluation and recommendation logic will balance goals including:

- maximize self-consumption;
- minimize grid import;
- minimize energy costs;
- preserve battery health;
- preserve user comfort.

Priority expresses relative importance, not permission to violate constraints. Hard constraints, asset capabilities, manual overrides, and safety limits always bound the solution space. Conflicting goals should remain visible and deterministic; future engines must document how equal priorities and trade-offs are resolved.

## Relationship to the physical system

The optimization core models a physical energy system: assets, energy flows, time, limits, efficiencies, costs, goals, and intended actions. ioBroker is one runtime integration. EcoFlow, Tibber, MQTT, Shelly, Anker, and similar systems are data, tariff, transport, or execution integrations around the core.

Integration adapters translate external representations into neutral contracts and translate explicitly approved plans back into external operations. Vendor names, API clients, object IDs, topics, and protocol details must not become core domain concepts.
