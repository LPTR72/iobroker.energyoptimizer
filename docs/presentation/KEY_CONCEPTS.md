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

`ioBroker.energyoptimizer` is designed to help a home energy system become understandable before it becomes automated.

Instead of reacting to single live values, the project builds a gradual understanding of energy assets, historical behavior, predictions, costs, priorities, and safety boundaries. This makes future recommendations easier to inspect, explain, and improve over time.

The key idea is simple: good optimization should know why a recommendation makes sense before it suggests what to do.

## From automation rules to energy understanding

Many home-energy automations are built around direct device assumptions: if there is surplus power, switch something on. That may work for simple cases, but it does not scale well when a household combines batteries, flexible loads, electric vehicles, heating systems, tariffs, forecasts, and comfort constraints.

This project takes a different path. It models energy behavior in a neutral way, independent of a specific vendor, device, protocol, or cloud service. A battery, a heat pump, an electric vehicle charger, or a recurring household load can then be reasoned about by its role in the energy system rather than by its brand name.

## Read-only before control

The project intentionally starts with observation, diagnostics, simulation, and recommendations before any later automation stage.

This is important because an optimizer should not silently change device behavior before its reasoning can be reviewed. Read-only results create a safe foundation: the system can explain what it sees, what it predicts, and why a recommendation may be useful.

## History as reusable knowledge

Live power values are useful, but they are only a snapshot. Historical data can reveal recurring behavior, timing patterns, seasonal effects, and typical household routines.

Over time, this historical context can support better prediction, diagnostics, simulation, and optimization. The goal is not just to store data, but to turn repeated observations into reusable knowledge.

## Pattern-based Virtual Energy Assets

A future Pattern Recognition Engine may detect recurring load behavior from historical data. Detected patterns remain hypotheses with evidence and confidence. They do not become persistent knowledge automatically.

Only after user confirmation can a hypothesis become a Pattern-based Virtual Energy Asset.

```text
History Service
  -> Pattern Recognition
  -> User confirmation
  -> Pattern-based Virtual Energy Asset
  -> Prediction
  -> Optimization
  -> Recommendation
```

This keeps the model honest: the system may recognize recurring behavior without pretending to know the exact physical device behind it.

## Concept summary

| Concept | Why it matters |
| --- | --- |
| Vendor-neutral energy model | The core models physical energy behavior instead of vendor APIs. |
| Architecture-first development | Domain models and pure engines come before runtime integration. |
| Read-only before control | Recommendations can be inspected before any future device behavior exists. |
| History-driven knowledge | Historical data becomes reusable context for prediction, diagnostics, simulation, and optimization. |
| Pattern-based Virtual Energy Assets | Repeated behavior may become user-confirmed virtual assets instead of hardcoded device assumptions. |
| Explainable decisions | Recommendations should be traceable to measurements, history, predictions, and constraints. |
| Simulation foundation | Read-only simulation output today prepares future replay, scenarios, and benchmarks. |

## Current boundary

Pattern recognition and virtual assets are long-term architecture topics. They are part of the project vision, but they are not current runtime features.
