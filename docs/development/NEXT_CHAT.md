# NEXT_CHAT

## Purpose

This document is the mandatory starting point for every new ChatGPT/Codex development session. It summarizes the current project state, identifies the immediate task, and links to the canonical documentation that governs architecture and development.

## Repository Status

- **Active branch:** `refactor/core-architecture`
- **Latest important commits:**
  - `a3341e2 feat: add neutral EvaluationEngine`
  - `58d4fe2 docs: update next chat after architecture validation`
  - `0aa855d docs: document ioBroker validation checkpoints`
  - `efeff34 docs: restore canonical project logo`
  - `9f7674f Make NEXT_CHAT the canonical session entry point`
  - `d6b9d9f Update architecture documentation`
  - `84aa3b9 Add npm lockfile`
  - `77781fb Add configurable prediction timing`
  - `67ed772 Add neutral optimization domain models`
  - `1666783 Add prediction engine`
  - `ac0c0fe Add forecast provider abstraction`
  - `1b0b7aa Add neutral energy analysis engine`
  - `b35dbd3 feat(health): expose normalized asset counts`
- **Build:** passing
- **Tests:** 43/43 passing
- **Dependencies:** `npm install` works and `package-lock.json` exists
- **Environment:** the local developer environment is fully configured

The latest completed milestone adds the neutral `EvaluationEngine` and configurable `EvaluationOptions`. `minimumRelevantPowerW` defaults to 20 W. The default cheap/high price thresholds are placeholder/demo values only, not recommended tariff values.

- **Repository validation:** build and all 43 tests completed successfully; the adapter package was created successfully.
- **ioBroker validation:** the package was installed on the test server; the adapter started successfully; polling, health states, and existing runtime behavior were verified.
- **Result:** no regressions were detected.

Runtime behavior remains unchanged. The new domain pipeline is still not integrated into active polling.

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
- `EvaluationEngine`
- configurable `EvaluationOptions` with a 20 W default relevance threshold
- `RecommendationEngine` and configurable `RecommendationOptions`
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
- Evaluation
- Recommendation

Timing, efficiency, cost, and goal models are architectural commitments; they are not implemented runtime functionality. See the [project roadmap](../roadmap/ROADMAP.md) for the broader sequence.

## Current Milestone Validation

The neutral `RecommendationEngine` is implemented locally:

- **Inputs:** `EnergySituation[]`, `OptimizationGoal[]`, and `OptimizationConstraint[]`
- **Output:** `Recommendation[]`
- **Local validation:** build and typecheck successful; 49/49 tests passing

Complete repository and ioBroker integration validation before starting another architecture milestone. `ExecutionPlanner`, runtime integration, device control, and VIS implementation remain explicitly out of scope.

## Validation

```bash
npm install
npm run build
npm test
git diff --check
git status
```

Every significant architecture milestone must complete both repository validation and ioBroker integration validation before development continues with the next milestone. See the [development workflow](WORKFLOW.md) for the full checkpoint.

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
