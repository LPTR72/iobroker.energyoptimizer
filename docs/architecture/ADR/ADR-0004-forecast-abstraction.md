# ADR-0004: Forecast abstraction

## Status

Accepted

## Context

Forecasts may eventually come from multiple weather, PV, tariff, history, or manual sources. The core must not depend on a concrete provider.

## Decision

Define provider-independent `EnergyForecast`, forecast-point models, `ForecastProvider`, and `ForecastProviderResult` before implementing concrete integrations.

## Consequences

Prediction consumes one neutral contract, and providers can be replaced or combined. Concrete authentication, transport, and source-specific errors remain infrastructure concerns.
