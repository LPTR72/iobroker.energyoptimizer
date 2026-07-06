# Roadmap

## Phase 1 - Foundation - done

- Adapter lifecycle, polling, state management, fixed-tariff calculation
- State-provider abstraction and centralized state definitions
- Generic assets, configuration normalization, factories, and health states

## Phase 2 - Domain intelligence - done

- Analysis
- Forecast abstraction
- Prediction, configurable prediction timing, and time-series merging
- Neutral optimization domain models

Architecture foundations for separate timing concepts and future efficiency, cost, and priority semantics are documented in [Optimization models](../architecture/OPTIMIZATION_MODELS.md). Further physical and economic model refinement remains planned.

## Phase 3 - Evaluation and recommendation - done

- `EvaluationEngine` - implemented and validated
- `RecommendationEngine` - implemented and validated through the read-only runtime
- Structured read-only recommendation projection - implemented and ioBroker-validated
- Evaluation-resolution policy remains an architecture refinement

## Read-only simulation runtime - done

- Polling orchestration, diagnostic JSON publication, and structured recommendation states - implemented and validated on the ioBroker test server
- No scheduling, foreign-state writes, or device control

## Phase 4 - Planning - dormant semantics implemented

- Neutral, dormant `ExecutionPlanner` foundation - implemented and validated
- Conservative matching for unambiguous actions, capabilities, manual overrides, time windows, and battery-cycling constraints
- Feasible power, energy, duration, and state-of-charge ranges - implemented locally
- Time-window intersection, expiry, and opposite storage-action conflicts - implemented locally
- Live-state validation, setpoint selection, broader conflicts, scheduling, and execution safety remain planned
- No runtime integration or device control without a separate approved milestone

## Phase 5 - Integrations - planned

- Forecast.Solar provider
- Tibber provider
- History Service with Collector, Aggregator, and implementation-neutral Repository responsibilities
- Preferred initial repository implementation through the ioBroker SQL Adapter with MariaDB/MySQL
- Typed historical metrics, deterministic 1-minute-to-daily aggregation, quality metadata, hierarchical retention, and temporal context
- Weather provider

The History Service remains an open, likely multi-step epic covering collection, aggregation, repository integration, retention, quality, context, health, configuration, and consumer integration. The completed ADR/documentation milestone does not constitute functional implementation.

## Long-term pattern knowledge - planned

- Generic, device-neutral Pattern Recognition Engine over History Service data
- Pattern hypotheses that require user confirmation before becoming persistent virtual assets
- User enrichment with name, category, expected power, runtime, schedule, season, automation mode, conditions, priority, and flexibility
- Conditional patterns based on weather/dry days, temperature, tariffs, PV surplus, battery thresholds, or external ioBroker states
- Confirmed Pattern-based Virtual Energy Assets / Knowledge Model for Prediction, Cost Model, Battery Strategy, and Optimizer consumers
- Initial classes: Cyclic, Scheduled, Conditional, Seasonal, Daily, Baseload, Sequence, and Anomaly Pattern

This is a long-term architecture topic, not the next implementation task unless selected and explicitly approved later.

## Future UI scope - planned

- Possible configuration groups: Energy Assets, History & Storage, Context & Calendar, Forecast & Prediction, and Advanced / Diagnostics
- Per-asset History enabled, Target resolution, and Future retention policy settings
- Optional read-only ioBroker VIS widgets for generic Energy Assets
- Asset name, type, current power, state of charge, capacity, health/status, and optional capability indicators
- Neutral asset bindings only; no vendor-specific fields, device control, optimization actions, or new VIS-related runtime states without a separate approved implementation task

## Phase 6 - Device execution - planned and approval-gated

- EcoFlow
- Shelly
- Zigbee
- Matter
- MQTT
- Modbus
- EVCC

Additional operational work includes daily/monthly reset policies, optional base-price allocation, History Service implementation, variable tariffs, simulations, and CI improvements.

Future core modeling also includes neutral asset efficiency and loss characteristics, richer import/export cost accounting, battery degradation and opportunity costs, and deterministic resolution of competing optimization goals. These are architecture commitments, not implemented features.
