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

# FAQ

**Document status:** Public presentation, version 2.1, updated 2026-07-08.

This FAQ summarizes the most important questions about the project scope, current limitations, and long-term direction.

The central idea is simple: ioBroker Energy Optimizer should become trustworthy step by step.

> **Understand → Recommend → Plan → Automate**

## Why another energy optimizer?

Many energy automations start with immediate device switching. This project deliberately starts earlier: it first tries to understand the energy system behind the numbers.

That means working with measurements, history, forecasts, predictions, priorities, and explainable recommendations before real-world actions are considered.

## Is this adapter already controlling devices?

No. The current runtime is read-only with respect to external devices and foreign ioBroker states.

It does not switch devices, schedule loads, or execute optimization actions.

Long term, the project may help plan and control device behavior — but only after explicit user approval, clear safety rules, validation, and transparent explanations.

## Why is it read-only first?

Because a useful recommendation is not the same as a safe real-world action.

A home energy system needs trust before automation. The project therefore separates analysis, prediction, evaluation, recommendation, planning, and later device behavior into distinct steps.

This makes it easier to review each milestone, validate behavior, and avoid unsafe shortcuts.

## What is the long-term path of the project?

The long-term path is:

1. **Understand** energy data, household behavior, forecasts, and constraints.
2. **Recommend** useful actions without changing runtime behavior.
3. **Plan** future actions safely and transparently.
4. **Automate** only after explicit approval, safety checks, and clear boundaries.

This is why the project does not treat automation as the first milestone. Automation is the final step after the system has earned enough context and trust.

## Why vendor-neutral?

Home energy systems often combine multiple brands, protocols, and adapters.

The core therefore models physical energy behavior instead of depending on a single vendor API. This should make the optimizer more flexible, easier to extend, and less tied to one ecosystem.

## What are Pattern-based Virtual Energy Assets?

They are a planned knowledge concept.

A future Pattern Recognition Engine may detect recurring energy behavior from history. For example, it may learn when a device usually runs, when surplus energy often appears, or when a household pattern repeats.

Detected patterns remain hypotheses until the user confirms them. Confirmed patterns may then become virtual energy assets that improve prediction, recommendations, and later planning.

## Why is historical data important?

Live values only show what is happening right now. Historical data can show what usually happens.

That can reveal recurring behavior, seasonal patterns, data quality, forecast reliability, and likely future loads. In practice, this can make recommendations more useful than decisions based only on the current live value.

## Will it support dynamic tariffs?

Dynamic tariffs are planned through provider integration and richer cost models.

The current runtime supports fixed-tariff import-cost calculation. Future tariff support should remain behind neutral provider boundaries so the optimizer does not depend on one specific tariff service.

## What is the History Service?

The History Service is the planned boundary for historical energy data.

For users, it can be thought of as the project's memory: it should help collect, aggregate, store, and query past observations so future recommendations can be based on more than a single moment.

It is intended to support prediction, diagnostics, simulation, visualization, and optimization.

## What is the Simulation Runtime?

The current Simulation Runtime is a narrow read-only runtime integration.

It publishes diagnostics and recommendation output without controlling devices. Its purpose is to make recommendation behavior visible and testable while keeping the live system safe.

## What is the planned Simulation Framework?

The planned Simulation Framework is a broader future capability.

It may support replay, controlled time, scenarios, benchmarks, demonstration mode, generated sample data, and regression testing.

For users and developers, the important point is that future behavior should be tested and explained before it affects a real household.

## Can users rely on current state names?

Existing public states and legacy configuration fields are treated as compatibility contracts.

Changes require explicit migration decisions. This helps protect existing users while the internal architecture evolves.

## Who is the project for?

The project is for ioBroker users and developers who want transparent, gradual, and safe home-energy optimization rather than opaque automation logic.

It is especially relevant for people who want to understand their energy flows first, receive explainable recommendations next, and only later consider safe planning or automation.

---

For the complete story, return to the [project overview](README.md) or revisit the [roadmap](ROADMAP.md) to see how the project moves from understanding toward safe future automation.
