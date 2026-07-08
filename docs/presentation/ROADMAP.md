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

# Roadmap

**Document status:** Public presentation, version 2.1, updated 2026-07-08.

The goal of ioBroker Energy Optimizer is not to jump directly from measurements to automation.

A home energy system becomes trustworthy step by step: first it must understand what is happening, then explain useful recommendations, then plan future actions, and only later — with explicit user approval and safety rules — control devices.

That is the guiding path of the roadmap:

> **Understand → Recommend → Plan → Automate**

![Project timeline](assets/timeline.svg)

> **Roadmap rule**
>
> Planned direction does not imply current runtime behavior. Runtime changes, history integration, planning, and device behavior are split into explicit milestones so that each step can be reviewed, validated, and kept safe.

## 1. Foundations already completed

The project has established the technical and domain foundations needed before more advanced optimization can happen.

These foundations include:

- an ioBroker adapter lifecycle with safe polling
- live value mirroring
- fixed-tariff import-cost calculation
- generic energy assets
- normalized configuration
- analysis, forecast, prediction, evaluation, and recommendation foundations
- read-only simulation runtime integration
- structured read-only recommendation output
- dormant planning model semantics

In practical terms, this means the project can already represent energy sources and consumers in a structured way and produce safe recommendation-oriented output without controlling devices.

## 2. Current focus: History Service foundation

The current milestone is the **History Service domain foundation**.

The purpose is to define how past observations should be represented before a concrete storage backend or runtime collection path is integrated.

![History Service](assets/history.svg)

For non-developers, this is the step that turns isolated live values into useful memory.

A history layer can help answer questions such as:

- When does a device usually consume energy?
- How reliable was a forecast compared with reality?
- Which household patterns repeat over time?
- Which recommendations worked well in the past?

This milestone is not about automatic device control. It is about creating the reliable context that future recommendations and planning will need.

## 3. Next direction: History Service integration

After the foundation is complete, the History Service is expected to become the central source for past observations and temporal context.

Planned areas include:

### Historical data model

- typed historical metrics
- sample and bucket models
- deterministic aggregation
- quality metadata
- retention policies

### Storage and access

- repository abstraction
- SQL-backed persistence through existing ioBroker infrastructure
- clean boundaries between storage and consumers

### Future consumers

- prediction
- diagnostics
- simulation
- later optimization

The important idea is that history should not be tied to one specific database or one specific use case. It should become a neutral building block that other parts of the system can rely on.

## 4. Later direction: provider integrations

Future provider work may add external context to the optimizer.

Possible provider areas include:

- photovoltaic forecast providers
- tariff providers
- weather providers
- device capability providers

These integrations should remain behind neutral boundaries. The optimizer should be able to use provider information without becoming dependent on one specific service, vendor, or data source.

## 5. Later direction: pattern knowledge

A future Pattern Recognition Engine may use historical data to detect recurring household behavior.

Examples could include typical device runtimes, recurring consumption peaks, or regular solar surplus windows.

Detected patterns should remain hypotheses until confirmed by the user. Confirmed patterns may then become device-neutral virtual energy assets that improve prediction and later planning.

## 6. Later direction: simulation framework

A future first-class Simulation Framework may help test energy behavior before it affects a real household.

![Simulation](assets/simulation.svg)

Possible capabilities include:

- replaying historical situations
- accelerated time
- scenario libraries
- benchmark scenarios
- demonstration mode
- synthetic data generation
- regression testing

This remains a long-term architecture capability. Its implementation order is still open, but the intent is clear: important behavior should be explainable and testable before it becomes part of real runtime decisions.

## 7. Long-term direction: planning and controlled device behavior

The long-term vision includes more than understanding energy flows.

The project should eventually be able to help plan when devices should run — for example when solar surplus is expected, prices are lower, or household comfort is not affected.

Controlled device behavior is therefore part of the long-term roadmap, but it is approval-gated and safety-gated.

Before the system can safely control devices, it needs:

- reliable recommendations
- clear planning semantics
- validation and conflict handling
- provider boundaries
- user approval rules
- runtime safety controls
- transparent explanations of what will happen and why

The current runtime stops at read-only recommendation output. Future automation must be built gradually, reviewed carefully, and remain under explicit user control.

## Roadmap summary

The roadmap deliberately moves from understanding to action:

1. **Understand** energy data and household behavior.
2. **Recommend** useful actions without changing runtime behavior.
3. **Plan** future actions safely and transparently.
4. **Automate** only after explicit approval, safety checks, and clear boundaries.

This makes ioBroker Energy Optimizer a long-term project for trustworthy home energy intelligence — not just a collection of calculations.

---

Next: read the [FAQ](FAQ.md) for concise answers to common questions about scope, current limitations, and long-term direction.
