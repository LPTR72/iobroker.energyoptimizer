# ADR-0010: Neutral ExecutionPlanner foundation

## Status

Accepted

## Context

Recommendations express intent but do not identify a safe, capability-compatible action. Planning must remain separate from recommendation ranking and from any future component that performs side effects.

## Decision

Use a pure `ExecutionPlanner` to transform ranked `Recommendation[]`, `OptimizationCapability[]`, and `OptimizationConstraint[]` into one neutral `ExecutionPlan`.

The planner consumes the first ranked recommendation and produces a deterministic plan from an explicit generation timestamp. No recommendation produces a `noop` plan. Only recommendation types with one unambiguous action and matching capability produce a dormant action. Missing capabilities, applicable constraints, and abstract recommendations produce blocked plans with explicit warnings rather than guessed actions.

The planner does not evaluate measurements, rank recommendations, schedule actions, access ioBroker, write states, or control devices.

## Consequences

- Planning remains deterministic, vendor-neutral, and independently testable.
- Ambiguous advice cannot silently become a device action.
- Capability and constraint semantics can evolve without changing recommendation evaluation.
- Runtime integration and execution remain separate, approval-gated milestones.
