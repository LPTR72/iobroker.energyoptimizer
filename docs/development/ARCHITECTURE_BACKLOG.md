# Architecture Backlog

Stand: 10.07.2026

## Purpose

This document records architecture topics that are relevant beyond the active milestone but are not yet approved implementation scope.

It separates long-lived architecture work from the short canonical project handoff and from informal brainstorming in the Developer Workspace.

An entry in this backlog is not an implementation approval. Before work starts, the topic must be shaped into a milestone with explicit scope, dependencies, completion gates, and review criteria.

## Status Model

- `candidate`: relevant topic, not yet shaped into an approved milestone.
- `ready-for-scope`: sufficiently understood to prepare a milestone proposal.
- `waiting`: blocked by another architecture or platform decision.
- `active`: belongs to the currently approved milestone.
- `adopted`: transferred into stable architecture documentation or an implemented milestone.

## Information Interpreter

### Information Interpreter Domain Foundation

- Status: `ready-for-scope`
- Goal: define the system-boundary contract for external information before it enters the internal domain model.
- Topics:
  - source mapping and normalization,
  - binary-value semantics,
  - grid-power sign conventions,
  - quality boundaries and rejected values,
  - handling of technical capabilities,
  - separation of observed values, assumptions, and hypotheses.
- Dependency: History Domain Foundation completion.

## History Service

### Repository Contract

- Status: `candidate`
- Goal: define a persistence-neutral repository and query contract for historical data.
- Topics:
  - repository interface,
  - query semantics,
  - retention policy,
  - aggregation availability,
  - quality metadata,
  - failure and partial-data behavior.
- Explicitly excluded until separately approved:
  - SQL implementation,
  - ioBroker History adapter integration,
  - runtime wiring,
  - new public states.

### Temporal Context and Boundary Providers

- Status: `waiting`
- Goal: avoid duplicating temporal semantics across capabilities when multiple consumers need the same boundary logic.
- Current decision:
  - `rolling24h` and `calendarDayLocal` are explicit History domain strategies.
  - No general Temporal Boundary Provider is required for the current milestone.
- Revisit when History, Cost, Reporting, Forecast, Prediction, or Simulation require a shared temporal contract.
- Long-term question: whether defaults such as the Day Boundary Strategy should come from a broader Domain Context rather than an individual service.

## Analysis, Evaluation, and Simulation

### Capability Consolidation

- Status: `waiting`
- Goal: clarify terms, responsibilities, inputs, outputs, and dependencies of Analysis, Evaluation, Prediction, Forecast, and Simulation.
- Questions:
  - Which capabilities observe, explain, compare, predict, or simulate?
  - Which information is measured, inferred, assumed, or externally forecast?
  - Which capabilities own scenario definitions and result evaluation?
- Dependency: stable Information Interpreter and History contracts.

## Adapter Configuration Contract

### Configuration Surface Inventory

- Status: `ready-for-scope`
- Goal: inventory configuration properties before adding more Admin UI fields.
- Each property must define:
  - owning capability,
  - current source,
  - documented default,
  - whether it is derived automatically,
  - whether it is user-configurable,
  - whether it is internal or experimental,
  - validation and migration behavior.

Initial candidates include:

| Property | Capability | Current source | Default | Admin relevance | Status |
| --- | --- | --- | --- | --- | --- |
| Day Boundary Strategy | History | service configuration | `rolling24h` | to be decided | UI absent |
| Grid-power sign convention | Interpreter | unresolved | unresolved | yes | contract absent |
| Data sources | Interpreter / Runtime | native config | empty | yes | partially present |
| Asset configuration | Assets | Admin | asset-specific | yes | present in newer development state |
| Aggregation and retention | History | unresolved | unresolved | to be decided | contract absent |
| Cost and tariff changes | Cost | unresolved | unresolved | likely | contract absent |

The Admin UI is a contract between Domain, Runtime, persistence, and the user. It must not become an unstructured mirror of internal parameters.

## Object and Information Model

### Goal / Task Naming

- Status: `candidate`
- Goal: decide the final terminology for user goals, target states, planning tasks, and executable actions.

### Information Type Catalog

- Status: `candidate`
- Goal: classify observations, context information, forecasts, predictions, assumptions, hypotheses, simulation inputs, and derived evaluations.

### Naming Catalog

- Status: `candidate`
- Goal: maintain consistent domain terminology across code, object model, public documentation, and Admin UI.

### OBJECT_MODEL Synchronization

- Status: `waiting`
- Goal: synchronize `docs/architecture/OBJECT_MODEL.md` after the relevant domain contracts are approved.
- Do not predeclare public states for unapproved runtime capabilities.

## Grid-Power Model

- Status: `candidate`
- Goal: define a consistent model for grid import and export.
- Options to evaluate:
  - separate `grid.importPower` and `grid.exportPower` values,
  - optional signed `grid.power`,
  - configurable positive/negative direction,
  - normalized internal representation at the Interpreter boundary.

## Cost and Tariff Model

- Status: `candidate`
- Goal: support tariff and price changes in cost calculation, forecast, simulation, and validation.
- The model must not assume that one price is valid for an entire day, month, or simulation period.

## Public Presentation

### German Version

- Status: `candidate`
- Goal: provide the public presentation in German in addition to the current English version without creating divergent content structures.

## References

- [Project handoff](PROJECT_HANDOFF.md)
- [Next milestones](NEXT_MILESTONES.md)
- [Object model](../architecture/OBJECT_MODEL.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Development workflow](WORKFLOW.md)
