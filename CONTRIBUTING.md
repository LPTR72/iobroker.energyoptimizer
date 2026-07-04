# Contributing

Contributions should strengthen the modular architecture without silently changing adapter behavior.

## Guidelines

- Keep domain code free of ioBroker and vendor-specific APIs.
- Put external access behind provider or infrastructure interfaces.
- Keep recommendations device-independent and execution separate.
- Preserve state IDs, native configuration names, units, polling, logging, and rounding unless a behavior change is explicitly approved.
- Add focused tests for new models and behavior.
- Prefer small, coherent commits; Conventional Commit subjects are encouraged.
- Record meaningful architecture decisions in `docs/architecture/DECISIONS.md`.

## Before committing

```bash
npm run build
npm test
git diff --check
git status
```

Review the complete diff and update relevant documentation. Do not mix unrelated formatting, refactoring, and behavior changes.
