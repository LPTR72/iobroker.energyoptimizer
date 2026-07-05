# NEXT_CHAT

Stand: 05.07.2026 20:05 Uhr

## Session startup

Every new ChatGPT or Codex session must begin with this document.

If `.local/PROJECT_CONTEXT.md` exists, read it immediately afterwards. It contains private environment-specific information and must never be committed or copied into repository documentation.

Repository documentation remains the canonical project documentation.

## Current project status

- Active branch: `refactor/core-architecture`.
- Latest validated milestone: Read-only Recommendation Projection.
- Validated commit: `88180c8` (`Add read-only recommendation projection`).
- The read-only simulation pipeline runs after successful polling and publishes an adapter-owned diagnostic snapshot.
- Structured `recommendation.*` states expose availability, count, type, priority, reason, and validity of the best recommendation.
- Missing or incomplete inputs remain visible as warnings and never create invented recommendations.
- No device, consumer, or battery control exists. The execution layer remains disabled.

## Validation status

- Local build successful; 66/66 tests passed; `git diff --check` successful.
- Commit and push to GitHub successful.
- The Raspberry Pi pulled the pushed commit; `npm install`, build, 66/66 tests, and `npm pack` succeeded.
- ioBroker package installation succeeded.
- Recommendation objects, initial values, and runtime updates were verified.
- `health.configuredSources` and `health.lastPollingTimestamp` were verified.
- No unexpected adapter warnings or errors were observed.

## Next milestone

### Neutral ExecutionPlanner foundation

Design and implement a pure, dormant `ExecutionPlanner` that converts recommendations into neutral execution plans using capabilities and constraints.

This milestone has not started and requires explicit user approval. It must not integrate with polling, write device states, schedule actions, or introduce device control.

## Open risks

- Publication JSON size can grow with larger forecasts or recommendation sets.
- Simulation uses a cached snapshot after existing mirror reads, so source values may change between read phases.
- Execution planning needs explicit capability, constraint, safety, conflict, and expiry semantics before any runtime integration can be considered.

## References

- [Architecture](../architecture/ARCHITECTURE.md)
- [Pipeline](../architecture/PIPELINE.md)
- [Architecture decisions](../architecture/DECISIONS.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Project status](../roadmap/PROJECT_STATUS.md)
- [Development workflow](WORKFLOW.md)
- [Testing](TESTING.md)
