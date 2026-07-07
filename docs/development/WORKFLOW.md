# Development workflow

Stand: 06.07.2026 22:10 Uhr

## Language policy

Repository documentation, ADRs, README content, and contributor-facing comments must be written in English. English remains the repository language unless explicitly changed by a project decision.

## Project handoff

`docs/development/PROJECT_HANDOFF.md` is the canonical, tool-neutral project handoff. It records the current project status, latest completed milestone, infrastructure status, validation results, open risks, and the next recommended milestone. Additional local development notes may exist outside version control; never copy private information from them into committed documentation.

## Canonical document hierarchy

Use the documents according to their responsibility:

1. `docs/development/PROJECT_HANDOFF.md` answers where the project currently stands and what should happen next.
2. `docs/development/WORKFLOW.md` defines neutral repository development and validation rules.
3. Architecture documents, [Architecture decisions](../architecture/DECISIONS.md), [Object model](../architecture/OBJECT_MODEL.md), and ADRs define the system design, public object boundaries, and accepted decisions.
4. Roadmap and project status documents define planned direction and historical progress.
5. Implementation files define actual runtime behavior.

Do not duplicate full architecture, history, or workflow rules in the handoff. Keep the handoff short enough to support fast session startup, then follow references only when deeper context is needed.

## Local development environment

Private paths, hosts, terminal identifiers, credentials, and environment notes belong only in the ignored `.local/PROJECT_CONTEXT.md`. The committed `.local/PROJECT_CONTEXT.template.md` documents its neutral structure.

To prevent GitHub email-privacy push rejections, configure neutral account-specific values globally:

```bash
git config --global user.name "<git-user-name>"
git config --global user.email "<github-id>+<github-user>@users.noreply.github.com"
git config --global user.name
git config --global user.email
```

Repository-local Git configuration overrides these global defaults.

## Implementation guard

Documentation, planning, architecture discussion, review, handoff, `PROJECT_HANDOFF.md`, or `WORKFLOW.md` requests do not authorize a new implementation milestone. Code changes require explicit approval.

## Current-state analysis

Before planning implementation details or editing files, analyze the current repository state. Confirm the active branch and working tree, inspect the relevant implementation and documentation, identify existing behavior and constraints, and reconcile the requested work with the canonical handoff.

Implementation must be based on the current project state, including uncommitted changes that must be preserved. Earlier plans, handoffs, reviews, and cached repository views are supporting context rather than substitutes for this analysis.

Current implementation, runtime, and milestone facts must be verified from the authoritative repository state before they are reported or used for decisions. Retained session context is not authoritative repository evidence.

Repository documentation is the canonical source of truth for project state. Startup prompts define how to find and verify that state; they must not permanently encode milestone-completion assumptions that can become stale.

Planning, implementation, review, and validation are separate phases. Each phase must produce enough evidence for the next one, and implementation must not begin until scope, exclusions, affected areas, and the validation plan are understood.

## Binding milestone workflow

Use this single workflow for every implementation milestone:

```text
Current-state analysis
  -> planning and scope approval
  -> implementation
  -> local build, tests, diff check, and review
  -> formal milestone completion review
  -> commit in the local development checkout
  -> push the reviewed branch to the authoritative remote
  -> pull that pushed branch in the Raspberry Pi validation checkout
  -> install dependencies, build, test, and package in that checkout
  -> install the package built in the Raspberry Pi checkout into ioBroker
  -> feature, state, health, and log validation
  -> PROJECT_HANDOFF.md update
```

Do not skip ahead, validate an unpushed working tree, or deploy an old local tarball. The Raspberry Pi must build the package from the exact GitHub commit pulled for validation.

Keep terminal context explicit: `<windows-dev-shell>` identifies the development terminal and `<raspberry-test-shell>` identifies the test-system terminal. Verify the active terminal before running deployment commands.

## Local quality gate

Before implementation, establish and inspect the baseline; a non-clean tree must be understood and preserved rather than overwritten. After implementation and before commit, run:

```bash
node --version
npm --version
npm install  # fresh clone or missing/changed dependencies only
npm run build
npm test
git diff --check
git status
git diff --stat
git diff
```

Review the intended files, then commit and push. If files are staged, inspect `git diff --cached --stat` and `git diff --cached` before committing.

## Milestone Completion Gate

Successful local validation alone does not complete a milestone. Before creating a commit, perform a formal completion review covering:

- Architecture and design consistency.
- Documentation consistency.
- Risks, limitations, and deferred work.
- Lessons learned.
- Collected workflow and documentation improvements.

Only a successful completion review permits the commit. After commit and push, Raspberry Pi and ioBroker validation remains mandatory. A milestone is complete only after that validation succeeds, and the next functional milestone must not begin earlier.

## Milestone Insights

Collect improvement ideas, lessons learned, workflow refinements, and documentation improvements throughout implementation without interrupting focused development work. Before the planned end-of-milestone documentation update, prepare a structured **Milestone Insights** list and use it as the review checklist.

