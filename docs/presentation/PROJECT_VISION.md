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

# Project Vision

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

`ioBroker.energyoptimizer` aims to become a modular energy-intelligence and optimization platform for the whole home energy system.

The long-term goal is to help households understand, predict, simulate, and improve how energy is produced, stored, converted, and consumed while keeping the system transparent, deterministic, explainable, and safe.

The goal is not another automation rule. The goal is a digital understanding of the home's energy behavior: what information is available, why energy is needed, when flexibility exists, which boundaries apply, and which future actions would be useful and feasible.

![Optimization pipeline](assets/pipeline.svg)

> **Vision in one sentence**
>
> Build a safe and explainable energy optimizer that understands the home energy system before it recommends, plans, and eventually performs changes.

## Core idea

Home energy systems are becoming more complex. A household may combine grid interaction, renewable generation, electrical and thermal energy storage, electric vehicles and smart charging, heating systems, flexible loads, dynamic tariffs, weather forecasts, historical behavior, calendars, occupancy, and device-specific or regulatory constraints.

The optimizer should not depend on a fixed list of adapters or manufacturers. It should depend on interpretable information such as grid power, photovoltaic generation, battery state, weather, tariffs, target times, and limits.

```text
Technical source
  -> stable source binding or alias
  -> Information Interpreter
  -> vendor-neutral domain information
```

This allows hardware, providers, protocols, and adapter object IDs to change without redefining the energy model.

## Energy assets and decision context

Energy assets describe physical behavior: generation, consumption, conversion, storage, flexibility, and controllability.

Context information describes the conditions under which decisions are made. Weather, tariffs, calendars, occupancy, solar position, comfort limits, and grid restrictions may not represent energy flow themselves, but they can change which solution is best.

The optimizer therefore combines:

```text
Physical capabilities
  + current state
  + history
  + forecast
  + context
  + goals and constraints
  = explainable optimization decisions
```

The project is not limited to electricity flows only. It should also reason about flexibility across physical domains, such as storing surplus energy in a battery, shifting a flexible load, charging an electric vehicle, or increasing useful thermal storage.

## From data to knowledge

The project direction is not limited to reading live power values. Historical data should become reusable and explainable knowledge:

```text
Interpreted observations
  -> Historical context
  -> Pattern hypotheses
  -> Standard and calibrated profiles
  -> User-confirmed virtual assets
  -> Better prediction
  -> Better simulation
  -> Better recommendations
```

A generic standard profile may provide an initial expectation. Existing and future observations can calibrate that profile toward the real behavior of the concrete household asset.

In everyday terms, this means a home should eventually be able to recognize that some loads are flexible, that some surplus windows repeat, that some forecasts are reliable, and that some plans worked better than others.

![Pattern-based Virtual Energy Assets](assets/virtual-assets.svg)

## From rules to a closed optimization loop

A simple automation reacts once. An optimizer measures, evaluates, acts only within approved boundaries, and then checks the result again.

```text
Goal
  -> Current state
  -> Forecast
  -> Prediction
  -> Simulation
  -> Recommendation
  -> Planning
  -> Execution (later)
  -> Measurement
  -> Re-evaluation
```

When weather, tariffs, availability, comfort requirements, or grid restrictions change, the previous plan is not simply considered broken. The feasible solution space has changed, so the system should calculate and explain the best available response again.

## Guiding principles

- **Information-centered:** the optimizer requires semantic information, not a mandatory adapter or manufacturer.
- **Vendor-neutral:** energy assets are modeled by physical behavior, not by brand names.
- **Interpreter boundary:** external values are validated and translated into stable domain information at one explicit boundary.
- **Architecture-first:** domain logic is kept independent from ioBroker runtime APIs and integration details.
- **History-driven:** past observations and temporal context become reusable evidence for multiple consumers.
- **Forecast and prediction remain distinct:** external expectations and household-specific expected behavior are not treated as the same thing.
- **Hypothesis before knowledge:** detected patterns remain uncertain until confirmed by the user.
- **Read-only first:** analysis, diagnostics, simulation, and recommendations come before any later automation stage.
- **Explicit approval gates:** planning and execution require separate, deliberate implementation decisions.
- **Deterministic behavior:** calculations should be predictable, testable, and explainable.
- **Compatibility:** existing public states and legacy configuration fields remain stable unless a migration is explicitly approved.

## Long-term direction

The product direction remains:

```text
Understand -> Recommend -> Plan -> Automate
```

The architectural capabilities behind that story are:

```text
interpret -> observe -> forecast -> predict -> simulate -> recommend -> plan -> execute -> re-evaluate
```

The current project focuses on building this safely from the inside out: domain models and pure engines first, integration second, read-only runtime behavior before planning, and controlled execution last.

## Why this matters

A useful energy optimizer should not simply react whenever surplus power appears. It needs to understand timing, forecasts, expected asset behavior, battery state, thermal context, electric vehicle charging, tariffs, comfort constraints, recurring patterns, priorities, and safety boundaries.

It must also explain the distinction between what it measured, what it predicts, what the user wants, which constraints limit the solution, and why a recommendation or plan is preferred.

That is what makes the project more than a collection of calculations. It is designed to help a household understand its own energy behavior first, receive useful recommendations second, prepare feasible plans third, and only later permit safe and reviewable automation.

---

Next: read the [Key Concepts](KEY_CONCEPTS.md) to see the architecture ideas behind this vision.
