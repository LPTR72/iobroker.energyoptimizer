# ADR-0012: History Service

## Status

Accepted

## Context

Analysis, prediction, evaluation, simulation, diagnostics, future visualization, and future optimization models need a shared foundation of normalized historical measurements and temporal context. Raw live samples have inconsistent timestamps, resolutions, retention, and metric semantics. Treating history as another forecast provider would mix persistence and aggregation with future-looking data acquisition. Storing history inside `PredictionEngine` would also violate its deterministic engine boundary.

The project needs one historical-data platform that can be disabled without stopping the active runtime and that uses existing ioBroker persistence infrastructure rather than introducing an adapter-owned database.

ADR-0015 establishes the Information Interpreter as the semantic system boundary. The History Service therefore consumes interpreted, validated domain information or explicitly typed historical samples. It must not become a second owner of source-state meaning, unit conversion, sign conventions, or adapter-specific mappings.

## Decision

Introduce a planned **History Service** as the adapter's central historical data platform and the single external boundary for retaining, aggregating, and querying historical energy data. Prediction is one consumer, not the service's defining purpose. Future consumers include analysis, prediction, evaluation, simulation, diagnostics, visualization, pattern recognition, asset-profile calibration, and optimization models.

Internally the service has three responsibilities:

- **History Collector** receives interpreted samples, normalizes timestamps where necessary, validates history-specific requirements, classifies their `HistoricalMetricType`, and builds deterministic 1-minute buckets.
- **History Aggregator** owns deterministic, metric-specific aggregation and creates every higher-resolution bucket from the immediately preceding level.
- **History Repository** is the persistence abstraction through which historical buckets are stored and retrieved.

These are internal responsibilities, not separate public services. `PredictionEngine` may consume historical series and temporal context supplied by the History Service, but it must never collect, persist, retain, or mutate historical data.

### Boundary to the Information Interpreter

The Information Interpreter and History Service have separate responsibilities:

```text
External state or provider value
    -> source binding / alias
    -> Information Interpreter
       meaning, unit, sign, direction, quality, temporal semantics
    -> typed domain information
    -> History Service
       bucketing, aggregation, retention, repository access
```

The History Service may reject samples that do not satisfy historical requirements, but it must not infer vendor-specific meaning or silently reinterpret raw ioBroker states.

The future information-type catalog may declare whether history is required, recommended, optional, or unsupported for a given information type. Historical metric classification must remain consistent with those interpreted information semantics.

### Aggregation chain

The canonical hierarchy is:

```text
Live samples
  -> 1 minute
  -> 5 minutes
  -> 15 minutes
  -> 60 minutes
  -> daily
```

Only 1-minute buckets receive live samples. Each later level is generated exclusively from the immediately previous level: 5-minute buckets from 1-minute buckets, 15-minute buckets from 5-minute buckets, 60-minute buckets from 15-minute buckets, and daily buckets from 60-minute buckets. Reprocessing the same complete input must produce the same output.

### Typed metrics and data quality

Historical values use an explicit `HistoricalMetricType`; they are not untyped numbers. The History Aggregator applies the dedicated aggregation semantics owned by each type:

- **Power:** representative average with minimum and maximum observations.
- **Energy Counter:** opening and closing counter values plus a reset-aware interval delta; higher levels aggregate deltas without treating counter resets as consumption.
- **State of Charge:** average, minimum, maximum, and last valid value.
- **Binary State:** duration per state, transition count, first valid state for deterministic higher-level transition aggregation, and last valid state.
- **Temperature:** average, minimum, and maximum.
- **Price:** time-weighted average with minimum and maximum for the validity period.
- **Generic Number:** an explicitly configured reducer; no implicit energy or power semantics.

Buckets carry data-quality metadata including expected and valid sample counts, temporal coverage, gaps, rejected values, and source freshness. Aggregations propagate quality information so consumers can distinguish complete history from partial or stale data.

Interpreter quality and History Service quality are related but distinct. The interpreter determines whether an external value can become valid domain information. The History Service records whether enough valid information exists to form a reliable historical interval.

### Temporal context

Historical queries may include prediction-relevant temporal context:

- month;
- season;
- weekday;
- `weekdayType`: `workday`, `saturday`, `sunday`, or `holiday`;
- holiday;
- bridge day;
- daylight phase.

Separating weekday from `weekdayType` allows seasonal and behavioral patterns to distinguish named calendar days from their operational meaning. The context model is extensible. Future context information may add weather, occupancy, vacation, tariff periods, grid restrictions, or other dimensions without changing historical metric semantics.

### Storage and availability

The History Repository is implementation-neutral. Its preferred initial implementation may use the existing ioBroker SQL Adapter, with MariaDB or MySQL as a recommended storage backend today. Alternative implementations may use the ioBroker History Adapter, InfluxDB, or future repositories without changing the History Service architecture or its consumers. The energy optimizer adapter does not create, own, migrate, or administer its own database.

Without a configured repository backend, the adapter runtime continues operating, history remains disabled, and configuration/health reporting exposes a warning. Prediction continues without historical calibration and uses its documented non-history inputs and fallbacks.

### Hierarchical retention

Recommended defaults are:

| Resolution | Retention |
| --- | --- |
| 1 minute | approximately 14 days |
| 5 minutes | approximately 90 days |
| 15 minutes | approximately 1 year |
| 60 minutes | long-term |
| daily | unlimited |

At least one year of aggregated history is recommended before seasonal consumption patterns can be learned reliably. Retention remains configurable and must delete only data outside the policy for that resolution.

Different capabilities may require different source, calculation, and output resolutions. The History Service should provide explicit resolution contracts rather than forcing every consumer to rebuild time-series transformations independently.

### Asset profiles and calibration

Historical observations may later support standard-profile matching, pattern recognition, and calibration of asset-specific behavior models.

The History Service stores and supplies evidence. It does not itself decide that a pattern represents a physical device, approve a virtual asset, or mutate an asset profile. Those responsibilities belong to future pattern-recognition, user-confirmation, and asset-profile boundaries.

### Future configuration and user interface

Each information binding or energy asset may later expose planned history settings such as:

- **History enabled**;
- **Target resolution**;
- **Retention policy**;
- **Minimum quality or coverage**;
- **Bootstrap from existing history**.

These settings are architecture guidance only and do not alter the current configuration format.

A future configuration interface may group settings into **Information Sources**, **Energy Assets**, **History & Storage**, **Context**, **Forecast & Prediction**, and **Advanced / Diagnostics**. These tabs are architecture guidance only and are not implemented functionality.

## Consequences

- Historical collection, aggregation, persistence, quality, and temporal context have one explicit owner and a reusable platform for multiple consumers.
- The Information Interpreter owns external semantics; the History Service owns historical treatment of already interpreted information.
- Forecast providers remain future-looking integrations; the History Service supplies past observations, calibration evidence, and context.
- Prediction stays deterministic and storage-free, and it can operate when history is unavailable.
- Typed metrics prevent invalid aggregation, such as averaging cumulative energy counters.
- Repository availability and retention become observable operational concerns without making a storage implementation part of the adapter core.
- SQL, History Adapter, InfluxDB, and future repositories remain implementation options behind the same boundary.
- Functional implementation remains an open, likely multi-step workstream; accepting this architecture does not complete the History Service.
- Runtime integration, repository schemas, configuration fields, health states, context providers, profile calibration, and user-interface changes require separate approved implementation milestones.
