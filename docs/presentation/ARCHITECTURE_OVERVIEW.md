# Architecture Overview

`ioBroker.energyoptimizer` follows a Clean Architecture style.

The core idea is simple: energy logic should not depend on ioBroker APIs, concrete vendors, cloud services, or device protocols. Those details belong at the edges of the system.

## Layer model

```text
ioBroker runtime / adapters / providers / devices
                 |
                 v
          integration boundaries
                 |
                 v
      deterministic domain components
```

## Domain core

The domain core contains models and pure calculations for:

- energy assets
- energy-system state
- analysis
- forecasts and predictions
- optimization situations
- evaluation
- recommendations
- execution plans and actions
- historical metrics and aggregation concepts

Domain components should be portable, testable, and independent from ioBroker object IDs or adapter lifecycle APIs.

## Runtime boundary

The ioBroker adapter runtime is responsible for:

- adapter lifecycle
- configuration access
- polling configured source states
- writing adapter-owned public states
- publishing diagnostics
- orchestrating approved read-only runtime components

It must not leak vendor-specific details into the domain model.

## Provider boundaries

Future providers may supply forecasts, tariffs, weather data, history, or execution capabilities.

Examples include photovoltaic forecast services, tariff APIs, weather sources, SQL history backends, device adapters, and protocol integrations.

The core should see these through neutral contracts rather than provider-specific data structures.

## History Service boundary

The planned History Service is the central boundary for past observations and temporal context.

Its responsibilities include typed metrics, samples, buckets, aggregation, quality metadata, retention policy, and repository abstraction. The preferred first persistence direction is to use existing ioBroker SQL infrastructure rather than an adapter-owned database.

## Execution boundary

Execution is intentionally separated from recommendations.

A recommendation may say what could be useful. An execution plan may describe what could be done. A future execution provider may translate an approved plan into real device operations.

This separation is a safety boundary. The current runtime does not control devices.

## Public object model

The adapter owns its own public ioBroker state namespace. Adapter-owned states may expose live values, costs, health, simulation diagnostics, and recommendation summaries.

Writes to foreign adapter states are not part of the current runtime behavior and require a separate approved execution milestone.
