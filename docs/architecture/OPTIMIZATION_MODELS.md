# Optimization models

This document defines the architectural meaning of timing, efficiency, cost, KPIs, goals, target values, constraints, preferences, and priorities in the vendor-neutral optimization core. Except where explicitly marked implemented, these sections describe future domain contracts and do not imply runtime integration or evaluation logic.

## Timing model

Energy data and optimization decisions operate at several intentionally separate time scales:

- **Sampling resolution** is how often measurements are acquired from an integration. It depends on source capabilities, rate limits, and the physical signal. The active ioBroker adapter currently polls every 60 seconds by default, but that runtime setting is not a core prediction setting.
- **Forecast resolution** is the interval width supplied by an external future-looking provider. It may differ between weather, PV, tariff, and grid forecasts.
- **Prediction resolution** is the width of each predicted interval. It is implemented through `PredictionOptions.resolutionMinutes` and determines the step size of `EnergyPrediction` time series.
- **Evaluation resolution** is how often future `EnergySituation` values are recalculated from analysis and prediction. It remains planned and may differ from both polling and prediction resolution.
- **Simulation resolution** is the interval width at which a scenario or alternative strategy is evaluated. It may be finer than presentation output and coarser than source sampling.
- **Planning resolution** is the interval or event granularity used to describe feasible future actions. It must preserve relevant deadlines, physical limits, and temporal freedom without inheriting provider timing accidentally.
- **Execution timing** is the approved real-world start, duration, deadline, or validity window of a planned action. It belongs to the future execution boundary and must not be inferred from polling cadence.
- **Prediction horizon** is how far a prediction extends into the future. It is implemented through `PredictionOptions.horizonMinutes` and is independent from how frequently measurements or evaluations occur.
- **Target time or target interval** defines when a Target Value or requested outcome should hold, such as a battery reserve at sunset or an electric vehicle charge level before departure.
- **Validity interval** defines when information, a recommendation, a plan, a tariff, or a constraint is applicable.
- **Re-evaluation cadence** defines when changed measurements or context require an existing recommendation or plan to be reconsidered.
- **Historical resolution** is the width of a persisted History Service bucket. The canonical planned chain is 1, 5, 15, and 60 minutes followed by daily buckets; only the 1-minute level receives live samples.
- **Output resolution** is the aggregation or presentation level used for public states, reports, charts, or user interfaces. It must not silently redefine calculation semantics.

These concepts are separate because faster sampling does not necessarily improve forecast granularity, evaluation does not need to run for every measurement, a long planning horizon can use coarse intervals, and public presentation may use a different resolution from internal calculations. Keeping them independent prevents provider, storage, runtime, or UI timing from becoming an implicit optimization rule.

The Information Interpreter owns the semantic meaning of source timestamps and validity information. History may align already interpreted timestamps to bucket boundaries but must not reinterpret their meaning. Historical aggregation is deterministic and metric-specific rather than a prediction concern. See [ADR-0012](ADR/ADR-0012-history-service.md) and [ADR-0015](ADR/ADR-0015-information-interpreter-boundary.md).

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

A price is not a global constant. It is time-valid information with an explicit currency, energy unit, import/export direction, source, and validity interval. Tariff or price changes must affect only the energy intervals for which they are valid. Historical, current, forecast, and simulated prices must remain distinguishable.

Estimated costs such as degradation and opportunity cost must remain distinguishable from billed tariff values. The existing fixed-tariff adapter calculation remains a runtime compatibility feature; it is not yet this future core cost model.

## KPI and decision model

The optimization domain keeps measurement, desired outcomes, feasibility, and ranking separate.

### KPI

A **KPI** measures or predicts a system condition. Examples include self-consumption ratio, autonomy, grid import, cost, battery reserve, forecast accuracy, or comfort deviation.

A KPI is informative. It is not itself a user command, target, constraint, or optimization permission.

### Goal

A **Goal** describes a desired outcome or optimization direction. `OptimizationGoal` is implemented as a neutral, enabled, prioritized foundation.

Future evaluation and recommendation logic may balance goals including:

- maximize self-consumption;
- minimize grid import;
- minimize energy costs;
- preserve battery health;
- preserve user comfort;
- comply with feed-in or grid limits.

### Target Value

A **Target Value** quantifies a desired state at a defined time or over an interval.

Examples include:

- battery state of charge at least 30% at sunset;
- electric vehicle state of charge at least 80% before 07:00;
- room temperature 22 °C by 19:00;
- self-consumption ratio at least 80% over a selected period.

The same numeric statement may be a target, hard boundary, soft boundary, or preference depending on required strictness. The model must represent that intent explicitly rather than infer it from the number alone.

### Constraint

A **Constraint** limits the feasible solution space.

- A **Hard Constraint** makes a violating solution infeasible.
- A **Soft Constraint** may be violated only when the consequence is evaluated and explained.
- A **Preference** influences ranking without defining feasibility.

Physical capabilities, safety limits, manual overrides, regulatory restrictions, and explicit approval boundaries cannot be bypassed by goal priority.

### Priority

A **Priority** expresses relative importance between goals or preferences. It helps resolve conflicts but never grants permission to violate hard constraints, physical limits, safety boundaries, or missing capabilities.

Equal priorities and trade-offs must remain deterministic and explainable. Future engines must expose why one option was preferred and which goals or soft constraints were compromised.

### Goal Task working concept

A future user-facing request may describe a desired target state together with temporal and operational freedom, for example “finish the washing machine before 18:00” or “charge the vehicle to 80% before departure.”

`Goal Task` remains a working name. Before implementation, the naming catalog must decide whether this concept is best represented as a goal request, flexibility request, planning request, command, or separate aggregate.

## Relationship to analysis, evaluation, simulation, and recommendation

The decision model does not prescribe one monolithic engine.

- **Analysis** derives facts and KPIs from current or historical state.
- **Evaluation** classifies relevant situations using explicit thresholds and validated inputs.
- **Simulation** evaluates alternative parameter systems, strategies, scenarios, or candidate actions.
- **Recommendation** ranks and explains useful device-independent intent.
- **Planning** converts eligible intent into a feasible course of action.
- **Execution** remains the only future boundary for approved real-world side effects.

Simulation does not automatically replace evaluation. Live and predicted conditions may be evaluated directly, while simulated alternatives may produce simulated KPIs, situations, and outcomes for comparison. The exact orchestration remains an architecture topic, but responsibilities must stay separate and deterministic.

## Relationship to the physical system

The optimization core models a physical energy system: assets, energy flows, time, limits, efficiencies, costs, KPIs, goals, target values, constraints, preferences, priorities, and intended actions. ioBroker is one runtime integration. EcoFlow, Tibber, MQTT, Shelly, Anker, and similar systems are data, tariff, transport, persistence, or execution integrations around the core.

Integration boundaries translate external representations into neutral contracts and translate explicitly approved plans back into external operations. Vendor names, API clients, object IDs, topics, storage schemas, and protocol details must not become core domain concepts.