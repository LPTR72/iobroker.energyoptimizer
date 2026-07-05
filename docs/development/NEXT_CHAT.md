# NEXT_CHAT

## Purpose

This document is the mandatory starting point for every new ChatGPT/Codex development session. It summarizes the validated project state, identifies the next milestone, and links to the canonical project documentation.

## Current Status

- Read-only `SimulationRuntime` completed in commit `03e4c57` (`Add read-only simulation runtime foundation`).
- Active branch: `refactor/core-architecture`.
- Build successful.
- Tests: 53/53 passing.
- `git diff --check` successful.
- Package installation and validation on the ioBroker test server successful.
- `energyoptimizer.0` starts cleanly; `health.configuredSources = 2` and logs show no new adapter errors.
- ADR-0008 records the read-only simulation-runtime decision.

## Architecture Status

The completed high-level pipeline is:

```text
ConfigurationNormalizer
  → Prediction
  → Evaluation
  → Recommendation
```

Implemented foundations include the Generic Asset Model, factories, `AnalysisEngine`, forecast abstraction, `PredictionEngine`, `PredictionOptions`, `TimeSeriesMerger`, neutral optimization models, `EvaluationEngine`, `EvaluationOptions`, `RecommendationEngine`, `RecommendationOptions`, and the dormant read-only `SimulationRuntime`.

All architecture components remain deterministic, runtime-independent, and fully unit-tested.

## Runtime Status

The production adapter runtime remains intentionally unchanged. `SimulationRuntime` is not connected to `main.ts`, polling, or ioBroker states:

- No scheduling.
- No execution.
- No device control.
- No VIS integration.
- The optimization pipeline is not connected to active polling.

## Development Decision

Simulation mode remains the default operating mode. The optimizer must first explain what it would do before it is ever allowed to control devices.

## Next Milestone

### Prepare read-only adapter integration

Prepare the separately review-gated adapter connection for the validated `SimulationRuntime`. The integration must remain explanatory and read-only.

Goals:

- Define and review the public recommendation-state contract and publication lifecycle.
- Connect the existing architecture to the adapter runtime only after that contract is accepted.
- Read real ioBroker source states.
- Execute the read-only pipeline:

  ```text
  ConfigurationNormalizer
    → Prediction
    → Evaluation
    → Recommendation
  ```

- Publish recommendation results into ioBroker states only.
- Make no runtime behavior changes outside the new recommendation states.

The completed simulation foundation reads a consistent source snapshot, runs the neutral pipeline in memory, and suppresses recommendations when configured sources are incomplete. The current implementation changes no ioBroker states.

Explicitly out of scope:

- Device switching or control.
- `ExecutionPlanner`.
- Scheduling.
- VIS implementation.

Expected visible states include examples such as:

- `recommendations.count`
- `recommendations.best.action`
- `recommendations.best.score`
- `recommendations.best.reason`
- `recommendations.json`

## Validation Workflow

For every relevant architecture milestone:

```bash
npm run build
npm test
git diff --check
npm pack
```

Install the package on the ioBroker test system and verify:

- The adapter starts cleanly.
- No unexpected log errors occur.
- Runtime behavior is unchanged except for the intended milestone.
- Health states remain valid.

## References

- [Documentation index](../README.md)
- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Domain model](../architecture/DOMAIN_MODEL.md)
- [Optimization models](../architecture/OPTIMIZATION_MODELS.md)
- [Architecture decisions](../architecture/DECISIONS.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
