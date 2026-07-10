# Domain model

## Status

Draft architecture baseline, updated 2026-07-10.

This document consolidates the current domain language of `ioBroker.energyoptimizer`. It does not replace ADRs. ADRs explain individual decisions; this document shows how accepted and planned concepts relate to one another.

Entries marked planned describe intended architecture, not implemented runtime behavior.

## Purpose

The domain model is the central semantic reference between architecture decisions, public documentation, configuration design, and later implementation.

The product story remains:

```text
Understand -> Recommend -> Plan -> Automate
```

The underlying architecture is a cooperating capability network rather than one rigid runtime pipeline.

## System boundary

External systems provide technical values. The domain consumes interpreted information.

```text
External source
    -> Source Binding or Alias
    -> Information Type
    -> Information Interpreter
    -> Validated Domain Information
```

### External Source *(planned generalization)*

An external source is an ioBroker state, adapter, provider, script, protocol integration, repository, API, or future connector that supplies a value or capability.

External source names and vendor-specific structures are integration concerns, not domain concepts.

### Source Binding *(planned)*

A Source Binding connects one external source to one configured semantic purpose.

An ioBroker Alias is the preferred stable binding where it improves replaceability and clarity. A binding stabilizes identity but does not by itself define all physical, temporal, directional, and quality semantics.

### Information Type *(planned)*

An Information Type is a stable semantic contract such as:

- `Grid.ImportPower`;
- `Grid.ExportPower`;
- `Grid.Power`;
- `PV.Power`;
- `Battery.StateOfCharge`;
- `Asset.Power`;
- `Tariff.ImportPrice`;
- `Forecast.CloudCover`;
- `Calendar.Occupancy`;
- `Grid.Constraint.PowerLimit`.

The separate information-type catalog defines detailed contracts. This document defines the role of those contracts in the domain model.

### Information Interpreter *(planned)*

The Information Interpreter is the semantic system boundary. It validates and transforms technical input into vendor-neutral Domain Information.

It owns:

- configured meaning;
- value validation;
- unit normalization;
- sign and direction semantics;
- explicit transformations;
- temporal semantics;
- source freshness and availability classification;
- deterministic validation results.

It does not own history aggregation, forecasting, prediction, simulation, recommendation, planning, or execution.

### Domain Information *(planned)*

Domain Information is a validated value with explicit semantics. Depending on its Information Type, it may contribute to current state, history, forecast, context, goals, constraints, or capability descriptions.

Domain Information must not contain unresolved adapter, vendor, protocol, or object-ID semantics.

## Physical and contextual domain

### Energy Asset

An Energy Asset represents physical energy behavior.

Examples include:

- grid connection;
- photovoltaic generation;
- battery storage;
- consumer or flexible load;
- electric vehicle and charger;
- heat pump;
- thermal storage;
- conversion assets.

An Energy Asset may describe generation, consumption, conversion, storage, flexibility, controllability, limits, efficiencies, and observable state.

The existing generic `EnergyAsset` and compatibility views provide the implemented foundation.

### Context Information *(planned generalization)*

Context Information influences decisions without itself representing physical energy flow.

Examples include:

- weather;
- tariffs;
- calendar;
- occupancy;
- solar position;
- regulatory or grid restrictions;
- user availability;
- comfort conditions.

`Context Asset` remains a naming candidate, but `Context Information` is the current neutral architecture term until the naming catalog resolves whether context needs asset identity and lifecycle semantics.

### Asset Profile *(planned)*

An Asset Profile describes expected behavior of an Energy Asset or a confirmed Pattern-based Virtual Energy Asset.

A profile may include:

- expected runtime;
- power phases;
- energy requirement;
- maximum power;
- timing variance;
- state transitions;
- flexibility;
- uncertainty;
- observed quality.

A Standard Profile provides an initial expectation. Historical observations may calibrate it into an asset-specific profile.

```text
Standard Profile
    -> Observations
    -> Calibration
    -> Asset-specific Profile
    -> Continuous evidence-based refinement
```

Calibration is explainable model refinement, not automatic proof of device identity.

## Current implemented and planned information models

