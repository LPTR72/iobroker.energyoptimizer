# Architecture

## Overview

The project follows a Clean Architecture style. Stable domain models and deterministic engines sit at the center, while ioBroker lifecycle, state access, providers, and later device behavior remain boundary concerns.

The core models the physical energy system rather than any particular automation platform, vendor, protocol, or cloud service.

## Implemented foundations

- Adapter lifecycle and polling
- State-provider abstraction
- State management, state definitions, tariff calculation, and health reporting
- Generic energy assets and configuration normalization
- Energy-system and optimizer-input factories
- Analysis, forecast abstraction, prediction, evaluation, and recommendation foundations
- Read-only simulation runtime integration
- Structured read-only recommendation projection
- Dormant planning-domain semantics
- History Service domain foundation, pending review closure

## Planned components

- Forecast, tariff, and weather providers
- History Service runtime integration
- Pattern Recognition Engine
- Pattern-based Virtual Energy Assets / Knowledge Model
- First-class Simulation Framework
- Separately approved device-behavior integrations

## Boundaries

The domain layer contains models and pure calculations. It should remain independent from ioBroker object IDs, adapter lifecycle APIs, logging APIs, concrete vendors, and transport protocols.

The provider layer translates external data into neutral domain models. The planned History Service owns past observations and temporal context behind its own boundary. Adapter runtime code manages lifecycle, polling, state mirroring, and orchestration.

## History Service

The History Service is the planned historical-data platform for typed metrics, aggregation, quality metadata, retention, temporal context, and repository abstraction.

Prediction, diagnostics, simulation, visualization, and optimization may later consume this data.

See [ADR-0012](ADR/ADR-0012-history-service.md).

## Pattern-based Virtual Energy Assets

Long-term pattern recognition consumes History Service data and produces device-neutral hypotheses. Only user-confirmed hypotheses may become persistent Pattern-based Virtual Energy Assets.

See [ADR-0013](ADR/ADR-0013-pattern-based-virtual-energy-assets.md).

## Simulation

The current Simulation Runtime is a narrow read-only runtime integration. The planned Simulation Framework is a later capability for replay, scenarios, benchmarks, demonstrations, accelerated time, and regression testing.

See [ADR-0014](ADR/ADR-0014-simulation-framework.md).

## Compatibility

Legacy native source fields, public state IDs, fixed-tariff calculations, polling, logging, and rounding remain compatibility contracts.
