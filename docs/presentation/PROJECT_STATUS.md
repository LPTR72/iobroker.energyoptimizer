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

# Project Status

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

The project is under active development.

The long-term goal is intelligent, explainable energy optimization across the whole home energy system, including optional device control in later stages. The current runtime intentionally stops before automation: it reads configured ioBroker states, mirrors live energy values, calculates fixed-tariff import costs, publishes diagnostics, and exposes read-only recommendation data.

![Project timeline](assets/timeline.svg)

> **Current status**
>
> The project already demonstrates a safe read-only path from live values through analysis, prediction, evaluation, and recommendation. The initial History Service domain foundation is implemented, and the current architecture work is aligning the broader information-centered domain model before further runtime integration.

## What already works today

The current prototype can observe and reason about a home energy system without controlling real devices.

It can:

- collect live energy values from configured ioBroker states;
- mirror relevant values into adapter-owned states;
- calculate fixed-tariff import costs;
- model generic energy assets in a vendor-neutral way;
- normalize legacy configuration into a consistent energy-system view;
- analyze current energy situations;
- use forecast and prediction foundations;
- evaluate optimization opportunities;
- generate structured, read-only recommendations;
- simulate recommendation output without switching devices;
- represent typed historical metrics, samples, buckets, quality metadata, collection, and aggregation in the domain foundation.

This means the optimizer core is already more than a monitor. It contains deterministic foundations for moving from measurement to analysis, prediction, evaluation, recommendation, and later planning.

## Current safety boundary

The adapter remains read-only with respect to external devices and foreign states.

It does not yet:

- switch devices;
- create runtime schedules;
- execute optimization plans;
- write to foreign ioBroker states;
- integrate execution providers;
- call external forecast, tariff, weather, calendar, or context providers from the public runtime;
- run the planned Information Interpreter as a complete runtime boundary;
- collect SQL, History Adapter, or InfluxDB history data in the runtime;
- perform runtime pattern recognition or profile calibration;
- operate as a closed-loop automation system.

This is intentional. The project is designed to interpret, understand, explain, simulate, and validate optimization behavior before any later stage is allowed to affect real devices.

## Current architecture focus

The architecture now treats external data as technical input that must be translated into stable semantic information.

```text
Technical source
  -> alias or source binding
  -> Information Interpreter
  -> validated domain information
```

The optimizer is therefore moving away from the question “Which adapter is supported?” toward the question “Which information type is available, and can it be interpreted reliably?”

Current architecture work includes:

- the Information Interpreter boundary;
- an initial information-type catalog;
- Energy Assets and Context Information;
- History Service backend independence;
- Standard Profiles and explainable calibration;
- KPI, Goal, Target Value, Constraint, Preference, and Priority semantics;
- the relationship between analysis, evaluation, simulation, recommendation, and planning;
- future measurement and re-evaluation after approved actions.

These topics describe intended architecture. They are not all implemented runtime features.

## Maturity overview

| Capability | Status |
| --- | --- |
| Live energy monitoring | Implemented |
| Adapter-owned state mirroring | Implemented |
| Fixed-tariff cost calculation | Implemented |
| Vendor-neutral Energy Asset model | Implemented and evolving |
| Analysis, prediction, evaluation, recommendation | Implemented foundations |
| Read-only Simulation Runtime | Implemented |
| Initial History Service domain foundation | Implemented |
| Information Interpreter | Accepted architecture; runtime implementation planned |
| Information-type catalog | Next architecture artifact |
| Context Information model | Accepted direction; broader modeling planned |
| Standard Profiles and calibration | Planned architecture |
| Pattern-based Virtual Energy Assets | Planned architecture concept |
| SQL / History Adapter / InfluxDB repository integration | Planned |
| Runtime pattern recognition | Planned |
| Goal Tasks and flexible planning requests | Working architecture concept |
| Planning and scheduling | Dormant foundations and future milestones |
| Device control and automation | Future milestone; approval-gated |
| Measurement and closed-loop re-evaluation | Future architecture boundary |

## Path toward automation

The project is not intended to remain a passive analysis tool forever.

The product story remains:

```text
Understand -> Recommend -> Plan -> Automate
```

The cooperating architecture capabilities behind that story are broader than one rigid linear pipeline:

```text
interpret -> observe -> analyze -> forecast -> predict
          -> evaluate and simulate
          -> recommend -> plan -> execute -> re-evaluate
```

Only the earlier read-only stages are active today. Later stages such as planning, scheduling, execution, measurement, and re-evaluation require separate design decisions, explicit approval gates, and runtime validation before they become part of the public adapter behavior.

The goal is not quick automation. The goal is trustworthy automation: a system that can explain what information it used, what it measured, what it predicted, which goals and constraints applied, why an option was selected, and what happened after an approved action.

## Project quality

The project follows an architecture-first development style. Core domain logic is designed to be deterministic, testable, and independent from vendor APIs, storage backends, or ioBroker runtime details. Public runtime behavior is introduced in stages so new capabilities can be inspected before they affect real devices.

---

Next: read the [Features](FEATURES.md) to see which capabilities these foundations already provide and which future use cases they support.