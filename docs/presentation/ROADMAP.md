# Roadmap

This roadmap summarizes the public direction at a high level. It does not replace the detailed project roadmap in [`../roadmap/ROADMAP.md`](../roadmap/ROADMAP.md).

## Completed foundations

The project has established the main architectural and domain foundations:

- ioBroker adapter lifecycle and safe polling
- live value mirroring
- fixed-tariff import-cost calculation
- generic energy assets
- normalized configuration
- analysis, forecast abstraction, prediction, evaluation, and recommendation foundations
- read-only simulation runtime integration
- structured read-only recommendation output
- dormant execution-planning model semantics

## Current milestone

The current milestone is the History Service domain foundation.

Its purpose is to establish implementation-neutral history concepts before integrating a concrete backend or runtime collection path.

The milestone is not complete until architecture review and validation are finished.

## Next likely direction: History Service integration

The History Service is expected to become the central source for past observations and temporal context.

Planned topics include:

- typed historical metrics
- sample and bucket models
- deterministic aggregation
- quality metadata
- retention policies
- repository abstraction
- SQL-backed persistence through existing ioBroker infrastructure
- consumers such as prediction, diagnostics, simulation, and later optimization

## Later direction: provider integrations

Future provider work may include:

- photovoltaic forecast providers
- tariff providers
- weather providers
- device capability providers

Provider integrations should remain behind neutral boundaries.

## Later direction: pattern knowledge

A future Pattern Recognition Engine may use historical data to detect recurring household behavior.

Detected patterns should remain hypotheses until confirmed by the user. Confirmed patterns may become device-neutral virtual energy assets for prediction and optimization.

## Later direction: simulation framework

A future first-class Simulation Framework may support:

- replay mode
- accelerated time
- scenario libraries
- benchmark scenarios
- demonstration mode
- synthetic data generation
- regression testing

This is a long-term architecture capability. Its implementation order is still open.

## Long-term direction: controlled execution

Device execution is planned but approval-gated.

Before execution can be safe, the project needs reliable recommendations, planning semantics, validation, conflict handling, provider boundaries, user approval rules, and runtime safety controls.

Execution should be the last step of the optimization pipeline, not the first.
