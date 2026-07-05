# NEXT_CHAT

## Purpose

This document is the mandatory starting point for every new ChatGPT/Codex development session. It summarizes the validated project state, identifies the next milestone, and links to the canonical project documentation.

## Current Status

- `RecommendationEngine` completed in commit `e02ff5e`.
- Active branch: `refactor/core-architecture`.
- Build successful.
- Tests: 49/49 passing.
- `git diff --check` successful.
- Documentation and ADR updated.
- `RecommendationEngine` intentionally has no runtime integration yet.

## Architecture Status

The completed high-level pipeline is:

```text
ConfigurationNormalizer
  → Prediction
  → Evaluation
  → Recommendation
```

Implemented foundations include the Generic Asset Model, factories, `AnalysisEngine`, forecast abstraction, `PredictionEngine`, `PredictionOptions`, `TimeSeriesMerger`, neutral optimization models, `EvaluationEngine`, `EvaluationOptions`, `RecommendationEngine`, and `RecommendationOptions`.

All architecture components remain deterministic, runtime-independent, and fully unit-tested.

## Runtime Status

The current adapter runtime is intentionally unchanged:

- No scheduling.
- No execution.
- No device control.
- No VIS integration.
- The optimization pipeline is not connected to active polling.

## Development Decision

Simulation mode remains the default operating mode. The optimizer must first explain what it would do before it is ever allowed to control devices.

## Next Milestone

### Simulation Runtime (read-only)

The first dormant orchestration path is implemented locally. It reads a consistent source snapshot, runs the neutral pipeline in memory, and suppresses recommendations when configured sources are incomplete. It is not connected to `main.ts` or polling. Local build and typecheck succeed, with 53/53 tests passing.

Goals:

- Connect the existing architecture to the adapter runtime.
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

Before activation, define and review the public recommendation-state contract and publication lifecycle. The current implementation changes no ioBroker states.

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
