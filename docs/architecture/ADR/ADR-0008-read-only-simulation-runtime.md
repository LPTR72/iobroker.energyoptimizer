# ADR-0008: Read-only simulation runtime

## Status

Accepted

## Context

The neutral analysis, prediction, evaluation, and recommendation components need an orchestration boundary before they can safely publish results from real source states. Direct integration into active polling would combine domain validation with a public state-contract change.

## Decision

Initially introduce a dormant, read-only `SimulationRuntime` that uses `OptimizerInputFactory` and a cached source-state snapshot, then runs analysis, a one-interval current-state projection through `PredictionEngine`, evaluation, and recommendation.

The runtime reports source completeness and suppresses recommendations whenever a configured source lacks a valid numeric value. This ADR deliberately left it disconnected from `main.ts`, polling, `StateManager`, and ioBroker recommendation states until a separate publication decision.

## Consequences

The orchestration path is deterministic and testable with real `IStateProvider` implementations. [ADR-0009](ADR-0009-read-only-runtime-publication.md) subsequently defined the public recommendation state contract and activated this path after polling while retaining its read-only boundary.
