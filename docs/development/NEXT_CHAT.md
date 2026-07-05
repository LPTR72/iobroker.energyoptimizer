# NEXT_CHAT

Status: 05.07.2026 16:19 CEST

## Purpose

This document is the mandatory starting point for every new ChatGPT/Codex development session. It summarizes the validated project state, identifies the next milestone, and links to the canonical project documentation.

## Current Status

- Read-only `SimulationRuntime` completed in commit `03e4c57` (`Add read-only simulation runtime foundation`).
- Dormant read-only `SimulationPublication` snapshot completed in commit `ae68093` (`Add dormant simulation publication snapshot`).
- Read-only runtime publication integration and startup-state correction implemented locally; review, commit, push, and repeat ioBroker validation are pending.
- Active branch: `refactor/core-architecture`.
- Local build successful.
- Local tests: 63/63 passing.
- `git diff --check` successful.
- The first ioBroker integration test failed because `simulation.publication.json` was absent, while the adapter, polling, and `health.lastPollingTimestamp` remained healthy.
- Root cause: the Raspberry Pi pulled the last pushed GitHub commit `8a108aa`; the runtime integration was still uncommitted locally and therefore was not part of that installation.
- Correction: startup now defines and initializes `simulation.publication.json` with valid JSON before the first simulation run. Missing-source publications remain valid JSON with warnings, no recommendations, and `simulation.ready=false`.
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

The local candidate runs `SimulationRuntime` after each successful polling cycle and publishes only to its own read-only states:

- `simulation.publication.json` contains the deterministic publication payload.
- `simulation.ready` reflects source completeness and is set to `false` if the simulation run fails.
- Missing sources remain visible in the JSON warnings and never produce invented recommendations.
- `optimizer.recommendation` remains unchanged.

- No scheduling.
- No execution.
- No device control.
- No VIS integration.
- No writes to foreign device or asset states.

## Development Decision

Simulation mode remains the default operating mode. The optimizer must first explain what it would do before it is ever allowed to control devices.

## Next Milestone

### Validate the read-only runtime publication

Review, commit, and push the implementation, then validate the exact GitHub revision on the Raspberry Pi and ioBroker test system.

Goals:

- Confirm that `simulation.publication.json` updates after each poll.
- Confirm that `simulation.ready` becomes `true` only with complete source data.
- Confirm that incomplete sources remain visible as warnings with no recommendations.
- Verify that polling, mirroring, tariff, health, and shutdown behavior remain unchanged.

The completed simulation foundation reads a consistent source snapshot, runs the neutral pipeline in memory, and suppresses recommendations when configured sources are incomplete. The local integration changes only the two documented adapter-owned simulation states.

Explicitly out of scope:

- Device switching or control.
- `ExecutionPlanner`.
- Scheduling.
- Additional recommendation states.
- VIS implementation.

Open risks:

- The publication JSON size will grow when forecasts or recommendation sets become larger and should be monitored during test-server validation.
- The simulation takes its own cached source snapshot after the existing mirror reads; source values can change between those two read phases.
- The failed ioBroker test did not contain the local integration code. A new commit, push, Raspberry `git pull`, package build, and ioBroker installation are required to validate the corrected revision.

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
