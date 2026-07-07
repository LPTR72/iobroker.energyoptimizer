# ADR-0013: Pattern-based Virtual Energy Assets

## Status

Accepted.

## Context

Long-running historical energy data may reveal recurring loads whose source is not explicitly modeled as a configured physical asset.

Detected regularity is evidence, not identity. The system must not silently convert an inferred pattern into persistent knowledge or treat uncertain disaggregation as fact.

## Decision

Introduce a future, generic **Pattern Recognition Engine** between the History Service and later predictive or optimization consumers.

It derives device-neutral load-pattern hypotheses from typed historical series and temporal context. It recognizes patterns rather than hardcoded device types.

An automatically detected pattern remains a hypothesis with evidence, confidence, time range, and relevant context. A hypothesis may be presented to the user for confirmation, rejection, or enrichment.

Only a confirmed hypothesis may become a **Pattern-based Virtual Energy Asset** in a future knowledge model.

## Conceptual flow

```text
History Service
  -> Pattern Recognition Engine
  -> Pattern-based Virtual Energy Assets / Knowledge Model
  -> Prediction Engine
  -> Cost Model / Battery Strategy
  -> Optimizer / Recommendation Engine
```

## Consequences

- Recognition remains generic, device-neutral, and grounded in historical evidence.
- The distinction between hypotheses and confirmed assets prevents uncertain patterns from becoming authoritative automatically.
- User enrichment combines inferred behavior with installation knowledge.
- Confirmed virtual assets can provide reusable knowledge to prediction, optimization, recommendation, simulation, diagnostics, and visualization components.
- Persistence, confidence thresholds, user interfaces, learning algorithms, runtime integration, and device behavior require separate milestones.
