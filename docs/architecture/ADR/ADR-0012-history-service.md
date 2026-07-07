# ADR-0012: History Service

## Status

Accepted.

## Context

Analysis, prediction, evaluation, simulation, diagnostics, future visualization, and future optimization models need a shared foundation of normalized historical measurements and temporal context.

Raw live samples may have inconsistent timestamps, resolutions, retention, and metric semantics. The project therefore needs a single historical-data platform that can remain optional and can use existing ioBroker persistence infrastructure.

## Decision

Introduce a planned **History Service** as the central historical data platform and the external boundary for collecting, normalizing, retaining, and querying historical energy data.

Internally, the service separates these responsibilities:

- **History Collector** for live samples, timestamp normalization, validation, metric classification, and initial buckets.
- **History Aggregator** for deterministic, metric-specific aggregation.
- **History Repository** as persistence abstraction.

The preferred initial repository direction is existing ioBroker SQL infrastructure rather than an adapter-owned database.

## Consequences

- Historical collection, aggregation, persistence, quality, and temporal context have one explicit owner.
- Forecast providers remain future-looking integrations.
- Prediction can consume historical context but remains storage-free.
- Typed metrics prevent invalid aggregation semantics.
- Repository availability and retention become observable operational concerns.
- Runtime integration and concrete persistence details require separate implementation milestones.
