# ADR-0009: Read-only runtime publication

## Status

Accepted

## Context

The deterministic simulation pipeline needs observable runtime results without introducing scheduling or device control. A complete diagnostic representation is useful for troubleshooting, while common automation consumers need selected recommendation fields without parsing JSON.

## Decision

After successful polling, the adapter runs `SimulationRuntime` from a consistent source snapshot. It maps the result through `SimulationPublication` and writes only adapter-owned states.

`simulation.publication.json` contains the complete diagnostic snapshot. Structured `recommendation.*` states expose availability, count, and the best recommendation's type, priority, reason, and validity. A non-ready or failed simulation clears the structured projection. Missing sources remain explicit and never produce invented recommendations.

This path is read-only with respect to the modeled energy system: it does not write source or device states, schedule actions, or execute recommendations.

## Consequences

- Recommendation results are observable through JSON and simple state consumers.
- Runtime and state-contract changes require full Raspberry Pi and ioBroker validation.
- Publication remains separate from future execution planning and device adapters.
- Device control still requires a separate architecture decision and explicit approval.
