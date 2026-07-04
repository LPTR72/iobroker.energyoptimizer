# Developer guide

## Setup and build

```bash
npm install
npm run build
npm test
```

The TypeScript project is strict. Keep modules small, explicit, deterministic, and independently testable.

## Adding domain models

Place neutral contracts in focused files under `src/lib`. Reuse existing domain types, prefer readonly collections, avoid infrastructure imports, and add contract or behavior tests under `test/`.

## Adding engines

An engine should accept domain inputs and return domain outputs without I/O. Define edge-case semantics, handle incomplete data safely, avoid hidden global state, and test normal, missing, zero, and multi-asset cases. Do not wire a new engine into polling as part of its initial domain implementation.

## Adding providers

Implement the relevant neutral provider interface at the infrastructure boundary. Translate provider data into domain models, report missing/invalid data clearly, and keep concrete API or ioBroker details out of engines. Add provider-specific configuration only when that integration is intentionally introduced.

## Runtime separation

`main.ts` owns lifecycle, timers, and orchestration. ioBroker state access belongs in infrastructure classes such as `IoBrokerStateProvider` and `StateManager`. Core analysis, forecasting, prediction, evaluation, recommendation, and planning must remain ioBroker-independent.

## Current operational contract

The adapter reads six legacy source fields or normalized assets, mirrors live values, and calculates fixed-tariff import costs. Preserve public states, config names, units, default 60-second polling, logging, calculations, and rounding unless explicit approval says otherwise.

## Commits

Prefer small Conventional Commit-style changes, for example `feat(core): add evaluation engine` or `docs: restructure architecture documentation`. Do not mix unrelated changes. Review and validate before committing.
