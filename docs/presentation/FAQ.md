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

## Why another energy optimizer?

Many energy automations focus on immediate device switching. This project focuses first on understanding the energy system: measurements, history, forecasts, predictions, priorities, and explainable recommendations.

## Is this adapter already controlling devices?

No. The current runtime is read-only with respect to external devices and foreign ioBroker states. It does not switch devices, schedule loads, or execute optimization actions.

## Why is it read-only first?

Because a useful recommendation is not the same as a safe real-world action. The project deliberately separates analysis, prediction, evaluation, recommendation, planning, and later device behavior.

## Why vendor-neutral?

Home energy systems often combine multiple brands, protocols, and adapters. The core therefore models physical energy behavior instead of depending on a single vendor API.

## What are Pattern-based Virtual Energy Assets?

They are a planned knowledge concept. A future Pattern Recognition Engine may detect recurring energy behavior from history. Detected patterns remain hypotheses until the user confirms them. Confirmed patterns may become virtual energy assets that improve prediction and optimization.

## Why is historical data important?

Historical data can reveal recurring behavior, seasonal patterns, data quality, and likely future loads. This can make recommendations more useful than decisions based only on the current live value.

## Will it support dynamic tariffs?

Dynamic tariffs are planned through provider integration and richer cost models. The current runtime supports fixed-tariff import-cost calculation.

## What is the History Service?

The History Service is the planned boundary for collecting, aggregating, storing, and querying historical energy data. It is intended to serve prediction, diagnostics, simulation, visualization, and optimization.

## What is the Simulation Runtime?

The current Simulation Runtime is a narrow read-only runtime integration that publishes diagnostics and recommendation output.

## What is the planned Simulation Framework?

The planned Simulation Framework is a broader future capability for replay, controlled time, scenarios, benchmarks, demonstration mode, generated sample data, and regression testing.

## Can users rely on current state names?

Existing public states and legacy configuration fields are treated as compatibility contracts. Changes require explicit migration decisions.

## Who is the project for?

The project is for ioBroker users and developers who want transparent, gradual, and safe home-energy optimization rather than opaque automation logic.
