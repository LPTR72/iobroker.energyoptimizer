# ADR-0005: Prediction engine

## Status

Accepted

## Context

PV, consumption, and price series may have different timestamps or missing values. Later evaluation needs aligned intervals and explicit data-quality warnings.

## Decision

Use a pure `PredictionEngine` to combine `EnergyAnalysis` and `EnergyForecast` into `EnergyPrediction`. Delegate timestamp normalization and interval creation to `TimeSeriesMerger`, and use current analysis as a documented fallback.

## Consequences

Prediction behavior is deterministic and testable, incomplete data remains visible through warnings, and future evaluation can consume a stable model without provider-specific handling.