Apply the collected items together during that documentation update. Place each durable insight in its proper architecture, domain, testing, roadmap, or workflow document rather than duplicating it in the session handoff.

## Deployment quality gate

Only after the reviewed commit is pushed may validation continue on the Raspberry Pi. Pull the pushed branch into the validation checkout, then build and package from that pulled state:

```bash
git pull --ff-only
npm install
npm run build
npm test
npm pack
```

Then install the package created locally in that Raspberry Pi checkout and validate ioBroker:

```bash
iobroker url <package-path>
iobroker upload energyoptimizer
iobroker restart energyoptimizer.0
iobroker status energyoptimizer.0
```

Complete the following checklist:

- Adapter starts and remains healthy.
- Logs contain no new errors or unexpected warnings.
- `health.configuredSources` is correct.
- `health.lastPollingTimestamp` updates.
- Polling, mirrored values, tariff costs, and shutdown behavior remain correct.
- Every changed feature behaves as specified.
- No foreign state is written during the read-only phase.
- The mandatory before/after object-structure regression in [Testing](TESTING.md#raspberry-pi-and-iobroker-object-structure-regression) is complete and all differences are explained.

Runtime, state-handling, provider, integration, or production-code changes are incomplete until this ioBroker validation passes. Documentation-only, typo, comment, and cosmetic changes are exempt unless they can affect runtime or packaging.

The standard deployment path is local commit and push, Raspberry Pi pull, Raspberry Pi build/package, and local ioBroker installation from that validation checkout. Do not substitute a separately built or transferred package for this chain.

## State validation

For every new adapter state, verify all four aspects:

- Object exists.
- State exists.
- Initial value is correct.
- Runtime update is correct.

Use the full IDs:

```bash
iobroker object get <object-id>
iobroker state get <state-id>
```

JSON publication states must always contain valid JSON. Incomplete sources produce explicit warnings and no invented recommendations.

## Read-only phase

Until a separately approved execution layer exists:

- Do not control devices.
- Do not write foreign states.
- Write only adapter-owned `energyoptimizer.0.*` states.
- Analysis, prediction, evaluation, recommendations, and simulation publication are allowed.
- Execution planning, if implemented as a domain milestone, remains dormant and side-effect free.

## Decision log

- `docs/development/PROJECT_HANDOFF.md` is the canonical project handoff.
- GitHub is the handoff boundary between local development and Raspberry Pi validation.
- The Raspberry Pi packages only the revision pulled from GitHub.
- ioBroker integration validation is mandatory for production-code milestones.
- Runtime publication remains read-only until device execution receives separate architecture and user approval.
- Repository documentation uses neutral placeholders; private environment details remain local.
- The project handoff records current state only; detailed architecture, history, and workflow rules remain in their dedicated documents.

## Lessons learned

- A successful local build never replaces ioBroker validation.
- Testing the pushed commit keeps the tested change delta unambiguous.
- Rebuilding on the Raspberry Pi prevents accidental use of stale `.tgz` packages.
- New states must be checked as both objects and values.
- A state definition alone does not guarantee object creation or runtime publication.
- Read-only means writing only adapter-owned states, never source or device states.
- Missing sources must remain observable without producing fictional advice.
- Documentation and process improvements discovered during a milestone should be collected and applied before closing its handoff.
- A short, current-state-focused project handoff improves session startup and reduces duplicate documentation.

## Documentation rules

All internal project documents use a compact status line:

```text
Stand: DD.MM.YYYY HH:MM Uhr
```

Every milestone ends with an updated `docs/development/PROJECT_HANDOFF.md` recording the result, validation, open risks, and next recommended step. Pure typo or minor documentation edits need no full handoff update unless they affect the handoff.

### Tool-neutral documentation

All version-controlled project documentation must remain independent of development assistants and session-specific tools. Tool-specific session guidance belongs only in intentionally local, ignored documentation and must never be copied into repository documents.

Repository documentation records durable project knowledge and neutral workflow expectations. Private/internal session procedures, workstation details, concrete tool assignments, and environment-specific instructions belong only in ignored local documentation. When promoting a useful local lesson, rewrite it as a neutral project rule and avoid duplicating private context.

### Privacy rule

Committed documentation must never contain personal names, account names, email addresses, absolute local paths, credentials, machine identifiers, or machine-specific terminal examples. Use neutral placeholders such as `<repository-root>`, `<git-user-name>`, `<windows-dev-shell>`, `<raspberry-test-shell>`, and `<ioBroker-host>`.

## Definition of done

An implementation milestone is complete only when:

1. Local build, tests, `git diff --check`, status, and review succeed.
2. The formal milestone completion review succeeds.
3. The focused change is committed and pushed.
4. The Raspberry Pi pulls that exact commit.
5. Raspberry Pi install, build, tests, and `npm pack` succeed.
6. The Raspberry-built package is installed in ioBroker.
7. Feature, state, health, regression, and log checks succeed.
8. No unresolved runtime regression remains.
9. `PROJECT_HANDOFF.md` records the completed milestone and next step.

Do not begin the next milestone before this definition is satisfied.
