# Architecture decisions

This page is the compact public index for durable architecture decisions.

## Accepted decisions

- [ADR-0012: History Service](ADR/ADR-0012-history-service.md)
- [ADR-0013: Pattern-based Virtual Energy Assets](ADR/ADR-0013-pattern-based-virtual-energy-assets.md)
- [ADR-0014: Simulation](ADR/ADR-0014-simulation-framework.md)

## Current architecture direction

- Keep the domain model independent from ioBroker runtime APIs, vendors, protocols, and cloud services.
- Keep recommendations separate from later device behavior.
- Use historical data as reusable context through a dedicated History Service boundary.
- Treat recognized consumption patterns as hypotheses until confirmed by the user.
- Build simulation capability gradually and keep the current Simulation Runtime distinct from the planned Simulation Framework.
