# Architecture decisions

This document consolidates durable architecture, simulation, history, pattern, workflow, and validation decisions. Public ioBroker object/state boundaries are defined in [Object model](OBJECT_MODEL.md). Detailed records are maintained in the [ADR index](ADR/README.md):

- [ADR-0001: Clean Architecture](ADR/ADR-0001-clean-architecture.md)
- [ADR-0002: Generic asset model](ADR/ADR-0002-generic-asset-model.md)
- [ADR-0003: Analysis engine](ADR/ADR-0003-analysis-engine.md)
- [ADR-0004: Forecast abstraction](ADR/ADR-0004-forecast-abstraction.md)
- [ADR-0005: Prediction engine](ADR/ADR-0005-prediction-engine.md)
- [ADR-0006: Evaluation engine](ADR/ADR-0006-evaluation-engine.md)
- [ADR-0007: Recommendation engine](ADR/ADR-0007-recommendation-engine.md)
- [ADR-0008: Read-only simulation runtime](ADR/ADR-0008-read-only-simulation-runtime.md)
- [ADR-0009: Read-only runtime publication](ADR/ADR-0009-read-only-runtime-publication.md)
- [ADR-0010: Neutral ExecutionPlanner foundation](ADR/ADR-0010-neutral-execution-planner.md)
- [ADR-0011: Neutral execution-planning semantics](ADR/ADR-0011-execution-planning-semantics.md)
- [ADR-0012: History Service](ADR/ADR-0012-history-service.md)
- [ADR-0013: Pattern-based Virtual Energy Assets](ADR/ADR-0013-pattern-based-virtual-energy-assets.md)
- [ADR-0014: Simulation Framework](ADR/ADR-0014-simulation-framework.md)

The summaries below provide a readable overview.

## Brainstorming before implementation

Durable brainstorming results, selected architecture direction, rejected scope, and milestone boundaries must be documented before implementation begins. Chat or session memory is not a durable design source. Implementation prompts may refer to repository documentation, but must not rely on implicit prior discussion for compatibility, runtime, safety, or validation decisions.

## Domain independence

Business logic stays independent from ioBroker. Lifecycle, state access, logging, and object creation belong outside the optimizer core and behind interfaces.

## Generic assets and compatibility views

The generic asset model is the preferred future representation for heterogeneous systems. Existing grid, PV, battery, and house views remain supported to preserve compatibility during gradual migration.

Public adapter state IDs are compatibility contracts. Existing public IDs, native configuration names, object roles, units, polling behavior, fixed-tariff calculations, logging, and rounding must not change without explicit approval and migration planning. The current public state tree, reserved namespaces, naming rules, JSON publication boundaries, and read/write policy belong in [Object model](OBJECT_MODEL.md).

## Abstract providers before integrations

Forecast and state-provider contracts are defined before concrete providers. This prevents Forecast.Solar, tariff, weather, history, or device-specific assumptions from becoming core concepts.

## History is a service, not a forecast provider

The planned `History Service` is the central historical data platform for analysis, prediction, evaluation, simulation, diagnostics, future visualization, and future optimization models. It owns collection, deterministic multi-resolution aggregation, retention, data quality, and temporal context. Its internal Collector and Aggregator use the implementation-neutral History Repository behind one external service boundary. `PredictionEngine` may consume historical series and context but never stores history. See [ADR-0012](ADR/ADR-0012-history-service.md).

The History Service is a multi-step epic, not one implementation task. The first implementation slice should be domain foundation only:

- typed metrics;
- samples;
- buckets;
- quality metadata;
- supported resolutions;
- deterministic collector and aggregator logic.

The first History slice explicitly excludes SQL, runtime integration, new ioBroker states, configuration UI, pattern recognition, and the Simulation Framework. These require later approved milestones.

History buckets must not be stored as ordinary adapter state objects. Historical persistence belongs behind the History Repository boundary, preferably using existing ioBroker SQL infrastructure in a later repository milestone, and must not expand the live object tree with per-bucket states.

