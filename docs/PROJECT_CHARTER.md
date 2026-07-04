# Project Charter

## Project vision

`ioBroker.energyoptimizer` provides a safe, understandable foundation for monitoring household energy flows, calculating energy costs, and developing optimization recommendations. It should remain adapter-neutral and provider-based so installations can supply data from existing ioBroker states without coupling the optimizer to specific devices, vendors, or source adapters.

## Scope

Current scope:

- Read configured grid, house, PV, and battery states.
- Mirror validated live values into adapter states.
- Calculate fixed-tariff grid-import costs.
- Provide domain models and extension points for forecasts and optimization.

Device control, external API integrations, and autonomous actions are out of scope unless explicitly approved and designed.

## Architecture principles

- Keep domain models, tariff calculations, and optimizer logic independent of ioBroker.
- Keep ioBroker-specific code outside the optimizer core and behind provider or state-management abstractions.
- Depend on interfaces at integration boundaries; avoid dependencies on specific source adapters.
- Keep lifecycle and orchestration in `main.ts`, infrastructure adapters in `src/lib`, and core decisions deterministic.
- Centralize adapter state identifiers and preserve their public contract.

## Coding principles

- Prefer small, single-purpose modules and plain, strict TypeScript.
- Keep calculations explicit, deterministic, and independently testable.
- Handle missing or invalid external data safely.
- Preserve existing state IDs, native configuration names, units, logging, polling, and rounding.
- Do not add speculative functionality to structural changes.
- Behavior changes require explicit approval.

## Git and commit rules

- Work on a focused branch and keep commits small and coherent.
- Use clear conventional commit subjects where practical.
- Do not mix refactoring, behavior changes, and unrelated formatting.
- Review the complete diff before committing; never overwrite unrelated work.

## Definition of Done

A change is done when:

- Its acceptance criteria are met without unapproved behavior changes.
- TypeScript remains strict-compatible and the TypeScript build passes.
- `git diff --check` passes.
- Relevant documentation and tests are updated when applicable.
- State IDs, configuration compatibility, logging, calculations, and runtime effects have been reviewed.

## Review checklist

- Is the change within the agreed scope?
- Is optimizer-core code free of ioBroker-specific types and APIs?
- Are external sources accessed through provider abstractions?
- Are state IDs and native config names unchanged unless explicitly approved?
- Are polling, logging, calculations, units, and rounding preserved?
- Are failure and missing-data paths safe?
- Did the TypeScript build and `git diff --check` pass?

## Current supported reference setup

The reference setup uses existing ioBroker numeric states for grid import/export power, house consumption, PV production, battery state of charge, and battery power. A fixed work price and monthly base price are configured locally, with polling every 60 seconds by default. The adapter mirrors live values and accumulates fixed-tariff import costs; it does not call external APIs or control devices.

## Future extension points

- Provider-based weather and PV forecasts from configured ioBroker states.
- Variable tariff providers.
- Historical aggregation and counter reset policies.
- Adapter-neutral optimization strategies using the domain model.
- Simulation and recommendation outputs.
- Explicitly approved device-control providers with safety boundaries.
