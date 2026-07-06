# ADR-0005: Prediction engine

## Status

Accepted

## Context

PV, consumption, and price series may have different timestamps or missing values. Later evaluation needs aligned intervals, explicit timing, and data-quality warnings. Runtime sampling frequency is not a suitable implicit prediction interval.

## Decision

Use a pure `PredictionEngine` to combine `EnergyAnalysis` and `EnergyForecast` into `EnergyPrediction`. `PredictionOptions` explicitly defines resolution and horizon, while current analysis remains a documented fallback for missing forecast values. Sampling resolution and future evaluation resolution remain separate concerns.

Future prediction may also consume immutable historical series and temporal context supplied by the History Service defined by [ADR-0012](ADR-0012-history-service.md). `PredictionEngine` must not collect, aggregate, persist, retain, or mutate historical data; historical learning remains optional when the service is unavailable.

## Consequences

Prediction behavior is deterministic and testable, incomplete data remains visible through warnings, and `EvaluationEngine` consumes a stable, resolution-aligned model without provider-specific or polling assumptions. Options require validation because invalid resolution or horizon values cannot produce a meaningful time series. See [ADR-0006](ADR-0006-evaluation-engine.md) for evaluation and [ADR-0009](ADR-0009-read-only-runtime-publication.md) for the active read-only orchestration path.
