# Domain model

Domain objects are adapter-neutral data contracts. They may contain measurements, timestamps, identifiers, confidence, goals, and constraints. They must not contain ioBroker APIs, object-management logic, concrete adapter names, or device commands tied to a vendor. Entries marked planned describe the intended architecture, not implemented code.

- **EnergySystemState**: current normalized grid, PV, battery, house, and heterogeneous asset snapshot. Compatibility/aggregated views remain alongside preferred asset collections.
- **EnergyAnalysis**: derived facts about current consumption, PV production, battery flow, grid flow, surplus, deficit, self-use percentages, and asset availability.
- **EnergyForecast**: provider-neutral PV, consumption, price, and weather time series with generation and validity timestamps.
- **EnergyPrediction**: aligned prediction intervals with expected power balance, prices, battery state, and data-quality warnings.
- **EnergySituation (planned)**: an evaluated condition such as PV surplus, grid import, battery level, price period, or forecast uncertainty.
- **EnergyRecommendation (planned)**: device-independent advice, priority, reason, horizon, and related situations/assets.
- **ExecutionPlan (planned)**: a generated, status-bearing collection of execution actions and warnings.
- **ExecutionAction (planned)**: a neutral intended operation such as setting battery power, switching or scheduling a load, setting a feed-in limit, or doing nothing.
- **DeviceCapability (planned)**: declares what an asset can do and its power or duration bounds.
- **EnergyConstraint (planned)**: an enabled boundary such as feed-in power, battery SOC, quiet hours, cycling avoidance, or manual override.
- **OptimizationGoal (planned)**: an enabled, prioritized objective such as self-consumption, cost, comfort, battery protection, or feed-in compliance.

Models describe facts and intent. Providers acquire data; engines make deterministic transformations; execution adapters perform approved side effects.
