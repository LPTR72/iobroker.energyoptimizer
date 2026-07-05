# Roadmap

## Phase 1 — Foundation — done

- Adapter lifecycle, polling, state management, fixed-tariff calculation
- State-provider abstraction and centralized state definitions
- Generic assets, configuration normalization, factories, and health states

## Phase 2 — Domain intelligence — in progress

- Analysis
- Forecast abstraction
- Prediction, configurable prediction timing, and time-series merging
- Neutral optimization domain models

Architecture foundations for separate timing concepts and future efficiency, cost, and priority semantics are documented in [Optimization models](../architecture/OPTIMIZATION_MODELS.md). Their downstream evaluation logic remains planned.

## Phase 3 — Evaluation and recommendation — planned

- `EvaluationEngine`
- `RecommendationEngine`
- Evaluation-resolution policy

## Phase 4 — Planning — planned

- `ExecutionPlanner`
- Capability matching and constraint enforcement

## Phase 5 — Integrations — planned

- Forecast.Solar provider
- Tibber provider
- History provider
- Weather provider

## Phase 6 — Device execution — planned and approval-gated

- EcoFlow
- Shelly
- Zigbee
- Matter
- MQTT
- Modbus
- EVCC

Additional operational work includes daily/monthly reset policies, optional base-price allocation, historical aggregation, variable tariffs, simulations, and CI improvements.

Future core modeling also includes neutral asset efficiency and loss characteristics, richer import/export cost accounting, battery degradation and opportunity costs, and deterministic resolution of competing optimization goals. These are architecture commitments, not implemented features.
