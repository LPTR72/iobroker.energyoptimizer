# ADR-0013: Pattern-based Virtual Energy Assets

## Status

Accepted

## Context

Long-running historical energy data may reveal recurring loads whose source is not explicitly modeled as a configured physical asset. Useful structures can be cyclic, scheduled, conditional, seasonal, daily, baseload, sequential, or anomalous. Hardcoding appliance or device types into recognition logic would couple the domain to assumptions that cannot be trusted from aggregate measurements alone.

Detected regularity is evidence, not identity. The system must not silently convert an inferred pattern into a persistent asset or treat uncertain disaggregation as fact.

## Decision

Introduce a future, generic **Pattern Recognition Engine** between the History Service and later predictive/optimization consumers. It derives device-neutral load-pattern hypotheses from typed historical series and temporal context. It recognizes patterns rather than hardcoded device types.

The initial pattern classes are:

- **Cyclic Pattern**;
- **Scheduled Pattern**;
- **Conditional Pattern**;
- **Seasonal Pattern**;
- **Daily Pattern**;
- **Baseload Pattern**;
- **Sequence Pattern**;
- **Anomaly Pattern**.

An automatically detected pattern remains a hypothesis with evidence, confidence, time range, and relevant context. A hypothesis may be presented to the user for confirmation, rejection, or enrichment. It must not become a persistent virtual asset without explicit user confirmation.

A confirmed hypothesis may become a **Pattern-based Virtual Energy Asset** in a future knowledge model. Users may enrich it with known information including:

- name;
- category;
- expected power;
- runtime;
- schedule;
- season;
- automation mode;
- conditions;
- priority;
- flexibility.

Conditions remain neutral and extensible. Examples include operation after dry days, temperature thresholds, tariff triggers, PV surplus, battery thresholds, or external ioBroker states. Recognition and knowledge models describe inferred behavior; they do not directly control a device.

The long-term conceptual flow is:

```text
Data Acquisition
  -> History Service
  -> Pattern Recognition Engine
  -> Pattern-based Virtual Energy Assets / Knowledge Model
  -> Prediction Engine
  -> Cost Model / Battery Strategy
  -> Optimizer / Recommendation Engine
```

Confirmed assets may improve prediction and optimization. For example, a likely future load can inform a battery strategy that preserves reserve when grid prices are expected to be higher later in the day. These consumers remain separately designed future components; this decision does not implement them or approve runtime control.

## Consequences

- Recognition remains generic, device-neutral, and grounded in historical evidence.
- The distinction between hypotheses and confirmed assets prevents uncertain patterns from becoming authoritative automatically.
- User enrichment combines inferred behavior with installation knowledge without hardcoding device categories into recognition.
- Confirmed virtual assets can provide reusable knowledge to prediction, cost, battery, optimization, recommendation, simulation, diagnostics, and visualization components.
- Pattern recognition depends on the future History Service workstream and is not the next implementation task unless explicitly selected.
- Persistence, confidence thresholds, user interfaces, learning algorithms, runtime integration, and control behavior require separate approved milestones.
