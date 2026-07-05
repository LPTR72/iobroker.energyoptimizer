<p align="center">
  <img src="docs/images/Logo_Large.png"
       alt="ioBroker Energy Optimizer"
       width="820">
</p>

<h1 align="center">
ioBroker Energy Optimizer
</h1>

<p align="center">
<strong>Modular Energy Management Platform for ioBroker</strong>
</p>

<p align="center">
Analyze • Predict • Optimize • Execute
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/node-22-green">
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-5.x-blue">
  <img alt="Tests" src="https://img.shields.io/badge/tests-passing-success">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">
</p>

`ioBroker.energyoptimizer` is evolving from a safe energy-data adapter into a modular platform designed to analyze, forecast, evaluate, recommend, and eventually execute energy optimization strategies. Its core models a physical energy system and remains independent from ioBroker, source adapters, protocols, and device vendors.

## Key principles

- Clean Architecture and domain-first design
- ioBroker-independent business logic
- Forecast and provider abstractions
- Device-independent recommendations
- Strict separation between recommendations and execution
- Explicit approval for runtime behavior changes

## Current status

Implemented domain foundations currently include generic assets and normalization, energy-system and optimizer-input factories, `AnalysisEngine` and `EnergyAnalysis`, the forecast abstraction and `EnergyForecast`, `PredictionEngine`, configurable `PredictionOptions`, `EnergyPrediction`, `TimeSeriesMerger`, and neutral optimization models for situations, recommendations, execution plans/actions, capabilities, constraints, and goals. Evaluation, recommendation, and execution-planning engines remain planned.

```text
EnergySystemState
  -> EnergyAnalysis
  -> EnergyForecast
  -> EnergyPrediction
  -> EnergySituation (model implemented; evaluation planned)
  -> Recommendation (model implemented; engine planned)
  -> ExecutionPlan (model implemented; planner planned)
  -> ExecutionAction (model implemented; execution approval-gated)
```

The active adapter still only reads configured states, mirrors live values, and calculates fixed-tariff import costs. It does not call external APIs or control devices.

## Current adapter behavior

- Polls configured numeric source states every `pollingIntervalSeconds` (default: `60`)
- Mirrors grid, house, PV, and battery values into `live.*`
- Handles missing, empty, or non-numeric values without crashing
- Calculates interval import energy and accumulates daily and monthly costs
- Preserves legacy source fields while supporting normalized energy assets internally

```text
kWh = importPowerW / 1000 * pollingIntervalSeconds / 3600
cost = kWh * fixedWorkPriceCt / 100
```

Public states include `info.connection`, `config.currentTariff.*`, `live.grid.*`, `live.house.consumptionPower`, `live.pv.power`, `live.battery.*`, `costs.today.currentTariffEuro`, `costs.month.currentTariffEuro`, `simulation.ready`, `optimizer.recommendation`, and health states.

Legacy native fields remain supported: `fixedWorkPriceCt`, `fixedBasePriceMonthlyEuro`, all six `source*` fields, and `pollingIntervalSeconds`.

## Documentation

- [Documentation index](docs/README.md)
- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Pipeline](docs/architecture/PIPELINE.md)
- [Domain model](docs/architecture/DOMAIN_MODEL.md)
- [Optimization models](docs/architecture/OPTIMIZATION_MODELS.md)
- [Architecture decisions](docs/architecture/DECISIONS.md)
- [Developer guide](docs/development/DEVELOPER_GUIDE.md)
- [Testing](docs/development/TESTING.md)
- [Workflow](docs/development/WORKFLOW.md)
- [Roadmap](docs/roadmap/ROADMAP.md)
- [Project status](docs/roadmap/PROJECT_STATUS.md)

## Development

```bash
npm install
npm run build
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes.

## Roadmap

The next planned milestone is `EvaluationEngine`, followed by `RecommendationEngine`, `ExecutionPlanner`, provider integrations, and explicitly approved device execution. See the [full roadmap](docs/roadmap/ROADMAP.md).

## License

MIT. See [LICENSE](LICENSE).
