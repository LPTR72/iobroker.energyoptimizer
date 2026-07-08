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

**Document status:** Public presentation, version 2.1, updated 2026-07-08.

Energy optimization usually does not start with automation.

A household first needs to understand where energy comes from, where it goes, and which decisions would be safe and useful. The project therefore follows a gradual path:

**Understand → Recommend → Plan → Automate**

The current runtime focuses on understanding energy flow, calculating simple import costs, and publishing read-only recommendation data. Planning and device behavior are part of the long-term direction, but remain explicit, approval-gated capabilities.

![History Service](assets/history.svg)

> **Current runtime scope**
>
> These use cases describe both current read-only behavior and future direction. Device behavior remains planned and approval-gated.

## 1. Understand current energy flow

A household may already have several useful ioBroker states: grid power, house consumption, photovoltaic production, battery values, or smart meter data.

The adapter connects these values, mirrors them into a consistent adapter-owned state tree, and reports whether the configured sources are usable. This gives users a clearer picture before any optimization logic is applied.

## 2. Track simple import costs

A user may want to know how much grid import costs today or this month.

With a fixed work price, the adapter can estimate interval-based grid-import energy and accumulate daily and monthly import costs. This is intentionally simple and transparent. More advanced tariff handling remains planned.

## 3. Evaluate the current energy situation

A sunny afternoon, a cloudy winter day, or a battery-heavy evening all create different energy situations.

The domain model can represent whether the household currently has surplus power, grid import, battery context, or other relevant energy conditions. This creates the foundation for later recommendations and planning decisions.

## 4. Publish read-only recommendations

Before an optimizer should ever control devices, users and developers need to see what it would recommend.

The current read-only simulation pipeline can publish recommendation data without applying it to devices. This makes optimizer behavior inspectable, testable, and safe while the project is still building toward later automation.

## 5. Prepare historical learning

Energy decisions become more useful when the system can learn from past observations.

The History Service direction is intended to collect and aggregate past observations through a clear boundary. Future consumers may use historical context for better predictions, diagnostics, pattern recognition, simulation, and optimization.

## 6. Support future flexible loads

Some household loads do not always need to run immediately.

Future versions may recommend or plan actions for flexible loads such as washing machines, dishwashers, heating-related loads, pumps, or chargers. The long-term goal is not only to understand energy behavior, but also to help decide when controllable devices should run.

The current project does not apply such actions. Device behavior remains planned, explicit, and approval-gated.

## 7. Compare optimization strategies

Different households, seasons, tariffs, and battery constraints can lead to different optimization strategies.

A future Simulation Framework may allow replaying scenarios, testing strategy changes, and comparing behavior across benchmark cases without depending on live hardware.

![Simulation](assets/simulation.svg)

Possible examples include sunny days, cloudy days, winter operation, dynamic tariffs, battery constraints, and flexible appliance windows.

## 8. Keep vendor choice open

A useful energy optimizer should not depend on one device vendor or one integration path.

The project avoids binding the core model to one vendor. EcoFlow, Shelly, Zigbee, Matter, MQTT, Modbus, EVCC, tariff providers, weather services, and forecast providers belong at integration boundaries.

This makes the architecture suitable for gradual, replaceable integrations.

These use cases require an architecture that keeps the domain model independent from vendors, devices, and transport protocols.

---

Next: read the [Architecture Overview](ARCHITECTURE_OVERVIEW.md) to see how the project keeps these use cases vendor-neutral and safely separated from device control.
