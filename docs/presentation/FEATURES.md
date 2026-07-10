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

# Features

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

The Energy Optimizer is designed to grow in carefully validated steps.

It already provides a read-only analytical foundation for understanding energy flows in an ioBroker system. Information interpretation, history, prediction, simulation, planning, and automation are built on top of this foundation step by step.

This page describes features as scenarios: what the optimizer can already help with today, what is prepared in the domain architecture, and what the long-term product is intended to achieve.

![Optimization pipeline](assets/pipeline.svg)

> **Design rule**
>
> Features are documented as implemented only when they exist in runtime or domain code. Planned capabilities are marked separately.
>
> The long-term direction remains: **understand first, recommend next, plan carefully, and only then automate trusted device behavior.**

## Interpret available energy information

The optimizer should not depend on a fixed list of adapters or manufacturers. It should depend on understandable information such as grid power, photovoltaic generation, battery state, tariffs, weather, target times, and limits.

**Available today**

- read configured numeric ioBroker source states;
- tolerate missing, empty, or non-numeric values without crashing;
- normalize legacy configuration into neutral energy-system inputs;
- publish health and configuration status.

**Planned capabilities**

- an Information Interpreter for meaning, units, sign conventions, time semantics, freshness, and quality;
- stable alias or source-binding guidance;
- an information-type catalog;
- minimum, recommended, and reference-system information profiles;
- configurable import/export direction for signed grid-power sources.

## Understand the home energy system

The first runtime job is to build a reliable picture of the current energy situation before attempting higher-level decisions.

**Available today**

- mirror grid, house, photovoltaic, and battery values into adapter-owned states;
- calculate deterministic energy-system snapshots;
- expose source completeness and health information;
- derive current analysis values without writing to foreign adapter states.

**Planned capabilities**

- richer heterogeneous Energy Asset models;
- explicit Context Information such as weather, tariffs, calendars, occupancy, solar position, and grid restrictions;
- clearer separation between physical capabilities and decision context.

## Track energy and cost development

A useful optimizer must understand what current power flows mean over time.

**Available today**

- calculate interval-based grid-import energy;
- accumulate daily fixed-tariff import costs;
- accumulate monthly fixed-tariff import costs.

**Planned capabilities**

- richer cost models;
- dynamic tariff support;
- tariff and price changes over time;
- feed-in tariff awareness;
- import and export valuation;
- optional battery-wear and opportunity-cost modelling;
- cost forecasts and later validation against observed results.

## Build reusable history

Live values are only snapshots. Historical observations should become reusable evidence for prediction, diagnostics, simulation, and later optimization.

**Architecture prepared**

- typed historical metrics;
- deterministic multi-resolution aggregation;
- quality and coverage metadata;
- backend-neutral repository boundaries;
- explicit separation between history and forecast.

**Planned capabilities**

- bootstrap from existing SQL, History Adapter, InfluxDB, or other repository data;
- configurable retention and resolution policies;
- historical comparison of forecast and reality;
- reusable evidence for pattern recognition and profile calibration.

## Forecast and predict what happens next

Future optimization depends on more than current state.

The project keeps two concepts separate:

- **Forecast** describes externally expected future conditions.
- **Prediction** describes what is likely to happen in the concrete household system.

**Available today**

- forecast abstraction in the domain layer;
- prediction foundations;
- configurable resolution and horizon;
- reusable time-series merging;
- deterministic optimizer-input construction.

**Planned capabilities**

- provider integrations for forecast, tariff, weather, calendar, and other context information;
- prediction calibrated by history and observed asset behavior;
- quality, uncertainty, and fallback information;
- comparison between predicted and observed behavior.

## Learn explainable asset behavior

The project does not require black-box learning to improve over time.

A future asset may begin with a generic standard profile or an initial profile derived from existing history. Observations can then calibrate duration, energy demand, phases, flexibility, and uncertainty.

**Planned capabilities**

- generic standard profiles;
- bootstrap from existing smart-plug and history data;
- calibrated asset-specific profiles;
- explainable confidence and variance;
- pattern hypotheses that remain uncertain until confirmed;
- user-confirmed Pattern-based Virtual Energy Assets.

## Evaluate possible decisions

Before the optimizer recommends or automates anything, it must compare alternatives safely and deterministically.

**Available today**

- analysis foundations;
- situation evaluation foundations;
- deterministic recommendation generation;
- dormant planning semantics;
- read-only simulation diagnostics.

**Planned capabilities**

- first-class simulation, replay, scenarios, benchmarks, and demo mode;
- complete parameter-system evaluation instead of isolated parameter changes;
- richer efficiency and degradation models;
- explicit KPIs, goals, target values, priorities, constraints, and preferences;
- transparent comparison of alternative strategies.

## Recommend better actions

Recommendations are the trust-building step between understanding and action.

The optimizer should explain what it sees, what it expects, which goal is relevant, which limits apply, and why a particular option is useful.

**Available today**

- structured read-only recommendation output;
- deterministic recommendation foundations;
- source-completeness and health information for validation.

**Planned capabilities**

- user-facing recommendation scenarios;
- recommendation confidence and quality metadata;
- traceable explanations based on measurements, history, forecasts, predictions, goals, and constraints;
- comparison of alternative recommendations;
- later validation of whether a recommendation had the expected effect.

## Plan desired outcomes

The long-term product should not require users to define only fixed switching times.

A user may instead describe a desired result such as:

- washing finished by a target time;
- an electric vehicle charged before departure;
- a room or hot-water store within a comfort range;
- a battery reserve preserved at sunset.

**Architecture prepared**

- neutral recommendation intent;
- dormant ExecutionPlanner foundations;
- capability, time-window, physical-limit, conflict, and expiry semantics.

**Planned capabilities**

- a stable domain term for goal-oriented user requests;
- flexible start and completion windows;
- hard constraints, soft constraints, and preferences;
- capability-aware planning;
- explainable blocked and feasible plans.

## Coordinate energy assets

The long-term product is intended to coordinate heterogeneous physical assets and flexibility.

Possible assets include photovoltaic systems, batteries, flexible household consumers, thermal storage, heat pumps, electric vehicles, and controllable chargers.

**Available today**

- generic Energy Asset foundations;
- normalized configuration foundations;
- deterministic and testable domain components.

**Planned capabilities**

- battery-aware optimization;
- flexible-load planning;
- photovoltaic surplus use;
- thermal storage and building-inertia modelling;
- heat-pump and hot-water optimization;
- electric-vehicle charging;
- future vehicle-to-home and vehicle-to-grid concepts;
- explicit asset capabilities and controllability boundaries.

## Prepare trusted automation

Automatic device control is an explicit long-term goal, but it is not a current runtime feature.

**Not current runtime features**

- automatic device control;
- appliance scheduling;
- direct vendor-cloud control;
- writes to third-party ioBroker adapter states;
- autonomous optimization actions.

**Long-term direction**

- separately approved execution integrations;
- transparent planning before control;
- user approval and manual override paths;
- runtime safety and conflict checks;
- measurement and re-evaluation after actions;
- safe coordination of controllable Energy Assets.

The guiding principle remains:

> **Understand → Recommend → Plan → Automate**

---

Next: read the [Use Cases](USE_CASES.md) to see how these capabilities translate into realistic everyday scenarios for a home energy system.