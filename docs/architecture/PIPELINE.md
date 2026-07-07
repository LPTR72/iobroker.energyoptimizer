# Pipeline

The long-term optimization pipeline is:

```text
measure -> analyze -> forecast -> predict -> evaluate -> recommend -> plan -> execute
```

## Current runtime boundary

The current runtime reads configured ioBroker source states, mirrors adapter-owned live values, calculates fixed-tariff import costs, publishes diagnostics, and exposes read-only recommendation output.

It does not execute actions, schedule loads, or write to foreign adapter states.

## Foundation order

The project builds the pipeline from the inside out:

1. neutral domain models
2. pure deterministic engines
3. read-only runtime projection
4. historical context
5. pattern-based knowledge
6. planning semantics
7. separately approved device behavior

## Why this order matters

Energy optimization should be explainable. Recommendations should be traceable to current measurements, forecasts, historical context, constraints, and priorities before any later real-world behavior is considered.
