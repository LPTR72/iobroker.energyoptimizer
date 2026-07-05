# NEXT_CHAT

## Purpose

This document is the mandatory starting point for every new ChatGPT/Codex development session. It summarizes the validated project state, identifies the next milestone, and links to the canonical project documentation.

## Current Status

- Read-only `SimulationRuntime` completed in commit `03e4c57` (`Add read-only simulation runtime foundation`).
- Dormant read-only `SimulationPublication` snapshot completed in commit `ae68093` (`Add dormant simulation publication snapshot`).
- Active branch: `refactor/core-architecture`.
- Local build successful.
- Local tests: 58/58 passing.
- `git diff --check` successful.
- Push to GitHub successful.
- The Raspberry Pi pulled the GitHub revision and passed build, 58/58 tests, and `npm pack`.
- ioBroker installation and regression validation successful.
- `health.lastPollingTimestamp` updates normally, while `optimizer.recommendation` remains `collecting data` and `simulation.ready` remains `false`.
- ADR-0008 records the read-only simulation-runtime decision.

## Architecture Status

The completed high-level pipeline is:

```text
ConfigurationNormalizer
  → Prediction
  → Evaluation
  → Recommendation
```

Implemented foundations include the Generic Asset Model, factories, `AnalysisEngine`, forecast abstraction, `PredictionEngine`, `PredictionOptions`, `TimeSeriesMerger`, neutral optimization models, `EvaluationEngine`, `EvaluationOptions`, `RecommendationEngine`, `RecommendationOptions`, the dormant read-only `SimulationRuntime`, and its deterministic `SimulationPublication` snapshot.

All architecture components remain deterministic, runtime-independent, and fully unit-tested.

## Runtime Status

The production adapter runtime remains intentionally unchanged. `SimulationRuntime` and `SimulationPublication` are not connected to `main.ts`, polling, or ioBroker states:

- No scheduling.
- No execution.
- No device control.
- No VIS integration.
- The optimization pipeline is not connected to active polling.

## Development Decision

Simulation mode remains the default operating mode. The optimizer must first explain what it would do before it is ever allowed to control devices.

## Next Milestone

### Publish the first read-only debug state

Make `simulation.publication.json` visible as the first read-only debug state.

Goals:

- Publish only the existing deterministic snapshot JSON.
- Keep the state read-only and intended for debugging and explanation.
- Change `main.ts`, polling, and state definitions only after separate explicit approval.
- Preserve all existing polling, mirroring, tariff, health, and shutdown behavior.

The completed simulation foundation reads a consistent source snapshot, runs the neutral pipeline in memory, and suppresses recommendations when configured sources are incomplete. The current implementation changes no ioBroker states.

Explicitly out of scope:

- Device switching or control.
- `ExecutionPlanner`.
- Scheduling.
- Additional recommendation states.
- VIS implementation.

The future read-only pipeline remains:

  ```text
  ConfigurationNormalizer
    → Prediction
    → Evaluation
    → Recommendation
  ```


## Validation Workflow

For every relevant implementation milestone, validate locally before commit:

```bash
npm run build
npm test
git diff --check
```

Then commit and push. On the Raspberry Pi, pull the pushed GitHub revision and run:

```bash
git pull --ff-only
npm install
npm run build
npm test
npm pack
```

Install that Raspberry-built package in ioBroker and perform the regression checks. This guarantees that validation covers the revision actually pushed to GitHub and avoids confusion with stale local `.tgz` files.

Keep shell contexts visibly distinct:

- Windows development prompt: `Lars Petrovcic@DESKTOP...`
- Raspberry test prompt: `pi@IoBroker...`

Verify:

- The adapter starts cleanly.
- No unexpected log errors occur.
- Runtime behavior is unchanged except for the intended milestone.
- Health states remain valid and `health.lastPollingTimestamp` updates.

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
