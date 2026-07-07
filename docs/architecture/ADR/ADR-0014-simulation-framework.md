# ADR-0014: Simulation

## Status

Accepted as long-term architecture direction.

## Context

Energy optimization behavior should be testable and explainable beyond live operation.

The project already has a narrow read-only Simulation Runtime. This is not the same as a broader planned Simulation Framework.

## Decision

Treat a broader **Simulation Framework** as a long-term architecture capability.

Possible future capabilities include replay, controlled time, scenario libraries, benchmark scenarios, demonstration mode, generated sample data, and regression testing.

## Consequences

- Simulation remains a permanent target capability.
- Implementation order remains open.
- The current read-only Simulation Runtime must not be confused with the future framework.
- Scenario formats, benchmark metrics, and user interface behavior require separate milestones.
