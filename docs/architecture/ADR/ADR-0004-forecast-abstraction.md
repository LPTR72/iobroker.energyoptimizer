# ADR-0004: Forecast abstraction

## Status

Accepted

## Context

Forecasts may eventually come from multiple weather, PV, tariff, or manual sources. Historical observations and temporal context belong to the separate History Service defined by [ADR-0012](ADR-0012-history-service.md) rather than masquerading as forecasts.

## Decision

Define provider-independent `EnergyForecast`, forecast-point models, `ForecastProvider`, and `ForecastProviderResult` before implementing concrete integrations.

## Consequences

Prediction consumes one neutral contract, and providers can be replaced or combined. Concrete authentication, transport, and source-specific errors remain infrastructure concerns.
