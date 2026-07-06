# ADR-0007: Recommendation engine

## Status

Accepted

## Context

Evaluation produces neutral situations, but later planning needs ranked intent that reflects enabled goals without repeating power, battery, price, or forecast evaluation logic.

## Decision

Use a pure `RecommendationEngine` to transform `EnergySituation[]`, `OptimizationGoal[]`, and `OptimizationConstraint[]` into ranked `Recommendation[]`. Keep goal relevance explicit through validated `RecommendationOptions`. Map only known situation/goal pairs, derive priority deterministically from goal priority and situation severity, deduplicate equivalent recommendations, and use stable tie-breaking.

Apply only recommendation-level constraints: global or asset-specific manual overrides and time windows. Capability matching and power, energy, state-of-charge, and execution safety enforcement remain responsibilities of the dormant `ExecutionPlanner` defined by [ADR-0010](ADR-0010-neutral-execution-planner.md) and [ADR-0011](ADR-0011-execution-planning-semantics.md).

The engine does not interpret measurements or tariff values. In particular, it consumes price-period situations from evaluation and leaves the placeholder price thresholds unchanged.

## Consequences

Recommendations remain vendor-neutral, deterministic, and independently testable. Unknown or irrelevant situations produce no advice, input collections are not mutated, and no recommendation causes a side effect. The engine owns no polling or runtime infrastructure; [ADR-0009](ADR-0009-read-only-runtime-publication.md) invokes it through the read-only `SimulationRuntime` boundary.
