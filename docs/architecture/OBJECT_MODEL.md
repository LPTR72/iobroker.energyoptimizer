# Object Model

Stand: 07.07.2026 13:00 Uhr

## Purpose

This document defines the adapter-owned ioBroker object namespace, publication boundaries, and naming rules for current and future states. It is an architecture boundary document, not an implementation record for every future state.

The object model must remain stable, vendor-neutral, read-only by default, and compatible with the current `energyoptimizer.0.*` runtime namespace.

## Object namespace ownership

The adapter owns only states below:

```text
energyoptimizer.0.*
```

Until a separately approved execution layer exists, the adapter must not write foreign states, device states, provider states, or vendor-adapter states. External ioBroker states may be read as configured sources only.

All public adapter state IDs are compatibility contracts. Renames, removals, semantic changes, or unit changes require explicit approval and migration planning.

## Current implemented state tree

The following tree describes the currently implemented public object structure. It is derived from the current central state definitions and must remain compatible unless a later milestone explicitly approves a change.

```text
energyoptimizer.0
├── config
│   └── currentTariff
│       ├── workPriceCt
│       └── basePriceMonthlyEuro
├── costs
│   ├── today
│   │   └── currentTariffEuro
│   └── month
│       └── currentTariffEuro
├── health
│   ├── configuredSources
│   ├── validSources
│   ├── missingSources
│   ├── lastPollingTimestamp
│   ├── lastPollingDurationMs
│   └── assets
│       ├── count
│       ├── grid
│       │   └── count
│       ├── pv
│       │   └── count
│       ├── battery
│       │   └── count
│       └── consumer
│           └── count
├── info
│   └── connection
├── live
│   ├── grid
│   │   ├── importPower
│   │   └── exportPower
│   ├── house
│   │   └── consumptionPower
│   ├── pv
│   │   └── power
│   └── battery
│       ├── soc
│       └── power
├── optimizer
│   └── recommendation
├── recommendation
│   ├── available
│   ├── count
│   └── best
│       ├── type
│       ├── priority
│       ├── reason
│       ├── validFrom
│       └── validTo
└── simulation
    ├── ready
    └── publication
        └── json
```

## Current namespace semantics

### `config.*`

Adapter-owned mirror of normalized effective configuration values that are useful for diagnostics. These states must not become a second configuration source. Runtime configuration remains the adapter configuration.

### `live.*`

Read-only mirror of configured external measurement sources. The adapter may publish normalized source values here, but must not write back to the original source states.

The current live model is intentionally physical and vendor-neutral: grid, house, PV, and battery values are represented by power and state-of-charge semantics rather than vendor-specific names.

### `costs.*`

Read-only accumulated cost diagnostics for the current fixed-tariff implementation. Reset behavior and future tariff allocation rules require separate approval before structural changes are made.

### `health.*`

Operational health and source-observability states. These states are suitable for simple checks, alerts, and milestone validation. New runtime capabilities should expose only compact health indicators here; detailed diagnostics belong in feature-specific diagnostic JSON states.

### `optimizer.*`

Legacy/simple optimizer-facing publication surface. `optimizer.recommendation` remains a compatibility state for simple consumers. New structured output should prefer dedicated namespaced states or JSON publication states rather than overloading this text state.

### `recommendation.*`

Structured read-only recommendation summary for simple consumers. It exposes availability, count, and the best recommendation's compact attributes. Complete diagnostic detail remains in `simulation.publication.json` until a future optimizer publication model is approved.

### `simulation.*`

Current read-only simulation-runtime publication. This namespace belongs to the narrow implemented runtime simulation path and must not be confused with the future first-class Simulation Framework. Future Simulation Framework states require separate scope selection and approval.

### `info.*`

Adapter lifecycle information. `info.connection` remains the adapter connection indicator.

## Reserved future namespaces

The following namespaces are reserved for future architecture work. They must not be populated by implementation milestones unless that milestone explicitly approves the namespace, state IDs, semantics, validation, and migration impact.

```text
energyoptimizer.0.history.*
energyoptimizer.0.prediction.*
energyoptimizer.0.forecast.*
energyoptimizer.0.tariff.*
energyoptimizer.0.assets.*
energyoptimizer.0.diagnostics.*
energyoptimizer.0.patterns.*
energyoptimizer.0.execution.*
```

Reserved namespaces are not implementation permission. They are naming boundaries to prevent accidental or conflicting object layouts.

## History Service object boundaries

The History Service is a planned multi-step epic. Its first domain-foundation milestone should not create ioBroker states.

Future History Service runtime states, when approved, should follow these boundaries:

- `history.*` is for History Service availability, compact status, and high-level diagnostics only.
- Historical data buckets should not be stored as normal ioBroker states.
- The preferred initial persistence boundary remains the existing ioBroker SQL Adapter through an implementation-neutral repository abstraction.
- The energy optimizer adapter must not create, own, migrate, or administer an adapter-specific database.
- Missing SQL/history backend configuration must keep the adapter runtime operational and expose a warning or disabled status.
- History collection, aggregation, retention, quality, context, repository integration, and consumer integration remain separate approval points.

Potential future compact states may include availability, backend status, last successful collection, last aggregation, retained resolution status, or warning count. Exact names are intentionally not fixed here and must be selected by the approved History Service runtime milestone.

## JSON publication boundaries

JSON states may be used for complete diagnostic snapshots when a scalar state model would be unstable or too verbose.

Rules:

- JSON states must always contain valid JSON.
- JSON states must include explicit status and warnings when data is incomplete.
- JSON states must not invent recommendations, history, forecasts, or diagnostics from missing sources.
- JSON shape changes require tests and documentation when consumers may rely on them.
- Compact scalar states may mirror selected JSON fields for simple VIS, script, or alert consumers.

## Read/write policy

Default policy for adapter states:

- `read: true`
- `write: false`
- `ack: true` when publishing runtime values

Writable adapter states require explicit architecture approval. Foreign-state writes are forbidden until a separately approved execution layer exists.

## Naming rules

Use stable, physical, vendor-neutral names:

- Prefer `grid`, `house`, `pv`, `battery`, `consumer`, `tariff`, `history`, `forecast`, and `recommendation` over vendor names.
- Prefer units and physical semantics in the leaf name, for example `importPower`, `consumptionPower`, `soc`, `validFrom`.
- Do not encode vendor names, adapter names, instance numbers, rooms, or user-specific device names in public state IDs.
- Keep public state IDs lowercase camelCase after each namespace segment.
- Use `*.json` only for valid JSON publication states.

## Validation requirements

Every milestone that changes object definitions, state creation, publication behavior, or runtime output must validate:

1. Object exists.
2. State exists.
3. Initial value is correct.
4. Runtime update is correct.
5. Object structure before/after installation is compared and every difference is explained.
6. No foreign state is written during the read-only phase.
7. Logs contain no new errors or unexpected warnings.

Documentation-only object-model changes do not require ioBroker runtime validation, but implementation milestones that apply them do.

## Compatibility and migration

Existing public states should be treated as stable. If a future milestone needs to change the object model, it must document:

- old state ID;
- new state ID;
- reason for the change;
- migration or compatibility behavior;
- expected object-structure diff;
- validation commands and expected results;
- impact on scripts, VIS, and external consumers.

## Non-goals

This document does not approve:

- SQL implementation;
- history collection runtime integration;
- new ioBroker states for History Service;
- device control;
- scheduling;
- execution providers;
- pattern recognition;
- first-class Simulation Framework implementation;
- UI changes.

Each of these topics requires a separate approved milestone.