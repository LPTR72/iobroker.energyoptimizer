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

# Use Cases

**Document status:** Public presentation, version 2.1, updated 2026-07-10.

Energy optimization usually does not start with automation.

A household first needs to understand which information is available, what it means, where energy comes from, where it goes, and which decisions would be safe and useful. The project therefore follows a gradual path:

**Understand → Recommend → Plan → Automate**

Most households already collect a surprising amount of useful data. The difficult part is turning adapter-specific states into stable information and then using that information to make explainable decisions.

The current runtime focuses on understanding energy flow, calculating simple import costs, and publishing read-only recommendation data. Planning and device behavior remain explicit, approval-gated capabilities.

> **Current runtime scope**
>
> These use cases describe both current read-only behavior and future direction. Device behavior remains planned and approval-gated.

## 1. Replace a device without redesigning the optimizer

A smart plug, meter, weather source, or battery integration may be replaced over time.

The preferred architecture keeps a stable alias or source binding and interprets the incoming value as a known information type. As long as the same semantic contract remains available, a change from one adapter or protocol to another should not require the energy model to be redesigned.

This is the practical benefit of supporting information instead of hardcoding adapter names.

## 2. Understand current energy flow

A household may already have grid power, house consumption, photovoltaic production, battery values, or smart-meter information.

The current adapter reads configured numeric sources, mirrors them into a consistent adapter-owned state tree, and reports whether those sources are usable. Future interpreter capabilities will make units, sign conventions, direction, time semantics, and data quality explicit at the system boundary.

## 3. Track import costs and later tariff changes

A user may want to know how much grid import costs today or this month.

With a fixed work price, the current runtime estimates interval-based grid-import energy and accumulates daily and monthly costs.

Future cost models should also support:

- tariff or price changes over time;
- dynamic prices;
- feed-in compensation;
- different import and export valuations;
- later comparison between predicted and observed costs.

## 4. Combine physical assets with decision context

A battery and a weather forecast have different roles.

The battery is an Energy Asset with physical state and capabilities. Weather, tariffs, calendars, occupancy, solar position, comfort limits, and grid restrictions are Context Information that can change which decision is best.

A useful optimization may therefore combine:

```text
Asset capability
  + current state
  + history
  + forecast
  + context
  + goal and constraints
  = explainable decision
```

## 5. Publish read-only recommendations

Before an optimizer controls devices, users and developers need to inspect what it would recommend and why.

The current read-only simulation path can publish recommendation data without applying it to devices. This makes behavior visible, testable, and safe while later planning and execution remain disconnected.

Future recommendations should explain:

- what was measured;
- what was forecast or predicted;
- which goal or target value was relevant;
- which constraints applied;
- which alternatives were compared;
- why the preferred option was selected.

## 6. Learn a washing-machine profile from existing history

A user may already have months of smart-plug data before installing the optimizer.

A future History Service could provide those observations to bootstrap an Asset Profile. A generic washing-machine profile may offer an initial expectation; existing local history can calibrate typical duration, energy demand, power phases, variance, and completion detection.

This allows useful prediction without pretending that an inferred pattern is automatically a confirmed device identity.

## 7. Finish a flexible load by a target time

A user may care more about the outcome than about a fixed switching time:

> The washing machine should be finished by 18:00.

The optimizer should eventually combine the expected program profile, photovoltaic forecast, tariff information, battery state, earliest start, latest completion, and user constraints.

It can then recommend or plan a feasible start window instead of blindly applying a static rule.

The current runtime does not schedule or start the appliance.

## 8. Preserve battery reserve for the evening

A household may want at least 30% state of charge available at sunset to cover evening or night demand.

Depending on user intent, this may be:

- a hard constraint that must not be violated;
- a target value the optimizer should aim for;
- a softer preference that may be traded against cost or comfort.

The distinction matters because the same number can represent different decision semantics.

## 9. Use thermal flexibility without reducing comfort

A building, room, hot-water store, or heating system may shift energy over time.

A future optimizer could use photovoltaic surplus or a low-price period to increase useful thermal storage while respecting temperature limits, target times, equipment capabilities, and comfort constraints.

The optimization concept is therefore broader than switching a heat pump on or off. It models useful flexibility within physical and user-defined boundaries.

## 10. Charge an electric vehicle before departure

A user may want the vehicle at 80% by 07:00 rather than charging immediately after arrival.

A future plan may consider:

- current state of charge;
- departure time;
- charging capability and limits;
- photovoltaic and tariff forecasts;
- household power limits;
- battery and comfort priorities;
- later vehicle-to-home or vehicle-to-grid possibilities.

The desired result is clear even when the best start time changes as conditions change.

## 11. Re-plan when conditions change

A forecast may change, a device may become unavailable, a grid restriction may apply, or actual consumption may differ from prediction.

The previous plan is not simply treated as broken. The feasible solution space has changed.

A future closed loop should:

```text
measure
  -> compare with expectation
  -> update state and prediction
  -> simulate alternatives
  -> revise recommendation or plan
```

This is the difference between a one-time switching rule and an optimization loop.

## 12. Compare strategies safely in simulation

Different households, seasons, tariffs, storage sizes, and constraints can favor different strategies.

A future Simulation Framework may replay historical situations, evaluate complete parameter systems, and compare strategy changes without depending on live hardware.

Possible examples include sunny days, cloudy days, winter operation, dynamic tariffs, battery reserves, flexible appliance windows, EV charging, and thermal storage.

## 13. Start with a minimal setup and improve later

The project's own smart home is a reference system, not a mandatory baseline.

One user may begin with only grid import and a fixed tariff. Another may have photovoltaic production, a battery, weather, calendar information, and extensive history.

Future documentation should distinguish:

- minimum required information;
- recommended information;
- optional enhancements;
- the project's richer reference system.

This allows the optimizer to remain useful without making one specific hardware or adapter combination mandatory.

---

Next: read the [Architecture Overview](ARCHITECTURE_OVERVIEW.md) to see how the project keeps these use cases information-centered, vendor-neutral, and safely separated from device control.