# Testing

Stand: 07.07.2026 16:27 Uhr

The project uses strict TypeScript compilation and Node's built-in test runner without an additional test framework.

Current tests cover:

- `AnalysisEngine`
- Forecast-provider abstraction contracts
- `PredictionEngine`
- Default, custom, and invalid `PredictionOptions`
- `EvaluationEngine` situation detection, the default 20 W relevance boundary, custom thresholds, and `EvaluationOptions` validation
- `RecommendationEngine` empty inputs, ranking, deterministic ordering, relevance, constraints, and input immutability
- `ExecutionPlanner` no-op, dormant and blocked plans, physical-limit intersection, time windows, expiry, future-effective opposite-action conflicts, deterministic output, validation, and input immutability
- `SimulationRuntime` surplus, deficit, neutral-threshold, and incomplete-source scenarios
- History Service domain foundation collection and aggregation for power, energy counters, state of charge, binary state, temperature, price, generic numbers, invalid samples, and resolution-chain guards
- `TimeSeriesMerger`
- Optimization domain models

Every change should run:

```bash
npm run build
npm test
git diff --check
git status
```

Add focused tests for success paths, missing or invalid values, zero values, multiple assets or timestamps, fallbacks, warnings, and boundary conditions. Runtime integrations require proportional integration testing on an ioBroker test installation.

Permanent ExecutionPlanner time-boundary coverage includes fully future horizons, partially elapsed but still valid horizons, fully expired horizons, expired opposing intent, and overlapping future opposing intent. Every produced action must start at or after `generatedAt`.

## Raspberry Pi and ioBroker object-structure regression

Every Raspberry Pi and ioBroker milestone validation must compare the complete adapter object structure before and after package installation.

Before installation:

```bash
iobroker object list "energyoptimizer.0.*" > /tmp/energyoptimizer-objects-before.txt
```

Install the newly built package and restart the adapter according to the deployment workflow. Then export the objects again:

```bash
iobroker object list "energyoptimizer.0.*" > /tmp/energyoptimizer-objects-after.txt
```

Compare both snapshots:

```bash
diff -u /tmp/energyoptimizer-objects-before.txt /tmp/energyoptimizer-objects-after.txt
```

Investigate every unexpected added, removed, or changed object. Intentional object changes must be explicitly documented as part of the milestone.
