<p align="center">
  <img src="../images/Logo_Large.png" alt="ioBroker Energy Optimizer" width="260">
</p>

<p align="center">
  <strong>ioBroker Energy Optimizer</strong><br>
  Public project presentation
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

This project is not just an adapter that reads values and switches devices. It is designed as a gradual, explainable energy-optimization platform.

## What makes the project different

| Concept | Why it matters |
| --- | --- |
| Vendor-neutral energy model | The core models physical energy behavior instead of vendor APIs. |
| Architecture-first development | Domain models and pure engines come before runtime integration. |
| Read-only before control | Recommendations can be inspected before any future device behavior exists. |
| History-driven knowledge | Historical data becomes reusable context for prediction, diagnostics, simulation, and optimization. |
| Pattern-based Virtual Energy Assets | Repeated behavior may become user-confirmed virtual assets instead of hardcoded device assumptions. |
| Explainable decisions | Recommendations should be traceable to measurements, history, predictions, and constraints. |
| Simulation foundation | Read-only simulation output today prepares future replay, scenarios, and benchmarks. |

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

## Why this is important

Many home-energy automations are built around direct device assumptions: if there is surplus, switch something on. This project takes a different path.

It first builds a neutral understanding of energy assets, historical behavior, prediction quality, costs, priorities, and safety boundaries. Future actions should be based on explainable knowledge rather than opaque automation rules.

## Current boundary

Pattern recognition and virtual assets are long-term architecture topics. They are part of the project vision, but they are not current runtime features.
