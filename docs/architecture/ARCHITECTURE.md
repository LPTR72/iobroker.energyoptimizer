# Architecture

## Overview

The project follows Clean Architecture: stable domain models and deterministic engines sit at the center, while ioBroker lifecycle, state access, providers, persistence, and eventual device execution remain boundary concerns. The core models the physical energy system and its decision context rather than any particular automation platform, vendor, protocol, adapter, or cloud service.

Durable architecture decisions and consolidated milestone boundaries are summarized in [Architecture decisions](DECISIONS.md). The cross-document semantic reference is the [Domain model](DOMAIN_MODEL.md). These documents must not remain implicit chat knowledge.

## System boundary

The Information Interpreter is the semantic system boundary established by [ADR-0015](ADR/ADR-0015-information-interpreter-boundary.md).

```text
External source
    -> source binding or alias
    -> information type
    -> Information Interpreter
    -> validated domain information
```

The optimizer supports information types rather than a fixed list of adapters or manufacturers. Aliases and source bindings stabilize identity. The Information Interpreter stabilizes meaning, units, sign and direction conventions, temporal semantics, freshness, quality, and availability.

History, forecast, prediction, analysis, evaluation, simulation, recommendation, planning, and execution remain separate capabilities behind this boundary.

## Implemented components

- Adapter lifecycle and polling orchestration in `main.ts`
- `IStateProvider` with ioBroker infrastructure implementation
- `StateManager`, centralized state definitions, tariff calculation, and health reporting
- Generic `EnergyAsset` model and `ConfigurationNormalizer`
- `EnergySystemFactory` and `OptimizerInputFactory`
- `AnalysisEngine` producing `EnergyAnalysis`
- `ForecastProvider` abstraction and neutral `EnergyForecast`
- `PredictionEngine`, reusable `TimeSeriesMerger`, and configurable `PredictionOptions`
- Neutral situations, recommendations, execution plans/actions, capabilities, constraints, and optimization goals under `src/lib/optimization`
- Pure `EvaluationEngine` with validated `EvaluationOptions`
- Pure `RecommendationEngine` with validated `RecommendationOptions`
- Pure dormant `ExecutionPlanner` with conservative capability, physical-limit, time-window, conflict, and expiry handling
- Read-only `SimulationRuntime` integration after successful polling, with source-completeness reporting
- Deterministic `SimulationPublication` snapshot and structured read-only recommendation projection
- Initial History Service domain foundation with typed metrics, samples, buckets, collector, aggregator, and tests

## Planned components

- Information Interpreter runtime contracts, validation results, transformations, and source-binding model
- Initial information-type catalog and minimum/recommended/reference information profiles
- Forecast, tariff, weather, calendar, and context provider implementations
- A dedicated `History Service` as the central historical data platform, with typed metrics, deterministic aggregation, abstract persistence, retention, data quality, and temporal context
- Asset Profiles, Standard Profiles, calibration, and explainable learning
- A generic `Pattern Recognition Engine` and user-confirmed Pattern-based Virtual Energy Assets / Knowledge Model
- A first-class `Simulation Framework` for development, replay, validation, benchmarks, demonstrations, accelerated time, and regression testing
- First-class KPI, Goal, Target Value, Hard Constraint, Soft Constraint, Preference, and Goal Task semantics
- Capability-aware execution adapters with explicit safety controls

## Domain topology

The architecture is not one rigid runtime pipeline. Interpreted information can feed several cooperating paths.

```text
External Sources
    -> Source Bindings / Aliases
    -> Information Types
    -> Information Interpreter
    -> Domain Information
         |-> Current State ---------> Analysis ---------> Evaluation ----|
         |-> History ------------------------------|                      |
         |-> Forecast -----------------------------|-> Prediction --------+-> Recommendation
         |-> Context Information -----------------|                      |
         |                                                               |
         |-> Scenario / candidate actions -----------------> Simulation --|
         |                                                               |
         |-> Energy Assets / Asset Profiles                              |
         |-> KPIs / Goals / Target Values / Constraints / Priorities ----|
                                                                         -> Planning
                                                                         -> Execution (future)
                                                                         -> Measurement and Re-evaluation
```

This communicates dependencies and information relationships, not a mandatory single runtime call graph. The canonical terminology and model relationships are defined in [Domain model](DOMAIN_MODEL.md).

## Analysis, evaluation, and simulation

These capabilities are related but not interchangeable.