- **EnergySystemState**: current normalized grid, PV, battery, house, and heterogeneous asset snapshot. Compatibility and aggregated views remain alongside preferred asset collections.
- **EnergyAnalysis**: derived facts about current consumption, PV production, battery flow, grid flow, surplus, deficit, self-use percentages, and asset availability.
- **EnergyForecast**: provider-neutral PV, consumption, price, and weather time series with generation and validity timestamps.
- **PredictionOptions**: explicit prediction resolution and horizon settings, independent from runtime polling and future evaluation timing.
- **EnergyPrediction**: resolution-aligned prediction intervals with expected power balance, prices, battery state, and data-quality warnings.
- **HistoricalMetricType**: explicit historical semantics such as power, energy counter, state of charge, binary state, temperature, price, or generic number. Each type defines deterministic aggregation behavior.
- **HistoricalBucket**: a typed metric aggregate for one asset and time interval, including resolution and data-quality metadata.
- **HistoricalSeries**: an ordered collection of compatible historical buckets returned by the History Service.
- **TemporalContext**: prediction-relevant calendar and daylight dimensions, extensible through weather, occupancy, vacation, tariff, and grid-restriction context.

## History, forecast, prediction, and knowledge

### History Service

The History Service owns historical treatment of already interpreted information:

- history-specific sample validation;
- deterministic bucketing;
- metric-specific aggregation;
- retention;
- data-quality coverage;
- repository access;
- historical query contracts.

The interpreter defines timestamp meaning and temporal semantics. The History Service may align valid timestamps to bucket boundaries, but it must not reinterpret their semantic meaning.

The repository remains backend-neutral. SQL, the ioBroker History Adapter, InfluxDB, or future storage implementations may sit behind the same boundary.

### Forecast

A Forecast describes externally expected future conditions, such as weather, tariff periods, solar radiation, or grid restrictions.

Forecast is not household-specific prediction and is not created by the History Service.

### Prediction

Prediction describes likely future behavior of the concrete household energy system.

Prediction may combine Current State, Forecast, historical evidence, calibrated Asset Profiles, Context Information, and explicit fallbacks.

### Pattern Hypothesis *(planned)*

A Pattern Hypothesis is detected regularity with evidence, confidence, time range, and relevant context. It is not authoritative knowledge and must not become a persistent virtual asset automatically.

### Pattern-based Virtual Energy Asset *(planned)*

A user-confirmed Pattern Hypothesis may become a Pattern-based Virtual Energy Asset. It remains device-neutral knowledge unless a separate explicit physical binding is configured.

A virtual asset may enrich prediction, simulation, cost, recommendation, diagnostics, and visualization. It does not by itself authorize control.

### Energy Knowledge Model *(planned)*

The Energy Knowledge Model contains confirmed physical and virtual asset knowledge made available to predictive and optimization consumers.

## Decision model

### KPI *(planned first-class model)*

A KPI measures or predicts a system condition.

Examples include self-consumption ratio, autonomy, grid import, cost, battery reserve, or forecast accuracy.

A KPI is not a user command and is not itself a target.

### Goal

A Goal describes a desired outcome or optimization direction.

The implemented `OptimizationGoal` provides the current neutral, enabled, prioritized foundation.

Examples include:

- maximize self-consumption;
- minimize grid import;
- minimize energy cost;
- preserve battery health;
- preserve comfort.

### Target Value *(planned)*

A Target Value quantifies a desired state at a defined time or over an interval.

Example:

```text
Battery state of charge >= 30% at sunset
```

### Constraint

A Constraint limits the feasible solution space.

The implemented `OptimizationConstraint` represents the current neutral boundary foundation. Future domain modeling must distinguish at least:

- **Hard Constraint**: violation makes a solution infeasible;
- **Soft Constraint**: violation is allowed only when evaluated and explained;
- **Preference**: influences ranking without defining feasibility.

The final implementation names remain subject to the naming catalog.

### Priority

Priority expresses relative importance between goals or preferences. Priority never grants permission to violate hard safety limits or physical capabilities.

### Goal Task *(working name, planned)*

`Goal Task` is the current working name for a user-defined desired outcome with temporal and operational freedom.

A future Goal Task may contain:

- target Energy Asset;
- desired target state;
- earliest start;
- latest completion or target time;
- priority;
- constraints;
- comfort limits;
- approval mode.

The final name and aggregate boundary remain open and must be resolved before implementation.

## Reasoning and action models

- **EvaluationOptions**: explicit relevance, battery-state, and price thresholds used by neutral situation detection. Price defaults are placeholders for demonstration, not recommended tariff values.
- **EnergySituation**: an evaluated condition such as PV surplus, grid import or export, battery level, price period, or forecast uncertainty, produced by `EvaluationEngine`.
- **RecommendationOptions**: the minimum enabled-goal priority relevant to recommendation generation.
- **Recommendation**: ranked device-independent advice with a structured reason, horizon, and related situations or assets, produced by `RecommendationEngine`.
- **ExecutionPlan**: an identified, status-bearing collection of neutral execution actions, source intent, validity, and warnings. Dormant plans are produced by `ExecutionPlanner` but never scheduled or executed.
- **ExecutionAction**: a neutral intended operation such as charging storage, switching or scheduling a consumer, or limiting feed-in. Optional limits describe feasible power, energy, duration, and state-of-charge ranges without selecting a device setpoint.
- **OptimizationCapability**: declares what an asset can do and its power, energy, duration, or state-of-charge bounds.

