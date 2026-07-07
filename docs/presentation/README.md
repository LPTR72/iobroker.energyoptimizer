<p align="center">
  <img src="../images/Logo_Large.png" alt="ioBroker Energy Optimizer" width="820">
</p>

<h1 align="center">ioBroker Energy Optimizer</h1>

<p align="center">
  <strong>Public project presentation</strong><br>
  Transparent, vendor-neutral home energy optimization for ioBroker.
</p>

<p align="center">
  <a href="PROJECT_VISION.md">Vision</a> ·
  <a href="PROJECT_STATUS.md">Status</a> ·
  <a href="FEATURES.md">Features</a> ·
  <a href="USE_CASES.md">Use Cases</a> ·
  <a href="ARCHITECTURE_OVERVIEW.md">Architecture</a> ·
  <a href="ROADMAP.md">Roadmap</a> ·
  <a href="FAQ.md">FAQ</a>
</p>

---

## Overview

`ioBroker.energyoptimizer` is an ioBroker adapter project for transparent, vendor-neutral home energy optimization.

The project starts with safe energy data handling and read-only recommendations. Its long-term direction is a modular optimization platform that can analyze current energy flows, combine them with forecasts and history, evaluate situations, recommend actions, and later execute explicitly approved plans.

![Optimization pipeline](assets/pipeline.svg)

> **Current safety boundary**
>
> The current public runtime is not a device-control system. It does not switch devices, schedule loads, write to foreign states, or call external cloud APIs without a separate approved implementation step.

## Visual overview

| Diagram | Purpose |
| --- | --- |
| [Pipeline](assets/pipeline.svg) | Shows the optimization path from measurement to recommendation and later planning. |
| [Architecture](assets/architecture.svg) | Shows the boundary between ioBroker runtime, integrations, and domain core. |
| [Timeline](assets/timeline.svg) | Shows implemented foundations, current work, and future areas. |
| [History Service](assets/history.svg) | Shows the planned historical data foundation. |
| [Simulation](assets/simulation.svg) | Separates current read-only diagnostics from future framework work. |
| [Future step](assets/future-step.svg) | Shows the later path beyond recommendations. |

## Presentation pages

| Page | Purpose |
| --- | --- |
| [Project vision](PROJECT_VISION.md) | Long-term project direction and guiding principles |
| [Project status](PROJECT_STATUS.md) | Current maturity, implemented foundations, and active milestone |
| [Features](FEATURES.md) | Implemented behavior versus planned capabilities |
| [Use cases](USE_CASES.md) | Typical user and developer scenarios |
| [Architecture overview](ARCHITECTURE_OVERVIEW.md) | Public explanation of the architecture and boundaries |
| [Roadmap](ROADMAP.md) | High-level development direction |
| [FAQ](FAQ.md) | Frequently asked questions |

## Core pipeline

```text
measure -> analyze -> forecast -> predict -> evaluate -> recommend -> plan -> execute
```

The project intentionally builds this pipeline from the inside out: deterministic domain models first, safe read-only runtime integration second, execution last.

## Documentation scope

These pages summarize the public project direction and are suitable as a future basis for GitHub Pages.

Detailed project documentation remains in:

- [`../architecture/`](../architecture/)
- [`../roadmap/`](../roadmap/)
- [`../development/`](../development/)
