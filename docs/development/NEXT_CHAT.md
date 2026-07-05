# NEXT_CHAT

Stand: 05.07.2026 19:08 Uhr

## Session startup

Every new ChatGPT or Codex session must begin with this document.

If `.local/PROJECT_CONTEXT.md` exists, read it immediately afterwards. It contains private environment-specific information and must never be committed or copied into repository documentation.

Repository documentation remains the canonical project documentation.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest validated milestone: Read-only Simulation Runtime Integration.
- Validated commit: `0bf038f` (`Integrate read-only simulation runtime publication`).
- `SimulationRuntime` runs after successful polling and writes only adapter-owned read-only states.
- `simulation.publication.json` contains valid diagnostic JSON; `simulation.ready` reflects publication readiness.
- Missing sources produce warnings and no invented recommendations.
- The Execution Engine remains disabled. No device, consumer, or battery control exists.
- Current local candidate: Read-only Recommendation Projection implemented and awaiting review, commit, push, and Raspberry/ioBroker validation.
- Seven adapter-owned `recommendation.*` states expose availability, count, and the best recommendation without JSON parsing.
- A non-ready or failed simulation clears the projection, preventing stale or invented recommendations.

## Validation status

- Validated commit `0bf038f`: local build, 63/63 tests, and `git diff --check` successful.
- Local candidate build successful.
- Local candidate tests: 66/66 passing.
- Local candidate `git diff --check` successful.
- Validated commit `0bf038f`: commit and push successful.
- Validated commit `0bf038f`: Raspberry Pi `git pull`, `npm install`, build, tests, and `npm pack` successful.
- Validated commit `0bf038f`: ioBroker installation and regression validation successful.
- `simulation.ready=true`, `simulation.publication.json` contains valid JSON, and `health.lastPollingTimestamp` updates normally.
- No unexpected warnings or errors were observed.

## Next milestone

### Validate Read-only Recommendation Projection

Review, commit, and push the local candidate, then validate the exact GitHub revision on the Raspberry Pi and ioBroker test system.

Validation goal: confirm that all structured recommendation objects and states exist, initialize correctly, update from the validated publication snapshot, and remain empty when the simulation is not ready. `simulation.publication.json` remains the complete diagnostic snapshot.

Planned states:

- `recommendation.available`
- `recommendation.count`
- `recommendation.best.type`
- `recommendation.best.priority`
- `recommendation.best.reason`
- `recommendation.best.validFrom`
- `recommendation.best.validTo`

No device control, switching logic, VIS/UI work, or foreign-state writes are in scope.

## Open risks

- Some architecture and roadmap documents still describe `SimulationRuntime` as dormant; align them in a separately approved documentation task.
- Publication JSON size may grow with larger forecasts or recommendation sets.
- Simulation uses a cached snapshot taken after existing mirror reads, so values can change between the two read phases.
- Recommendation states have passed local tests but still need review and full Raspberry/ioBroker validation.

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
