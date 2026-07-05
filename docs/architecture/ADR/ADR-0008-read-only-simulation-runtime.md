# ADR-0008: Read-only simulation runtime

## Status

Accepted

## Context

The neutral analysis, prediction, evaluation, and recommendation components need an orchestration boundary before they can safely publish results from real source states. Direct integration into active polling would combine domain validation with a public state-contract change.

## Decision

Introduce a dormant, read-only `SimulationRuntime` that uses `OptimizerInputFactory` and a cached source-state snapshot, then runs analysis, a one-interval current-state projection through `PredictionEngine`, evaluation, and recommendation.

The runtime reports source completeness and suppresses recommendations whenever a configured source lacks a valid numeric value. It returns explainable results to its caller but is not connected to `main.ts`, polling, `StateManager`, or ioBroker recommendation states yet.

## Consequences

The orchestration path is deterministic and testable with real `IStateProvider` implementations while existing adapter behavior remains unchanged. A separate reviewed milestone must define the public recommendation state contract and read-only publication lifecycle before activation.