### Simulation

Simulation evaluates alternative decisions, parameter systems, strategies, or scenarios.

Simulation must consider connected system effects rather than isolated parameter changes. It should reuse production domain components and explicit time semantics wherever practical.

Planned simulation contracts include:

- **SimulationScenario**: versioned initial state, input series, events, constraints, clock settings, and expected observations for replay, demonstration, regression, or benchmarking.
- **SimulationClock**: explicit controllable time source supporting deterministic and accelerated execution.
- **SimulationRun**: one scenario execution with recorded inputs, component versions, outputs, warnings, and benchmark metrics.

### Recommendation

A Recommendation expresses explainable, device-independent intent. It should identify evidence, expected effects, relevant goals, constraints, uncertainty, and why the option is preferred.

### Planning

Planning converts eligible intent into a feasible course of action using capabilities, time windows, physical limits, conflicts, and constraints.

Planning is not execution. A blocked plan is preferable to guessed device behavior.

### Execution *(future boundary)*

Execution is the only future boundary allowed to perform approved real-world side effects. It translates neutral planned actions into device-specific operations through explicit capabilities and safety controls.

The current runtime remains read-only.

### Measurement and re-evaluation *(future closed loop)*

After future execution, new measurements return through the same Interpreter boundary. The system then updates Current State, History, Prediction, and evaluation.

```text
Goal
    -> Current State
    -> Forecast and Context
    -> Prediction
    -> Simulation
    -> Recommendation
    -> Planning
    -> Execution (future)
    -> Measurement
    -> Re-evaluation
```

A changed condition changes the feasible solution space. It does not merely make the previous rule fail.

## Capability topology

The main relationships are:

```text
External Sources
    -> Source Bindings / Aliases
    -> Information Types
    -> Information Interpreter
    -> Domain Information
         |-> Current State -------------------|
         |-> History -------------------------|-> Prediction
         |-> Forecast ------------------------|
         |-> Context Information -------------|
         |                                      -> Simulation
         |                                      -> Recommendation
         |                                      -> Planning
         |                                      -> Execution (future)
         |                                      -> Measurement and Re-evaluation
         |
         |-> Energy Assets / Asset Profiles
         |-> KPIs / Goals / Target Values / Constraints / Priorities
```

This communicates dependencies and information relationships, not a mandatory single runtime call graph.

## Implementation status boundary

Implemented foundations include generic Energy Assets, analysis, forecast abstraction, prediction, evaluation, recommendation, dormant planning, read-only runtime publication, and the initial History Service domain foundation.

Planned or incomplete concepts include the Information Interpreter runtime contract, the complete Information Type catalog, broad Context Information modeling, profile calibration, pattern recognition, Goal Tasks, first-class simulation, capability-aware execution adapters, and closed-loop automation.

No planned concept becomes runtime behavior merely because it appears in this document.

## Related architecture artifacts

- [Architecture](ARCHITECTURE.md)
- [Architecture decisions](DECISIONS.md)
- [Optimization models](OPTIMIZATION_MODELS.md)
- [Object model](OBJECT_MODEL.md)
- [ADR-0002: Generic asset model](ADR/ADR-0002-generic-asset-model.md)
- [ADR-0012: History Service](ADR/ADR-0012-history-service.md)
- [ADR-0013: Pattern-based Virtual Energy Assets](ADR/ADR-0013-pattern-based-virtual-energy-assets.md)
- [ADR-0014: Simulation Framework](ADR/ADR-0014-simulation-framework.md)
- [ADR-0015: Information Interpreter as the System Boundary](ADR/ADR-0015-information-interpreter-boundary.md)

## Open naming and modeling decisions

- `Context Information` versus `Context Asset`;
- final name and aggregate boundary for `Goal Task`;
- implementation names for Hard Constraint, Soft Constraint, and Preference;
- relationship between Information Type and Historical Metric Type;
- relationship between physical Energy Assets and Pattern-based Virtual Energy Assets;
- source-binding cardinality, fallback, and derivation rules;
- ownership of profile persistence and calibration state;
- capability contracts for future execution.
