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

# Use Cases

The project is designed for households that want to understand and improve their energy behavior in ioBroker.

> **Current runtime scope**
>
> These use cases describe both current read-only behavior and future direction. Device execution remains planned and approval-gated.

## 1. Understand current energy flow

A user can connect existing ioBroker states for grid power, house consumption, photovoltaic production, and battery values.

The adapter mirrors these values into a consistent adapter-owned state tree and reports whether the configured sources are usable.

## 2. Track simple import costs

With a fixed work price, the adapter can estimate interval-based grid-import energy and accumulate daily and monthly import costs.

This is intentionally simple and transparent. More advanced tariff handling remains planned.

## 3. Evaluate the current energy situation

The domain model can represent whether the household currently has surplus power, grid import, battery context, or other relevant energy conditions.

This is the foundation for future optimization decisions.

## 4. Publish read-only recommendations

The current read-only simulation pipeline can produce recommendation data without executing it.

This allows users and developers to inspect optimizer behavior before any device-control capability exists.

## 5. Prepare historical learning

The History Service direction is intended to collect and aggregate past observations through a clear boundary.

Future consumers may use historical context for better predictions, diagnostics, pattern recognition, simulation, and optimization.

## 6. Support future flexible loads

Future versions may recommend or plan actions for flexible loads such as washing machines, dishwashers, heating-related loads, pumps, or chargers.

The current project does not execute such actions. Execution remains approval-gated.

## 7. Compare optimization strategies

A future Simulation Framework may allow replaying scenarios, testing strategy changes, and comparing behavior across benchmark cases without depending on live hardware.

Possible examples include sunny days, cloudy days, winter operation, dynamic tariffs, battery constraints, and flexible appliance windows.

## 8. Keep vendor choice open

The project avoids binding the core model to one vendor. EcoFlow, Shelly, Zigbee, Matter, MQTT, Modbus, EVCC, tariff providers, weather services, and forecast providers belong at integration boundaries.

This makes the architecture suitable for gradual, replaceable integrations.
