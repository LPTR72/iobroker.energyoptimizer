# ADR-0011: Neutral execution-planning semantics

## Status

Accepted

## Context

The dormant planner foundation could match a recommendation to a capability, but it did not yet express combined physical bounds, narrow actions to allowed time windows, reject expired intent, or detect opposite actions for the same asset.

## Decision

Execution actions carry an optional readonly limits object. The planner intersects applicable capability and constraint ranges for power, energy, duration, and state of charge. It blocks invalid or empty ranges instead of selecting an arbitrary device setpoint.

Allowed time windows narrow the recommendation horizon. An action's effective horizon never starts before the plan's `generatedAt`; a partially elapsed recommendation can remain valid only for its future portion. Expired or invalid horizons produce blocked plans. Conflict detection considers only future-effective valid horizons, so expired opposing intent cannot block an active recommendation. Temporally overlapping future charge and discharge recommendations for the same capable asset are treated as conflicts and also produce blocked plans.

All resulting plans remain dormant. The planner does not inspect live state of charge, schedule actions, access ioBroker, publish plans, or control devices.

## Consequences

- Plans expose feasible neutral bounds without pretending to be executable commands.
- Constraints remain deterministic and independently testable.
- Live-state validation, setpoint selection, broader conflict policy, scheduling, and execution remain separate future concerns.
- Runtime behavior and the existing read-only recommendation projection remain unchanged.
