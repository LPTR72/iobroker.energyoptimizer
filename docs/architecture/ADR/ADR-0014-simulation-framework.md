# ADR-0014: Simulation Framework

## Status

Accepted

## Context

The project needs repeatable ways to develop, replay, validate, benchmark, demonstrate, and regression-test energy behavior without depending on live hardware or waiting for wall-clock time. The implemented `SimulationRuntime` exercises a narrow read-only analysis-to-recommendation path from current source values; it is not the broader framework described here.

A parallel simulation-only implementation of prediction, optimization, or recommendation would drift from production semantics and make benchmark results unreliable. The long-term architecture therefore needs simulation as a first-class capability that can reuse production components while leaving its exact runtime interaction and implementation order open.

## Decision

Adopt a future **Simulation Framework** as a permanent architecture component for:

- development;
- replay;
- validation;
- benchmark scenarios;
- regression testing;
- demonstrations;
- accelerated simulation.

Simulation is an architecture capability, not merely a developer tool. Live operation and simulation should reuse the same processing pipeline and domain components whenever practical. Inputs, clocks, providers, and side-effect boundaries may differ, but the optimizer should consume neutral inputs and should not need to distinguish whether they originated from live or simulated data.

The framework should support deterministic scenario execution and an explicit simulation clock, including accelerated time. The exact orchestration boundary, runtime interaction, persistence model, and implementation order remain intentionally open for later approved milestones.

### Long-term architecture position

```text
Data Acquisition
  -> History Service
  -> Pattern Recognition
  -> Knowledge Model / Pattern-based Virtual Energy Assets
  -> Prediction Engine
  -> Simulation Framework
  -> Optimizer
  -> Recommendation
```

This sequence communicates architectural dependencies and consumers, not a fixed runtime call graph. Simulation may provide or replay inputs at multiple boundaries where reuse remains safe and deterministic.

### Capability families

The long-term capability set may include:

- **Development Simulation** for exercising incomplete or evolving components;
- **Accelerated Time** through a controllable simulation clock;
- **Replay Mode** for deterministic reprocessing of recorded historical inputs;
- **Scenario Library** for reusable, versioned scenarios;
- **Benchmark Scenarios** for objective comparison of optimization strategies;
- **Demo Mode** for safe, immediate exploration without configured hardware or history;
- **Synthetic Data Generation** for controlled inputs and edge cases;
- **Regression Testing** for stable end-to-end behavioral expectations.

These are long-term architectural capabilities, not committed implementation milestones.

### Demo Mode

Demo Mode should let a new user experience the adapter soon after installation without configuring physical devices or historical storage. It may use synthetic or packaged scenario data and must remain clearly distinguishable from live operation. A demonstration must not imply device availability, write foreign states, or enable device control.

### Benchmark scenarios

An initial scenario library may include:

- **Sunny Summer Day**;
- **Cloudy Day**;
- **Winter Day**;
- **Dynamic Tariff**;
- **EV Charging**;
- **Irrigation after Dry Days**;
- **Pool Pump Season**.

Benchmark scenarios provide repeatable inputs, time progression, constraints, and expected observations so optimization strategies can be compared objectively. Metrics and scoring rules must be explicit and versioned; the framework must not tune scenarios to favor one strategy.

## Consequences

- Simulation becomes part of the long-term target architecture and can serve users, development, validation, demonstrations, and benchmarking.
- Reusing production components reduces semantic drift between live and simulated behavior.
- Neutral inputs and an explicit clock keep optimizers independent from execution mode.
- Accelerated and replayed time require time dependencies to be injectable rather than hidden in wall-clock access.
- Benchmark scenarios can provide evidence for strategy changes instead of relying on anecdotal comparisons.
- The existing `SimulationRuntime` remains implemented and read-only but does not by itself complete the Simulation Framework.
- Framework implementation, runtime integration, scenario formats, metrics, user interfaces, and execution order require separate approved milestones.
