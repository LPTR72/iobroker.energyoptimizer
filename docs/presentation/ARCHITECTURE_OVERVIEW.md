<p align="center">
  <img src="../images/Logo_Large.png" alt="ioBroker Energy Optimizer" width="260">
</p>

<p align="center">
  <strong>ioBroker Energy Optimizer</strong><br>
  Public project presentation 2.1
</p>

<p align="center">
  <a href="README.md">Home</a> ·
  <a href="PROJECT_VISION.md">Vision</a> ·
  <a href="KEY_CONCEPTS.md">Key Concepts</a> ·
  <a href="PROJECT_STATUS.md">Status</a> ·
  <a href="FEATURES.md">Features</a> ·
  <a href="USE_CASES.md">Use Cases</a> ·
  <a href="ARCHITECTURE_OVERVIEW.md">Architecture</a> ·
  <a href="ROADMAP.md">Roadmap</a> ·
  <a href="FAQ.md">FAQ</a>
</p>

---

# Architecture Overview

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

`ioBroker.energyoptimizer` follows a Clean Architecture style and an information-centered integration model.

In practical terms, this means the project keeps the household energy model separate from device brands, APIs, cloud services, adapter object IDs, and storage backends. The optimizer reasons about energy behavior and context first and connects to concrete systems only through explicit boundaries.

![Architecture overview](assets/architecture.svg)

> **Architecture principle**
>
> The core models the physical energy system and its decision context. ioBroker, vendors, protocols, adapters, providers, and cloud APIs remain integration concerns.

## Why this matters

A home energy optimizer may eventually need to compare many different situations: a battery that should not be drained too early, a washer that could run later, an electric vehicle that should charge when prices are lower, or a heat pump that can use thermal storage without reducing comfort.

Those decisions should not be hardcoded around one vendor, adapter, or device API. They need stable domain information that can survive changing hardware, integrations, data sources, and household routines.

## Information-centered boundary

The optimizer supports information types rather than a fixed list of adapters.

```text
Adapters / providers / devices / scripts
                  |
                  v
         alias or source binding
                  |
                  v
       Information Interpreter
                  |
                  v
       validated domain information
```

Aliases or configured source bindings stabilize identity. The Information Interpreter stabilizes meaning by validating values, normalizing units, interpreting sign and direction conventions, assigning temporal semantics, and classifying quality and freshness.

A provider change should therefore not affect the optimizer as long as the stable binding continues to provide the same information contract.

## Processing model

The architecture is not a single rigid pipeline. Interpreted information can enter several cooperating paths:

```text
                           -> Current State ----
External information      -> History ----------+-> Prediction
    -> Interpreter         -> Forecast ---------|
                           -> Context -----------
                                                  -> Simulation
                                                  -> Recommendation
                                                  -> Planning
                                                  -> Execution (future)
                                                  -> Measurement
                                                  -> Re-evaluation
```

- **History** supplies past observations and calibration evidence.
- **Forecast** supplies externally expected future conditions.
- **Prediction** describes likely behavior of the concrete household system.
- **Simulation** evaluates alternative decisions and parameter systems.
- **Recommendation** explains useful options.
- **Planning** describes a feasible course of action.
- **Execution** remains a later, separately approved boundary.

## Domain core

The domain core contains models and pure calculations for:

- energy assets;
- context information;
- information types and validated domain values;
- energy-system state;
- analysis;
- forecasts and predictions;
- goals, target values, priorities, and constraints;
- optimization situations;
- simulation and evaluation;
- recommendations;
- planning models;
- historical metrics and aggregation concepts;
- asset profiles and future calibrated behavior models.

Domain components should be portable, testable, and independent from ioBroker object IDs or adapter lifecycle APIs.

## Energy assets and context

Energy assets represent physical energy behavior: photovoltaic systems, batteries, grid connections, controllable loads, electric vehicles, heat pumps, thermal storage, and similar entities.

Context information affects optimization without itself representing an energy flow. Examples include weather, tariffs, calendars, occupancy, solar position, and grid restrictions.

This distinction allows the optimizer to combine what the system can physically do with the conditions under which a decision should be made.

## Runtime boundary

The ioBroker adapter runtime is responsible for adapter lifecycle, configuration access, source-state polling, adapter-owned public states, diagnostics, and approved read-only orchestration.

It must not leak vendor-specific details or raw foreign state semantics into the domain model.

## Provider boundaries

Future providers may supply forecasts, tariffs, weather data, historical data, calendar context, grid constraints, or device capabilities.

Examples include photovoltaic forecast services, tariff APIs, weather sources, SQL or History backends, device adapters, protocol integrations, and user-created script states.

The core sees these through neutral information contracts rather than provider-specific data structures.

## History Service boundary

The planned History Service is the central boundary for past observations and temporal context after information has been interpreted into stable metric semantics.

Its responsibilities include typed metrics, samples, buckets, aggregation, quality metadata, retention policy, and repository abstraction. The repository remains backend-neutral; existing ioBroker persistence infrastructure can provide an initial implementation without becoming part of the domain contract.

History does not create forecasts. It supplies observations that can calibrate predictions, detect patterns, support diagnostics, and improve simulations.

## Goals, KPIs, and constraints

The optimization model keeps these concepts separate:

- a **KPI** measures or predicts a condition;
- a **goal** describes a desired outcome or optimization direction;
- a **target value** quantifies the desired state at a time or over an interval;
- a **constraint** limits the feasible solution space;
- a **priority** resolves competing goals or preferences.

This distinction is important for explainable recommendations. The system should be able to state what it measured, what the user wanted, which boundaries applied, and why a proposed plan was selected.

## Action boundary

Recommendations, planning, and real-world execution are intentionally separated.

A recommendation may say what could be useful. A future plan may describe what could be done and when. Execution would apply approved actions through explicit device capabilities and safety checks.

This separation is a safety boundary. The current runtime does not control devices, but long-term automation remains an explicit project goal.

## Public object model

The adapter owns its own public ioBroker state namespace. Adapter-owned states may expose live values, costs, health, simulation diagnostics, recommendation summaries, and future planning information.

Writes to foreign adapter states are not part of the current runtime behavior and require a separate approved milestone.

---

Next: read the [Roadmap](ROADMAP.md) to see how the architecture is planned to grow from read-only recommendations toward safe future planning and automation.
