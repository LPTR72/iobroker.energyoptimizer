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

# Roadmap

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

The goal of ioBroker Energy Optimizer is not to jump directly from measurements to automation.

A trustworthy home energy system develops step by step: first it interprets and understands available information, then it explains useful recommendations, then it prepares feasible plans, and only later — with explicit approval and safety boundaries — may it control devices.

That is the guiding path of the roadmap:

> **Understand → Recommend → Plan → Automate**

![Project timeline](assets/timeline.svg)

> **Roadmap rule**
>
> Planned direction does not imply current runtime behavior. Information interpretation, history integration, prediction, simulation, planning, and device behavior are split into explicit milestones so that each step can be reviewed, validated, and kept safe.

## 1. Foundations already completed

The project has established the technical and domain foundations needed before more advanced optimization can happen.

These foundations include:

- an ioBroker adapter lifecycle with safe polling;
- live value mirroring;
- fixed-tariff import-cost calculation;
- generic energy assets and normalized configuration;
- deterministic analysis, forecast, prediction, evaluation, and recommendation foundations;
- read-only simulation runtime integration;
- structured read-only recommendation output;
- dormant planning semantics with no runtime execution.

In practical terms, the project can already represent energy sources and consumers in a structured way and produce safe recommendation-oriented output without controlling devices.

## 2. Current architecture focus: information and domain foundations

The next architecture layer is about making the meaning of incoming data explicit.

Different adapters, providers, scripts, and devices may expose the same physical information using different state names, units, sign conventions, timestamps, and quality indicators. The planned **Information Interpreter** becomes the semantic boundary that translates those technical values into stable domain information.

```text
Technical source
  -> alias or source binding
  -> Information Interpreter
  -> validated domain information
```

This changes the integration question from:

> Which adapter is supported?

into:

> Which information type is available, and can it be interpreted reliably?

Planned architecture work includes:

- an initial information-type catalog;
- stable source-binding and alias guidance;
- unit, sign, direction, time, and quality semantics;
- clear separation between Energy Assets and Context Information;
- minimum, recommended, and reference-system information profiles.

## 3. History Service foundation and integration

The History Service turns isolated observations into reusable memory.

![History Service](assets/history.svg)

For non-developers, this helps answer questions such as:

- When does a load usually consume energy?
- How reliable was a forecast compared with reality?
- Which household patterns repeat over time?
- Which recommendations or plans worked well in the past?

The History Service remains backend-neutral. Existing ioBroker SQL infrastructure may provide an initial repository implementation, but SQL, History Adapter, InfluxDB, or future repositories must remain replaceable behind the same architecture boundary.

Planned areas include:

### Historical data model

- typed historical metrics;
- sample and bucket models;
- deterministic aggregation;
- quality and coverage metadata;
- explicit source, calculation, and output resolutions;
- configurable retention policies.

### Storage and access

- repository abstraction;
- bootstrap from existing history;
- clean boundaries between persistence and consumers;
- observable repository availability and data quality.

### Future consumers

- prediction and calibration;
- diagnostics and visualization;
- pattern recognition;
- simulation and replay;
- later optimization and validation.

History stores evidence. It does not itself identify devices, create forecasts, or decide which action should be taken.

## 4. Forecast, context, and provider integrations

Future integrations add externally available expectations and decision context.

Possible information areas include:

- photovoltaic and consumption forecasts;
- tariffs and price validity periods;
- weather and solar position;
- calendars, occupancy, and presence;
- grid restrictions and regulatory limits;
- device capabilities and availability.

Providers remain integration details. The core consumes neutral information contracts, not provider-specific data structures.

Forecast and prediction remain separate:

- **Forecast** describes externally expected future conditions.
- **Prediction** describes what is likely to happen in the concrete household system.

History, calibrated profiles, current state, and context may improve prediction without becoming forecast providers themselves.

## 5. Asset profiles and explainable learning

A future asset may begin with a generic standard profile or with a profile derived from existing history.

```text
Standard profile
  -> observations
  -> calibration
  -> asset-specific profile
  -> continuous improvement
```

This supports an explainable form of learning:

- first predictions can be made before extensive local history exists;
- existing smart-plug or history data can improve the initial model;
- later observations can refine duration, energy demand, phases, flexibility, and uncertainty;
- the reasoning remains inspectable instead of becoming a black-box decision.

## 6. Pattern knowledge and virtual assets

A future Pattern Recognition Engine may use historical data to detect recurring household behavior.

Examples include typical load sequences, recurring consumption peaks, regular solar-surplus windows, seasonal behavior, or anomalies.

Detected patterns remain hypotheses with evidence and confidence. Only user-confirmed hypotheses may become Pattern-based Virtual Energy Assets that enrich later prediction, simulation, and optimization.

## 7. Simulation and goal-oriented optimization

A future first-class Simulation Framework should evaluate complete parameter systems rather than isolated values.

![Simulation](assets/simulation.svg)

Possible capabilities include:

- replaying historical situations;
- accelerated and controlled time;
- scenario libraries;
- benchmark scenarios;
- demonstration mode;
- synthetic data generation;
- regression testing;
- comparing alternative plans and strategies.

The decision model must keep these concepts separate:

- KPIs describe measured or predicted conditions;
- goals describe desired outcomes or optimization directions;
- target values quantify desired states;
- constraints limit the feasible solution space;
- priorities and preferences help resolve trade-offs.

## 8. Planning and controlled device behavior

The long-term vision includes more than understanding energy flows.

The project should eventually help plan desired outcomes such as:

- a washing machine finished by a target time;
- an electric vehicle charged before departure;
- useful thermal storage increased without violating comfort limits;
- a battery reserve preserved for a later period;
- flexible consumption shifted toward solar surplus or lower prices.

The user should describe the desired result and relevant boundaries. The optimizer should determine a feasible path rather than merely applying fixed switching rules.

Before real device behavior can be enabled, the system needs:

- reliable and explainable recommendations;
- clear target, planning, and timing semantics;
- hard and soft constraint handling;
- capability and conflict validation;
- user approval and manual override rules;
- runtime safety controls;
- transparent explanations of what will happen and why;
- measurement and re-evaluation after an action.

The current runtime stops at read-only recommendation output. Future automation remains separately approved, safety-gated, and under explicit user control.

## Roadmap summary

The roadmap deliberately moves from information to trusted action:

1. **Understand** interpreted energy data, context, history, and household behavior.
2. **Recommend** useful options and explain their expected effects.
3. **Plan** feasible actions against goals, target values, constraints, priorities, and capabilities.
4. **Automate** only after explicit approval, safety checks, measurement, and re-evaluation.

This makes ioBroker Energy Optimizer a long-term project for trustworthy home energy intelligence — not just a collection of calculations or adapter-specific automation rules.

---

Next: read the [FAQ](FAQ.md) for concise answers to common questions about information requirements, current limitations, and long-term direction.