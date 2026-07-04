# Architecture

## Overview

The project follows Clean Architecture: stable domain models and deterministic engines sit at the center, while ioBroker lifecycle, state access, providers, and eventual device execution remain boundary concerns.

## Implemented components

- Adapter lifecycle and polling orchestration in `main.ts`
- `IStateProvider` with ioBroker infrastructure implementation
- `StateManager`, centralized state definitions, tariff calculation, and health reporting
- Generic `EnergyAsset` model and `ConfigurationNormalizer`
- `EnergySystemFactory` and `OptimizerInputFactory`
- `AnalysisEngine` producing `EnergyAnalysis`
- `ForecastProvider` abstraction and neutral `EnergyForecast`
- `PredictionEngine` and reusable `TimeSeriesMerger`

## Planned components

- Situation, recommendation, execution, capability, constraint, and goal models
- `EvaluationEngine`
- `RecommendationEngine`
- `ExecutionPlanner`
- Forecast, tariff, history, and weather provider implementations
- Capability-aware execution adapters with explicit safety controls

## Boundaries

The domain layer contains models and pure calculations. It must not know about ioBroker object IDs, adapter lifecycle APIs, logging APIs, or concrete vendors. The provider layer translates external data into neutral domain models. Adapter runtime code manages lifecycle, polling, state mirroring, and orchestration. The future execution layer translates approved plans into device operations.

This separation keeps engines deterministic, portable, and testable and prevents source-adapter or device details from leaking into optimization decisions.

## Compatibility

Legacy native source fields, public state IDs, fixed-tariff calculations, polling, logging, and rounding remain compatibility contracts. Structural work must not change them without explicit approval.

An older pipeline placeholder remains under `src/lib/analysis/AnalysisEngine.ts` and related pipeline directories. It is intentionally untouched until an explicit migration is designed; the current neutral engines live at `src/lib/AnalysisEngine.ts` and `src/lib/PredictionEngine.ts`.