## Detected patterns require confirmation

The future Pattern Recognition Engine derives device-neutral hypotheses from History Service data. Detection never proves a device identity and does not create a persistent asset automatically. User-confirmed hypotheses may become Pattern-based Virtual Energy Assets in a knowledge model and support later prediction and optimization. See [ADR-0013](ADR/ADR-0013-pattern-based-virtual-energy-assets.md).

Pattern recognition produces hypotheses only. Persistent virtual assets require explicit user confirmation, and confirmed pattern-based virtual assets remain device-neutral knowledge. They may enrich prediction, cost, battery, optimization, recommendation, simulation, diagnostics, or visualization models, but they are not direct device-control bindings.

## Simulation is a permanent architecture capability

The future Simulation Framework supports development, replay, validation, objective benchmarks, demonstrations, accelerated time, and regression testing. It should reuse production domain components so optimizers remain independent from whether inputs are live or simulated. The existing read-only `SimulationRuntime` is narrower and does not complete this framework. See [ADR-0014](ADR/ADR-0014-simulation-framework.md).

Simulation is a first-class future architecture capability, not just a test tool. Its long-term scope includes Demo Mode, replay, accelerated time, a scenario library, benchmark scenarios, synthetic data, and regression testing.

Demo Mode must remain clearly separate from live operation. It may use packaged or synthetic scenario data, but it must not imply configured hardware availability, write foreign states, or enable device control.

## Prediction before evaluation

Time alignment, explicit resolution and horizon options, fallbacks, and prediction warnings belong in `PredictionEngine`; evaluation should consume a stable prediction rather than repeat provider-specific handling. Sampling, prediction, and evaluation timing remain separate concerns.

## Planned recommendations are not execution

Recommendations express device-independent intent. A separate `ExecutionPlanner` will match intent against capabilities and constraints. A future execution layer alone may perform side effects; the architecture avoids a monolithic `OptimizerEngine` that mixes reasoning and control.

`RecommendationEngine` now implements the intent-producing step. It ranks known situation/goal combinations deterministically and applies only recommendation-level constraints; it does not plan or execute actions.

## Evaluation produces neutral situations

`EvaluationEngine` consumes analysis and prediction, applies explicit validated thresholds, and produces `EnergySituation` values. It does not recommend, plan, execute, or access runtime infrastructure.

## Behavior stability during domain modeling

Domain work does not alter state IDs, config names, polling, logging, calculations, rounding, or active adapter behavior. Behavior changes require explicit approval.

## Read-only runtime publication

After polling, the simulation pipeline may publish diagnostic JSON and structured recommendation fields only to adapter-owned states. Missing inputs remain explicit, non-ready results clear the projection, and no recommendation is scheduled or executed.

Runtime remains read-only until explicit execution approval. During the read-only phase, the adapter writes only adapter-owned states and never writes foreign states. Execution planning may exist as pure domain logic, but runtime scheduling, device commands, and external state mutation remain unapproved.

## Planning is dormant and conservative

`ExecutionPlanner` maps only unambiguous recommendation/capability pairs to neutral actions. Missing capabilities, constraints, and abstract advice produce blocked plans instead of guessed behavior. Planning remains disconnected from runtime and execution.

Physical and temporal restrictions are represented as feasible action limits rather than selected device setpoints. Empty ranges, expired intent, and overlapping opposite storage actions block the plan.

## Validation is structural and runtime-aware

Every state or object change requires before/after object-structure validation, with every added, removed, or changed object explained according to [Object model](OBJECT_MODEL.md). State definitions alone are not sufficient evidence; both object creation and state values must be validated for public state changes.

Raspberry Pi and ioBroker validation remains mandatory for production-code, runtime, state-handling, provider, integration, packaging, or execution milestones. Local build and tests are necessary but do not replace validation on the target runtime path.

## Lightweight tests

Pure domain modules use Node's built-in test runner to keep tests fast and dependency-free. Strict TypeScript compilation remains mandatory.
