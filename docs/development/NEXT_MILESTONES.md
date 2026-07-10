# Next Milestones

Stand: 10.07.2026

## Purpose

This document provides a small, decision-oriented overview of milestone candidates.

It does not replace `PROJECT_HANDOFF.md`, the architecture backlog, the roadmap, or an explicit user approval. A candidate listed here is not automatically approved for implementation.

Infrastructure milestones and functional adapter milestones remain separate so that platform maintenance is not silently mixed into product scope.

## Current Completion Work

### History Domain Foundation Contract Alignment

- Type: functional architecture milestone.
- Status: `validation-and-closeout`.
- Branch: `integration/history-domain-foundation`.
- Current scope: pure deterministic History domain code; no runtime wiring.
- Remaining completion work:
  1. confirm the current remote commit and clean branch state,
  2. perform the agreed Raspberry/ioBroker regression validation,
  3. finalize Review Outcome,
  4. update `PROJECT_HANDOFF.md` and, where required, `TESTING.md`,
  5. decide and perform merge into `refactor/core-architecture`,
  6. delete the temporary integration branch after successful integration.
- Rule: no new functional milestone starts on the integration branch.

## Functional Architecture Candidates

### A. Information Interpreter Domain Foundation

- Status: `ready-for-scope`.
- Purpose: strengthen the system boundary for mapping, normalization, binary semantics, sign conventions, quality handling, and technical capability interpretation.
- Dependency: History Domain Foundation completion.
- Recommended position: strongest current functional candidate because later History, Cost, Analysis, Evaluation, and Simulation work depends on clean interpreted information.

### B. History Repository Contract

- Status: `candidate`.
- Purpose: define persistence-neutral repository, query, retention, and quality contracts.
- Dependency: History Domain Foundation completion; alignment with Interpreter semantics.
- Excludes: SQL implementation and Runtime wiring unless separately approved.

### C. Analysis / Evaluation / Simulation Consolidation

- Status: `waiting`.
- Purpose: align existing and planned capabilities with the newer architecture and clarify terminology and responsibility boundaries.
- Dependency: stable Interpreter and History contracts.

### D. Adapter Configuration Contract & Admin Surface

- Status: `ready-for-scope`.
- Purpose: create a Configuration Surface Inventory and define which values are derived, defaulted, user-configurable, internal, or experimental.
- Dependency: can be scoped independently, but detailed UI contracts should follow the relevant domain contracts.
- Rule: do not add Admin fields as an unstructured list of internal parameters.

## Infrastructure Candidate

### E. Development Platform Refresh

- Type: infrastructure milestone.
- Status: `planned`.
- Purpose: migrate the Raspberry environment from a 64-bit kernel with 32-bit `armhf` userland to a complete `arm64` platform.
- Expected scope:
  - clean ioBroker installation or controlled migration,
  - Backitup restore,
  - Redis validation,
  - adapter validation,
  - Node.js and npm validation,
  - SSH-key authentication transfer,
  - VS Code Remote-SSH validation,
  - full completion gates.
- Constraint: do not mix this work into the History closeout.
- Prioritization decision: after History completion, choose explicitly between this infrastructure milestone and the next functional architecture milestone.

## Selection Rule

After the History milestone is closed:

1. read the current `PROJECT_HANDOFF.md`,
2. review dependencies and risks in `ARCHITECTURE_BACKLOG.md`,
3. choose either one functional milestone or the infrastructure milestone,
4. define scope, exclusions, completion gates, and review criteria,
5. obtain explicit approval before implementation begins.

## References

- [Project handoff](PROJECT_HANDOFF.md)
- [Architecture backlog](ARCHITECTURE_BACKLOG.md)
- [Roadmap](../roadmap/ROADMAP.md)
- [Development workflow](WORKFLOW.md)
