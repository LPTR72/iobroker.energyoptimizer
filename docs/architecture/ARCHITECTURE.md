# Architecture

## Overview

The project follows Clean Architecture: stable domain models and deterministic engines sit at the center, while ioBroker lifecycle, state access, providers, and eventual device execution remain boundary concerns. The core models the physical energy system rather than any particular automation platform, vendor, protocol, or cloud service.

## Implemented components

- Adapter lifecycle and polling orchestration in `main.ts`
- `IStateProvider` with ioBroker infrastructure implementation
- `StateManager`, centralized state definitions, tariff calculation, and health reporting
- Generic `EnergyAsset` model and `ConfigurationNormalizer`
- `EnergySystemFactory` and `OptimizerInputFactory`
- `AnalysisEngine` producing `EnergyAnalysis`
- `ForecastProvider` abstraction and neutral `EnergyForecast`
- `PredictionEngine`, reusable `TimeSeriesMerger`, and configurable `PredictionOptions`
- Neutral situations, recommendations, execution plans/actions, capabilities, constraints, and optimization goals under `src/lib/optimization`
- Pure `EvaluationEngine` with validated `EvaluationOptions`
- Pure `RecommendationEngine` with validated `RecommendationOptions`

## Planned components

- `ExecutionPlanner`
- Forecast, tariff, history, and weather provider implementations
- Capability-aware execution adapters with explicit safety controls

## Boundaries

The domain layer contains models and pure calculations. It must not know about ioBroker object IDs, adapter lifecycle APIs, logging APIs, concrete vendors, or transport protocols. The provider layer translates external data into neutral domain models. Adapter runtime code manages lifecycle, polling, state mirroring, and orchestration. The future execution layer translates approved plans into device operations.

ioBroker, EcoFlow, Tibber, MQTT, Shelly, Anker, and other platforms or products belong at integration boundaries. They may supply measurements, forecasts, tariffs, or execution capabilities, but the core represents these through physical assets and vendor-independent contracts.

This separation keeps engines deterministic, portable, and testable and prevents source-adapter or device details from leaking into optimization decisions.

The canonical definitions for the architecture's [timing, efficiency, cost, and priority/goal models](OPTIMIZATION_MODELS.md) are maintained separately so future engines use consistent physical and economic semantics.

## Compatibility

Legacy native source fields, public state IDs, fixed-tariff calculations, polling, logging, and rounding remain compatibility contracts. Structural work must not change them without explicit approval.

An older pipeline placeholder remains under `src/lib/analysis/AnalysisEngine.ts` and related pipeline directories. It is intentionally untouched until an explicit migration is designed; the current neutral engines live at `src/lib/AnalysisEngine.ts` and `src/lib/PredictionEngine.ts`.
