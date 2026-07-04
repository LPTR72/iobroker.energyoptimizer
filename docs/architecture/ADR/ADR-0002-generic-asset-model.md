# ADR-0002: Generic asset model

## Status

Accepted

## Context

Energy installations contain heterogeneous grids, PV systems, batteries, consumers, and future controllable devices. Vendor-specific models would prevent gradual migration and reuse.

## Decision

Represent heterogeneous components as generic energy assets. Preserve existing grid, PV, battery, and house compatibility views and normalize legacy configuration into asset configuration.

## Consequences

Factories can support legacy and asset-based setups together. New asset types can be introduced without vendor coupling, while compatibility views must remain coherent during migration.
