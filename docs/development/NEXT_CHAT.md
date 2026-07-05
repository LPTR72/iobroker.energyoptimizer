# NEXT_CHAT

## Purpose

This document is the mandatory starting point for every new ChatGPT/Codex development session. It summarizes the current project state, identifies the immediate task, and links to the canonical documentation that governs architecture and development.

## Repository Status

- **Active branch:** `refactor/core-architecture`
- **Latest important commits:**
  - `d6b9d9f Update architecture documentation`
  - `84aa3b9 Add npm lockfile`
  - `77781fb Add configurable prediction timing`
  - `67ed772 Add neutral optimization domain models`
  - `1666783 Add prediction engine`
  - `ac0c0fe Add forecast provider abstraction`
  - `1b0b7aa Add neutral energy analysis engine`
  - `b35dbd3 feat(health): expose normalized asset counts`
- **Build:** passing
- **Tests:** `npm test` passing
- **Dependencies:** `npm install` works and `package-lock.json` exists
- **Environment:** the local developer environment is fully configured

## Current Architecture

Implemented foundations:

- Generic Asset Model
- Configuration Normalizer
- `EnergySystemFactory`
- `OptimizerInputFactory`
- `AnalysisEngine`
- Forecast abstraction
- `PredictionEngine`
- configurable `PredictionOptions`
- `TimeSeriesMerger`
- neutral optimization models
- asset health and normalized-asset counters

The runtime adapter still only mirrors states and calculates fixed tariffs. The new optimization pipeline is intentionally **not** connected to polling yet.

## Architecture Philosophy

The optimization core models a physical energy system. ioBroker, EcoFlow, Tibber, MQTT, Shelly, Anker, and similar systems are integrations around that core. Core models and engines must remain deterministic, vendor-neutral, runtime-independent, and independently testable.

See [Architecture](../architecture/ARCHITECTURE.md), [Domain model](../architecture/DOMAIN_MODEL.md), and [Optimization models](../architecture/OPTIMIZATION_MODELS.md).

## Current Roadmap

Completed:

- Analysis
- Forecast
- Prediction
- Configurable prediction timing
- Neutral optimization models

Next planned architecture work:

1. Timing architecture refinement
2. Physical energy model
3. Efficiency model
4. Cost model
5. `EvaluationEngine`
6. `RecommendationEngine`
7. `ExecutionPlanner`
8. Runtime integration

Timing, efficiency, cost, and goal models are architectural commitments; they are not implemented runtime functionality. See the [project roadmap](../roadmap/ROADMAP.md) for the broader sequence.

## Open Design Decisions

- Timing architecture: relationships among sampling, prediction, evaluation, and planning time scales
- Physical model: energy flows, storage, conversion, boundaries, and units
- Efficiency model: charge, discharge, inverter, conversion, roundtrip, and standby losses
- Cost model: import price, feed-in tariff, degradation, and opportunity costs
- Evaluation strategy: situation rules, confidence, severity, cadence, and deterministic handling of incomplete data

## Immediate Next Task

1. Design the complete timing architecture before implementing the `EvaluationEngine`.

## Validation

```bash
npm install
npm run build
npm test
git diff --check
git status
```

## Session Workflow

```text
ChatGPT
  ↓
Codex
  ↓
Git
  ↓
GitHub
  ↓
ioBroker Test Server
  ↓
Validation
  ↓
Production
```

See the [development workflow](WORKFLOW.md) for responsibilities and promotion rules.

## References

- [Documentation index](../README.md)
- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [Optimization models](../architecture/OPTIMIZATION_MODELS.md)
- [Architecture decisions](../architecture/DECISIONS.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Developer guide](DEVELOPER_GUIDE.md)
- [Testing](TESTING.md)
- [Development workflow](WORKFLOW.md)
