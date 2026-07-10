<p align="center">
  <img src="../images/Logo_Large.png" alt="ioBroker Energy Optimizer" width="820">
</p>

<h1 align="center">ioBroker Energy Optimizer</h1>

<p align="center">
  <strong>Public project presentation 2.1</strong><br>
  Explainable, information-centered and vendor-neutral home energy optimization for ioBroker.
</p>

<p align="center">
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

## Why this project exists

Modern home energy systems are becoming increasingly complex. Solar generation, batteries, dynamic tariffs, smart devices, weather, calendars, grid restrictions, and changing household routines all influence each other. `ioBroker.energyoptimizer` aims to make this complexity understandable before it automates anything.

Imagine a home that first understands what its data means: when solar surplus usually appears, when flexible loads could wait, when a battery reserve matters, which constraints apply, and why one option is better than another.

Rather than being a simple automation script, `ioBroker.energyoptimizer` is evolving into an architecture-first energy optimization platform that can interpret information, understand energy behavior, explain recommendations, prepare feasible plans, and only later perform approved actions.

The product direction is:

> **Understand → Recommend → Plan → Automate**

The project already provides the first safe foundations for this direction: live energy values, cost tracking, diagnostics, vendor-neutral domain models, simulation diagnostics, and structured read-only recommendations. Its long-term architecture combines interpreted measurements, history, forecasts, context, prediction, analysis, evaluation, simulation, goals, constraints, planning, and explicit approval boundaries.

![Optimization pipeline](assets/pipeline.svg)

> **Current safety boundary**
>
> The current public runtime is not a device-control system. It does not control devices, schedule loads, modify external states, or call external services without a separate approved implementation step.

## What makes it different

| USP | Meaning |
| --- | --- |
| Information-centered architecture | The optimizer depends on semantic information types instead of a fixed list of adapters or manufacturers. |
| Information Interpreter | External values are validated and translated into stable domain information at one explicit system boundary. |
| Vendor-neutral energy model | The core models physical energy behavior and decision context rather than vendor-specific APIs. |
| Read-only before control | Recommendations can be inspected before any future device behavior exists. |
| History as knowledge foundation | Historical data becomes reusable evidence for prediction, diagnostics, simulation, calibration, and optimization. |
| Energy Assets and Context Information | Physical capabilities remain distinct from weather, tariffs, calendars, occupancy, and other decision conditions. |
| Pattern-based Virtual Energy Assets | Recurring behavior may become user-confirmed virtual assets instead of hardcoded assumptions. |
| Explainable calibration | Standard profiles may be refined by observations without hiding uncertainty in a black-box model. |
| Explainable recommendations | Decisions should be traceable to measurements, history, forecasts, predictions, goals, constraints, and priorities. |
| Closed-loop direction | Future actions are measured and re-evaluated instead of being treated as one-time rules. |

![Pattern-based Virtual Energy Assets](assets/virtual-assets.svg)

## Visual overview

| Diagram | Purpose |
| --- | --- |
| [Pipeline](assets/pipeline.svg) | Shows the product path from measurement to recommendation and later planning. |
| [Architecture](assets/architecture.svg) | Shows the boundary between ioBroker runtime, integrations, and domain core. |
| [Processing model](assets/processing-model.svg) | Shows interpreted information, cooperating capabilities, future execution, and re-evaluation. |
| [Timeline](assets/timeline.svg) | Shows implemented foundations, current work, and future areas. |
| [History Service](assets/history.svg) | Shows the planned historical data foundation. |
| [Virtual Energy Assets](assets/virtual-assets.svg) | Shows how patterns may become confirmed reusable knowledge. |
| [Simulation](assets/simulation.svg) | Separates current Simulation Runtime from the planned Simulation Framework. |
| [Future step](assets/future-step.svg) | Shows the later path beyond recommendations. |

## Presentation pages

| Page | Purpose |
| --- | --- |
| [Project vision](PROJECT_VISION.md) | Long-term project direction and guiding principles |
| [Key concepts](KEY_CONCEPTS.md) | The architecture ideas that make the project different |
| [Project status](PROJECT_STATUS.md) | Current maturity, implemented foundations, and active architecture focus |
| [Features](FEATURES.md) | Implemented behavior versus planned capabilities |
| [Use cases](USE_CASES.md) | Typical user and developer scenarios |
| [Architecture overview](ARCHITECTURE_OVERVIEW.md) | Public explanation of the architecture and boundaries |
| [Roadmap](ROADMAP.md) | High-level development direction |
| [FAQ](FAQ.md) | Frequently asked questions |

---

Next: start with the [Project Vision](PROJECT_VISION.md) to understand the long-term direction behind the optimizer.