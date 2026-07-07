# Project Status

The project is under active development.

The current runtime is intentionally conservative: it reads configured ioBroker states, mirrors live energy values, calculates fixed-tariff import costs, publishes diagnostics, and exposes read-only recommendation data. It does not control devices.

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
- dormant execution-planning domain semantics
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

The active milestone is the History Service domain foundation. It has been implemented but is not considered complete until architecture review, validation, documentation update, and milestone closure are finished.

## Maturity overview

| Area | Status |
| --- | --- |
| Runtime polling and mirroring | Implemented |
| Fixed-tariff cost calculation | Implemented |
| Domain model foundation | Implemented and evolving |
| Analysis, prediction, evaluation, recommendation | Implemented foundations |
| Read-only simulation runtime | Implemented |
| Execution planning | Dormant domain foundation only |
| History Service | Domain foundation implemented; review pending |
| SQL/history backend integration | Planned |
| Pattern recognition | Planned |
| Device execution | Planned and approval-gated |

## Validation model

Production-code milestones are expected to pass local build and tests, whitespace checks, repository review, and, where relevant, Raspberry Pi / ioBroker runtime validation before being closed.
