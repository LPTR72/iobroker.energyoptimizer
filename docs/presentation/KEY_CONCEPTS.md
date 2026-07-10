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

# Key Concepts

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

`ioBroker.energyoptimizer` is designed to help a home energy system become understandable before it becomes automated.

Instead of reacting to single live values, the project builds a gradual understanding of energy assets, historical behavior, forecasts, predictions, costs, priorities, context, and safety boundaries. This makes future recommendations easier to inspect, explain, and improve over time.

The key idea is simple: good optimization should know why a recommendation makes sense before it suggests what to do.

## From automation rules to an optimization loop

Many home-energy automations are built around direct rules: if there is surplus power, switch something on. That may work for simple cases, but it does not scale well when a household combines batteries, flexible loads, electric vehicles, heating systems, tariffs, forecasts, comfort limits, and grid restrictions.

This project takes a different path:

```text
Goal
  -> Current state
  -> Forecast and prediction
  -> Simulation
  -> Recommendation
  -> Planning
  -> Measurement
  -> Re-evaluation
```

The optimizer does not treat a changed condition as a broken rule. It treats it as a changed solution space and searches for the best feasible response again.

## Information instead of adapter support

The optimizer is not designed around a fixed list of adapters, manufacturers, protocols, or cloud services. It is designed around the information needed for energy decisions.

Examples include:

- grid import and export;
- photovoltaic generation;
- battery state of charge;
- asset power and energy;
- weather and solar forecasts;
- tariffs;
- calendars and occupancy;
- grid and comfort constraints.

Adapters and providers supply this information. They are replaceable integration details rather than part of the energy model.

## The Information Interpreter

External values can use different names, units, sign conventions, timestamps, and quality indicators. The **Information Interpreter** forms the semantic boundary between those technical sources and the domain model.

```text
Adapter or provider state
  -> alias or configured source binding
  -> Information Interpreter
  -> validated domain information
```

Aliases stabilize identity: a device or provider can be replaced while the optimizer keeps the same source binding. The interpreter stabilizes meaning: it validates values, normalizes units, interprets direction and sign conventions, and creates vendor-neutral information for the domain.

## Energy assets and context

Energy assets represent physical energy behavior. Examples include photovoltaic systems, batteries, grid connections, electric vehicles, heat pumps, thermal storage, and flexible household loads.

Other information influences decisions without itself producing, consuming, or storing energy. Weather, tariffs, calendars, occupancy, solar position, and grid restrictions are examples of **context information**.

Both are important. A battery model may describe what the system can do, while context describes when and under which conditions it may be useful.

## Read-only before control

The project intentionally starts with observation, diagnostics, simulation, and recommendations before any later automation stage.

This is important because an optimizer should not silently change device behavior before its reasoning can be reviewed. Read-only results create a safe foundation: the system can explain what it sees, what it predicts, and why a recommendation may be useful.

Long term, the project is intended to progress from understanding to recommendations, planning, and finally controlled device action. Each transition requires its own safety boundaries and approved implementation milestone.

## History as reusable knowledge

Live power values are useful, but they are only a snapshot. Historical data can reveal recurring behavior, timing patterns, seasonal effects, and typical household routines.

Over time, this historical context can support better prediction, diagnostics, simulation, and optimization. The goal is not just to store data, but to turn repeated observations into reusable and explainable knowledge.

History and forecast have different roles:

- **History** contains past observations and calibration evidence.
- **Forecast** describes externally expected future conditions.
- **Prediction** describes what is likely to happen in the concrete household system.
- **Simulation** evaluates what could happen under alternative decisions.

## Pattern-based Virtual Energy Assets

A future Pattern Recognition Engine may detect recurring load behavior from historical data. Detected patterns remain hypotheses with evidence and confidence. They do not become persistent knowledge automatically.

Only after user confirmation can a hypothesis become a Pattern-based Virtual Energy Asset.

```text
History Service
  -> Pattern Recognition
  -> User confirmation
  -> Pattern-based Virtual Energy Asset
  -> Prediction
  -> Simulation
  -> Recommendation
```

A generic standard profile may provide an initial expectation. Historical observations can then calibrate that profile toward the actual behavior of the concrete asset. This creates explainable learning without requiring a black-box model.

## KPIs, goals, and constraints

These concepts must remain separate:

| Concept | Meaning |
| --- | --- |
| KPI | Measures or predicts a system condition. |
| Goal | Describes a desired outcome or optimization direction. |
| Target value | Quantifies a desired state at a defined time or interval. |
| Constraint | Limits the feasible solution space. |
| Priority | Helps resolve competing goals and preferences. |

For example, battery state of charge is a measured value. “Keep at least 30% at sunset” is a time-specific target or constraint depending on how strictly it must be enforced.

## Concept summary

| Concept | Why it matters |
| --- | --- |
| Information-centered architecture | The optimizer depends on meaning, not on a fixed adapter or vendor list. |
| Information Interpreter | External values are validated and translated into stable domain information. |
| Vendor-neutral energy model | The core models physical energy behavior instead of vendor APIs. |
| Energy assets and context | Physical capabilities and external decision conditions remain distinct. |
| Architecture-first development | Domain models and pure engines come before runtime integration. |
| Read-only before control | Recommendations can be inspected before any future device behavior exists. |
| History-driven knowledge | Historical data becomes reusable context for prediction, diagnostics, simulation, and optimization. |
| Pattern-based Virtual Energy Assets | Repeated behavior may become user-confirmed virtual assets instead of hardcoded device assumptions. |
| Explainable decisions | Recommendations should be traceable to measurements, history, forecasts, predictions, goals, and constraints. |
| Optimization loop | Plans can be re-evaluated when measurements or external conditions change. |

## Current boundary

The Information Interpreter, expanded context model, pattern recognition, calibrated profiles, planning, and virtual assets are architecture topics. They describe the intended system direction but are not all current runtime features.

---

Next: read the [Project Status](PROJECT_STATUS.md) to see what already works today and what is still planned.
