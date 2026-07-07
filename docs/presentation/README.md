# ioBroker Energy Optimizer - Presentation

This folder provides a public, readable project presentation for users, contributors, and technically interested reviewers.

The documents are intentionally concise and suitable as a future basis for GitHub Pages. They explain the project without relying on internal development notes.

## Contents

- [Project vision](PROJECT_VISION.md)
- [Project status](PROJECT_STATUS.md)
- [Features](FEATURES.md)
- [Use cases](USE_CASES.md)
- [Architecture overview](ARCHITECTURE_OVERVIEW.md)
- [Roadmap](ROADMAP.md)
- [FAQ](FAQ.md)

## What the project is

`ioBroker.energyoptimizer` is an ioBroker adapter project for transparent, vendor-neutral home energy optimization.

The project starts with safe energy data handling and read-only recommendations. Its long-term direction is a modular optimization platform that can analyze current energy flows, combine them with forecasts and history, evaluate situations, recommend actions, and later execute explicitly approved plans.

## What the project is not

The current public runtime is not a device-control system. It does not switch devices, schedule loads, write to foreign states, or call external cloud APIs without a separate approved implementation step.

## Documentation scope

These pages summarize the public project direction. Detailed implementation decisions remain in the main documentation areas:

- [`../architecture/`](../architecture/)
- [`../roadmap/`](../roadmap/)
- [`../development/`](../development/)
