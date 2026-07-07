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

# Project Status

The project is under active development.

The current runtime is intentionally conservative: it reads configured ioBroker states, mirrors live energy values, calculates fixed-tariff import costs, publishes diagnostics, and exposes read-only recommendation data. It does not control devices.

![Project timeline](assets/timeline.svg)

> **Current status**
>
> The History Service domain foundation is implemented, but the milestone is not complete until architecture review and validation are finished.

## Implemented foundations

Implemented foundations include:

- ioBroker adapter lifecycle and polling
- centralized state definitions and state management
- fixed-tariff interval cost calculation
- generic energy assets and configuration normalization
- energy-system and optimizer-input factories
- analysis engine and neutral analysis model
- forecast abstraction
- prediction engine, prediction options, energy prediction, and time-series merging
- neutral optimization models
- evaluation engine and evaluation options
- recommendation engine and recommendation options
- read-only simulation runtime integration
- structured read-only recommendation projection
- dormant planning-domain semantics
- History Service domain foundation, currently pending architecture review and milestone closure

## Current safety boundary

The adapter currently remains read-only with respect to external devices and foreign states.

Not implemented in the public runtime:

- device switching
- scheduling
- execution provider integration
- writes to foreign ioBroker states
- external forecast, tariff, or weather provider calls
- SQL history collection runtime integration
- pattern recognition runtime integration

## Current development focus

The active milestone is the History Service domain foundation. It has been implemented but is not considered complete until architecture review, validation, and milestone closure are finished.

## Maturity overview

| Area | Status |
| --- | --- |
| Runtime polling and mirroring | Implemented |
| Fixed-tariff cost calculation | Implemented |
| Domain model foundation | Implemented and evolving |
| Analysis, prediction, evaluation, recommendation | Implemented foundations |
| Read-only simulation runtime | Implemented |
| Planning models | Dormant domain foundation only |
| History Service | Domain foundation implemented; review pending |
| Pattern-based Virtual Energy Assets | Planned architecture concept |
| SQL/history backend integration | Planned |
| Pattern recognition | Planned |
| Device behavior | Planned and approval-gated |

## Project quality

The project follows an architecture-first development style. Core domain logic is designed to be deterministic, testable, and independent from vendor APIs or ioBroker runtime details. Public runtime behavior is introduced in stages so new capabilities can be inspected before they affect real devices.
