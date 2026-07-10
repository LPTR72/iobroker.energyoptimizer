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

# FAQ

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

This FAQ summarizes the most important questions about project scope, information requirements, current limitations, and long-term direction.

The central idea is simple:

> **Understand → Recommend → Plan → Automate**

## Why another energy optimizer?

Many energy automations start with immediate device switching. This project deliberately starts earlier: it first tries to understand the energy system behind the numbers.

That means working with interpreted measurements, history, forecasts, predictions, context, goals, constraints, simulation, and explainable recommendations before real-world actions are considered.

## Is this adapter already controlling devices?

No. The current runtime is read-only with respect to external devices and foreign ioBroker states.

It does not switch devices, schedule loads, or execute optimization actions.

Long term, the project may plan and control device behavior — but only after explicit user approval, clear safety rules, validation, manual override paths, and transparent explanations.

## Why is it read-only first?

Because a useful recommendation is not the same as a safe real-world action.

The project separates interpretation, analysis, prediction, simulation, recommendation, planning, and later execution into distinct responsibilities. This makes each step easier to review, validate, test, and explain.

## What is the long-term path of the project?

1. **Understand** interpreted energy data, household behavior, forecasts, context, goals, and constraints.
2. **Recommend** useful options without changing external device behavior.
3. **Plan** feasible actions safely and transparently.
4. **Automate** only after explicit approval, safety checks, measurement, and re-evaluation.

Automation is the final stage, not the starting point.

## Does the optimizer support adapters or information?

The core architecture supports **information types**, not a fixed list of adapter brands.

Examples include grid import, grid export, photovoltaic power, battery state of charge, tariffs, weather forecasts, calendars, occupancy, and grid restrictions.

Adapters, scripts, devices, and providers supply those values. They remain replaceable integration details.

## What is the Information Interpreter?

External values may use different names, units, sign conventions, timestamps, and quality indicators.

The Information Interpreter is the planned semantic system boundary that turns those technical values into validated, vendor-neutral domain information.

```text
Technical source
  -> alias or source binding
  -> Information Interpreter
  -> validated domain information
```

It interprets meaning. It does not store history, predict behavior, recommend actions, or control devices.

## What is the difference between an alias and the Interpreter?

An alias or source binding stabilizes **where** information comes from.

The Interpreter stabilizes **what the information means**.

A device may move from Zigbee to Matter while the alias remains stable. The Interpreter then continues to receive the same semantic information contract.

## Why vendor-neutral?

Home energy systems often combine multiple brands, protocols, and adapters.

The core models physical behavior and decision context instead of depending on one vendor API. This should make hardware and provider replacement easier and prevent integration details from becoming optimization rules.

## What is the difference between an Energy Asset and Context Information?

An **Energy Asset** has physical energy behavior, such as generation, consumption, conversion, storage, flexibility, or controllability.

Examples include photovoltaic systems, batteries, grid connections, electric vehicles, thermal storage, and flexible loads.

**Context Information** influences decisions without necessarily representing energy flow itself.

Examples include weather, tariffs, calendars, occupancy, solar position, comfort limits, and grid restrictions.

## What is the difference between History, Forecast, Prediction, and Simulation?

- **History** contains past observations and calibration evidence.
- **Forecast** describes externally expected future conditions.
- **Prediction** describes what is likely to happen in the concrete household system.
- **Simulation** evaluates what could happen under alternative decisions or parameter changes.

They cooperate, but they are not interchangeable.

## What is the History Service?

The History Service is the planned boundary for historical energy data.

For users, it can be thought of as the project's memory. It should collect already interpreted observations, aggregate them deterministically, retain quality information, and make historical series available to prediction, diagnostics, simulation, pattern recognition, and profile calibration.

The repository remains backend-neutral. SQL, the ioBroker History Adapter, InfluxDB, or future repositories may sit behind the same boundary.

## Does the History Service create forecasts?

No.

History provides past observations and calibration evidence. A forecast describes externally expected future conditions. History may help improve a household-specific prediction, but it does not become a forecast provider itself.

## What are standard and calibrated Asset Profiles?

A standard profile is an initial model of expected asset behavior, such as typical runtime, energy demand, power phases, and uncertainty.

Existing or newly collected history can calibrate that model toward the real behavior of a concrete asset.

This is explainable learning: the model improves through observable evidence without requiring an opaque black-box decision process.

## What are Pattern-based Virtual Energy Assets?

They are a planned knowledge concept.

A future Pattern Recognition Engine may detect recurring behavior from historical data. Detected patterns remain hypotheses with evidence and confidence.

Only after user confirmation may a hypothesis become a persistent Pattern-based Virtual Energy Asset that supports later prediction, simulation, recommendations, and planning.

## What is the difference between a KPI, goal, target value, and constraint?

- A **KPI** measures or predicts a system condition.
- A **goal** describes a desired outcome or optimization direction.
- A **target value** quantifies a desired state at a defined time or interval.
- A **constraint** limits the feasible solution space.
- A **priority** or preference helps resolve trade-offs.

For example, battery state of charge is a value. “At least 30% at sunset” may be a target value, a hard constraint, or a softer preference depending on how strictly the user defines it.

## Why not just use IF–THEN rules?

Simple rules are useful for simple cases, but they do not naturally compare changing forecasts, tariffs, battery state, comfort, device availability, and competing goals.

The long-term optimizer is designed as a loop:

```text
Goal
  -> current state
  -> forecast and prediction
  -> simulation
  -> recommendation
  -> planning
  -> later execution
  -> measurement
  -> re-evaluation
```

When conditions change, the solution space is recalculated instead of treating the old plan as a failed rule.

## Will it support dynamic tariffs and tariff changes?

Dynamic tariffs and price changes over time are planned through neutral tariff information and richer cost models.

The current runtime supports fixed-tariff import-cost calculation. Future models should distinguish import prices, export compensation, validity intervals, currency, energy units, and estimated costs such as battery wear or opportunity cost.

## What is the current Simulation Runtime?

The current Simulation Runtime is a narrow read-only integration.

It publishes diagnostics and recommendation output without controlling devices. Its purpose is to make recommendation behavior visible and testable while the live system remains safe.

## What is the planned Simulation Framework?

The planned Simulation Framework is a broader future capability for replay, controlled time, scenario libraries, benchmarks, demonstration mode, synthetic data, and regression testing.

It should reuse production domain components and evaluate complete parameter systems rather than isolated values.

## Is the project's own smart home required?

No.

The project's smart home is a reference system used to validate richer scenarios. It must not become a mandatory minimum configuration.

Future documentation should distinguish:

- minimum required information;
- recommended information;
- optional enhancements;
- the richer reference system.

A user may begin with only a small amount of valid information and improve the setup later.

## Can users rely on current state names?

Existing public states and legacy configuration fields are treated as compatibility contracts.

Changes require explicit migration decisions. This protects existing users while internal architecture and future information contracts evolve.

## Who is the project for?

The project is for ioBroker users and developers who want transparent, gradual, and safe home-energy optimization rather than opaque automation logic.

It is especially relevant for people who want to understand their energy flows first, receive explainable recommendations next, prepare feasible plans later, and only then consider controlled automation.

---

For the complete story, return to the [project overview](README.md) or revisit the [roadmap](ROADMAP.md) to see how the project moves from interpreted information toward safe future automation.