- **Analysis** derives deterministic facts and KPIs from current, historical, or predicted state. It answers questions such as how energy currently flows, whether surplus exists, or which assets are available.
- **Evaluation** classifies relevant conditions as neutral `EnergySituation` values using explicit thresholds and validated inputs. It does not recommend, plan, simulate, or execute actions.
- **Simulation** evaluates alternative parameter systems, strategies, scenarios, or candidate actions. It may produce simulated state, KPIs, situations, costs, warnings, and outcomes for comparison.
- **Recommendation** consumes evaluated evidence from live, predicted, or simulated paths and expresses explainable, device-independent intent.

Simulation does not replace Evaluation. A live or predicted state may be evaluated directly, while simulated alternatives may also be evaluated or compared before a recommendation is selected. The exact orchestration may evolve, but these responsibilities must remain deterministic and separately testable.

## Context topology

`Context Information` is the broad category for decision-relevant conditions that do not necessarily represent physical energy flow. Current context, forecast context, and historical or temporal context are projections of that broader category rather than competing top-level concepts.

Examples include weather, tariffs, calendars, occupancy, solar position, comfort conditions, user availability, and grid restrictions. Context may influence Prediction, Evaluation, Simulation, Recommendation, and Planning directly where the relevant domain contract permits it.

## Boundaries

The domain layer contains models and pure calculations. It must not know about ioBroker object IDs, adapter lifecycle APIs, logging APIs, concrete vendors, storage schemas, or transport protocols.

The provider and integration layers acquire external values and capabilities. Source bindings and aliases connect them to configured semantic purposes. The Information Interpreter converts those values into validated domain information.

The planned History Service owns past observations and temporal context behind its own boundary. Forecast providers own external future-looking information. Prediction describes expected behavior of the concrete system. Adapter runtime code manages lifecycle, polling, state mirroring, and orchestration. The future execution layer translates approved neutral plans into device operations.

ioBroker, EcoFlow, Tibber, MQTT, Shelly, Anker, SQL, InfluxDB, and other platforms or products belong at integration boundaries. They may supply measurements, forecasts, tariffs, context, persistence, or execution capabilities, but the core represents these through information types, physical assets, context information, capabilities, and vendor-independent contracts.

This separation keeps engines deterministic, portable, and testable and prevents source-adapter, storage, or device details from leaking into optimization decisions.

The adapter-owned public ioBroker object namespace, current state tree, reserved future namespaces, JSON publication rules, and read/write policy are defined in [Object model](OBJECT_MODEL.md).

The History Service remains a single external service even though it separates collection, aggregation, and repository responsibilities internally. Analysis, prediction, evaluation, simulation, diagnostics, future visualization, pattern recognition, profile calibration, and future optimization models may consume it. The History Repository is an abstraction; SQL, the ioBroker History Adapter, InfluxDB, or future backends may provide implementations without becoming domain contracts. `PredictionEngine` consumes history when available but does not persist it and continues without historical calibration when history is disabled. The complete planned contract is defined by [ADR-0012](ADR/ADR-0012-history-service.md).

Long-term pattern recognition consumes History Service data and produces device-neutral hypotheses. Only user-confirmed hypotheses may become persistent Pattern-based Virtual Energy Assets. These virtual assets enrich a future knowledge model without claiming direct device identification or enabling control. See [ADR-0013](ADR/ADR-0013-pattern-based-virtual-energy-assets.md).

The future Simulation Framework reuses production pipeline and domain components whenever practical. Neutral inputs and an explicit simulation clock should keep optimizers unaware of live versus simulated operation. Its exact runtime interaction and implementation order remain open. See [ADR-0014](ADR/ADR-0014-simulation-framework.md).

The canonical definitions for the architecture's [timing, efficiency, cost, KPI, goal, target, constraint, preference, and priority models](OPTIMIZATION_MODELS.md) are maintained separately so future engines use consistent physical, temporal, and economic semantics.

## Compatibility

Legacy native source fields, public state IDs, fixed-tariff calculations, polling, logging, and rounding remain compatibility contracts. Structural work must not change them without explicit approval.

An older pipeline placeholder remains under `src/lib/analysis/AnalysisEngine.ts` and related pipeline directories. It is intentionally untouched until an explicit migration is designed; the current neutral engines live at `src/lib/AnalysisEngine.ts` and `src/lib/PredictionEngine.ts`.

`SimulationRuntime` is called after successful polling and publishes only adapter-owned read-only states. `simulation.publication.json` remains the complete diagnostic snapshot, while structured `recommendation.*` states expose the best recommendation for simple consumers. `ExecutionPlanner` is not connected to this path. No execution plan is scheduled and no device or foreign state is written.

The implemented `SimulationRuntime` is a narrow runtime integration and must not be confused with the planned first-class Simulation Framework.