<p align="center">
  <img src="../images/Logo_Large.png" alt="ioBroker Energy Optimizer" width="820">
</p>

# ioBroker Energy Optimizer - Public Presentation

`ioBroker.energyoptimizer` is an ioBroker adapter project for transparent, vendor-neutral home energy optimization.

The project starts with safe energy data handling and read-only recommendations. Its long-term direction is a modular optimization platform that can analyze current energy flows, combine them with forecasts and history, evaluate situations, recommend actions, and later execute explicitly approved plans.

## Presentation pages

- [Project vision](PROJECT_VISION.md)
- [Project status](PROJECT_STATUS.md)
- [Features](FEATURES.md)
- [Use cases](USE_CASES.md)
- [Architecture overview](ARCHITECTURE_OVERVIEW.md)
- [Roadmap](ROADMAP.md)
- [FAQ](FAQ.md)

## What the project is

The project is designed as a gradual, architecture-first energy optimization platform for ioBroker.

It models the home energy system in a vendor-neutral way and keeps core logic independent from concrete devices, protocols, cloud services, and ioBroker runtime APIs.

## What the project is not

The current public runtime is not a device-control system.

It does not switch devices, schedule loads, write to foreign states, or call external cloud APIs without a separate approved implementation step.

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
