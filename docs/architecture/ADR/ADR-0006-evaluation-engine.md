# ADR-0006: Evaluation engine

## Status

Accepted

## Context

Analysis and prediction provide neutral facts and time series, but later recommendation logic needs explicit situations rather than duplicating thresholds and data-quality interpretation.

## Decision

Use a pure `EvaluationEngine` to transform `EnergyAnalysis` and `EnergyPrediction` into readonly `EnergySituation` values. Keep thresholds explicit through validated `EvaluationOptions`. `minimumRelevantPowerW` describes the smallest power value meaningful for situation detection; its neutral default is 20 W to suppress tiny measurement noise while retaining relevant flows from small energy systems. Evaluate observed power flow and battery state separately from predicted surplus, battery state, price periods, and forecast uncertainty.

The default cheap and high price thresholds are placeholder/demo values only. They are not recommended tariff values or physical constants; deployments must deliberately choose thresholds suitable for their region, tariff, and time period when price situations are used.

The engine has no ioBroker imports, I/O, polling, recommendation logic, or side effects. The active adapter invokes it only through the read-only orchestration boundary defined by [ADR-0009](ADR-0009-read-only-runtime-publication.md); lifecycle and infrastructure remain outside the engine.

## Consequences

Situation detection is deterministic and independently testable. Threshold choices are visible and configurable, unavailable batteries do not create false low-state situations, and prediction warnings remain visible as forecast uncertainty. `RecommendationEngine` consumes situations without knowing how they were detected.
