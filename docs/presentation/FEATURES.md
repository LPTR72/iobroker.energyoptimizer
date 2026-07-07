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
  <a href="PROJECT_STATUS.md">Status</a> ·
  <a href="FEATURES.md">Features</a> ·
  <a href="USE_CASES.md">Use Cases</a> ·
  <a href="ARCHITECTURE_OVERVIEW.md">Architecture</a> ·
  <a href="ROADMAP.md">Roadmap</a> ·
  <a href="FAQ.md">FAQ</a>
</p>

---

# Features

This page separates implemented behavior from planned capabilities.

> **Design rule**
>
> Features are documented as implemented only when they exist in the runtime or domain code. Planned capabilities are marked separately.

## Currently available runtime behavior

The current adapter runtime can:

- read configured numeric ioBroker source states
- mirror grid, house, photovoltaic, and battery values into adapter-owned states
- tolerate missing, empty, or non-numeric input values without crashing
- calculate interval-based grid-import energy
- accumulate daily and monthly fixed-tariff import costs
- publish health and configuration status
- publish read-only simulation diagnostics
- expose structured read-only recommendation output

## Implemented domain capabilities

The repository contains domain foundations for:

- generic energy assets
- normalized configuration
- energy-system snapshots
- optimizer input construction
- analysis
- forecast abstraction
- prediction
- time-series merging
- situation evaluation
- recommendation generation
- dormant execution-plan modeling
- History Service domain concepts

These components are designed to be deterministic and testable without depending directly on ioBroker runtime APIs.

## Planned capabilities

Planned capabilities include:

- provider integrations for forecast, tariff, and weather data
- SQL-backed historical data collection through an implementation-neutral repository boundary
- deterministic aggregation and quality metadata for historical observations
- pattern recognition based on confirmed historical behavior
- richer cost, efficiency, degradation, and priority models
- first-class simulation framework capabilities such as replay, scenarios, benchmarks, and demo mode
- execution providers for explicitly approved device-control milestones

## Explicitly not current features

The following are not current runtime features:

- automatic device control
- appliance scheduling
- direct vendor-cloud control
- writes to third-party ioBroker adapter states
- autonomous optimization execution

The project deliberately builds toward these areas only through separate approval, implementation, and validation milestones.
