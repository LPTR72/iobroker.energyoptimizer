# ADR-0015: Information Interpreter as the System Boundary

## Status

Accepted

## Context

The energy optimizer receives data from ioBroker states, aliases, adapters, providers, scripts, protocols, and future integrations. These sources use different object identifiers, units, sign conventions, value encodings, temporal semantics, and quality characteristics.

A vendor- or adapter-oriented core would couple optimization logic to individual integrations. A simple mapper or normalizer would also be insufficient because the boundary must interpret meaning, not only rename fields or convert units.

The project needs a stable system boundary that translates external information into explicit domain information while keeping adapters, manufacturers, protocols, and storage backends outside the domain model.

## Decision

Introduce the **Information Interpreter** as the semantic system boundary between external sources and the energy-optimization domain.

The optimizer supports **information types**, not specific adapters or manufacturers. External sources provide values; configuration and aliases bind those values to information types; the interpreter validates and transforms them into domain information.

The canonical flow is:

```text
External source state
    -> source binding / alias
    -> information type
    -> Information Interpreter
    -> validated domain information
```

### Responsibilities

The Information Interpreter owns:

- interpreting configured meaning;
- validating values and required metadata;
- normalizing physical units;
- interpreting configurable sign and direction semantics;
- applying explicit value transformations;
- assigning temporal semantics such as instantaneous value, interval value, counter, forecast validity, or target time;
- classifying quality, freshness, and availability;
- producing vendor-neutral domain information or a deterministic validation result.

It does not own:

- history persistence or aggregation;
- forecast acquisition;
- prediction logic;
- simulation;
- recommendation;
- planning;
- device execution.

### Information types

An information type is the stable semantic contract expected by the domain. Examples include:

- `Grid.ImportPower`;
- `Grid.ExportPower`;
- `Grid.Power` with configurable direction semantics;
- `PV.Power`;
- `Battery.StateOfCharge`;
- `Asset.Power`;
- `Tariff.ImportPrice`;
- `Forecast.CloudCover`;
- `Calendar.Occupancy`;
- `Grid.Constraint.PowerLimit`.

Each information type may define:

- physical quantity and canonical unit;
- value type;
- temporal semantics;
- cardinality;
- required or optional status;
- quality and freshness requirements;
- history recommendation or requirement;
- permitted fallbacks and derivations.

The complete information-type catalog is a separate evolving architecture artifact. This ADR establishes the concept and boundary, not the final catalog.

### Alias and source-binding role

Aliases are the preferred stable ioBroker-facing source binding. They decouple domain configuration from technical adapter object IDs and allow devices or providers to be replaced without changing the optimizer configuration.

Aliases do not replace the interpreter. Their responsibilities differ:

```text
Adapter or provider state
    -> alias or configured source binding
       stabilizes identity
    -> Information Interpreter
       stabilizes meaning
    -> domain information
```

Direct state bindings may remain technically possible, but the architecture and future documentation should recommend aliases where they provide a stable semantic interface.

### Energy assets and context information

Not every relevant input represents an energy-producing, consuming, or storing asset.

The domain distinguishes at least:

- **Energy Assets**: batteries, photovoltaic systems, grid connections, controllable loads, electric vehicles, thermal storage, and other entities with physical energy behavior;
- **Context Information**: weather, tariffs, calendars, occupancy, solar position, grid restrictions, and other conditions that influence decisions without themselves representing energy flow.

`Context Asset` remains a naming candidate. Stable implementation names must be resolved through the naming catalog before public contracts or domain classes are introduced.

### Processing topology

The architecture is not a single linear pipeline. Interpreted information can feed current state, history, forecast, and context paths in parallel.

```text
                           -> History -----------
External sources           -> Current State -----+-> Prediction
    -> Interpreter         -> Forecast ----------|
                           -> Context ------------
                                                   -> Simulation
                                                   -> Recommendation
                                                   -> Planning
                                                   -> Execution (future)
                                                   -> Measurement and re-evaluation
```

History supplies observations and calibration data. Forecast supplies external future expectations. Prediction describes expected behavior of the concrete system. Simulation evaluates alternatives. Recommendation explains useful actions. Planning describes a feasible course of action. Execution remains a later, separately approved boundary.

### Goals, targets, KPIs, and constraints

The interpreter may provide information used by these concepts but must not merge them.

- A **KPI** measures or predicts a system condition.
- A **Goal** describes a desired outcome or optimization direction.
- A **Target Value** quantifies a desired state at a defined time or interval.
- A **Constraint** limits the feasible solution space.
- A **Priority** resolves competing goals or preferences.

Future domain modeling must also distinguish hard constraints from soft constraints or preferences where violations can be evaluated rather than categorically rejected.

## Consequences

- Adapter and manufacturer support is reframed as availability of interpretable information types.
- Device or provider replacement does not affect the optimizer when the stable source binding and semantic contract remain unchanged.
- Unit, sign, direction, temporal, and quality semantics gain one explicit owner.
- History, forecast, prediction, simulation, recommendation, and planning receive validated domain information rather than raw ioBroker states.
- Configuration and future UI design need an information-type catalog and source-binding model.
- Public documentation should describe minimum and recommended information rather than mandatory adapters.
- The current runtime is not changed by accepting this ADR; implementation requires separate approved milestones.

## Follow-up work

- define the initial information-type catalog;
- resolve naming for context information versus context assets;
- model source bindings, transformations, direction semantics, and validation results;
- align History Service metric classification with interpreted information types;
- review existing architecture and presentation documents for adapter-oriented wording;
- define minimum, recommended, and reference-system information profiles;
- create implementation milestones only after the domain contracts are reviewed and accepted.
