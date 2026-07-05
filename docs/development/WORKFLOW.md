# Development workflow

Stand: 05.07.2026 20:05 Uhr

## Language policy

Repository documentation, ADRs, README content, contributor-facing comments, and stored prompts must be written in English. Conversations with the project owner remain in German. English remains the repository language unless explicitly changed by a project decision.

## Session startup

Start every new session with exactly this entry point:

> Wir arbeiten weiter am Projekt ioBroker.energyoptimizer. Bitte verwende docs/development/NEXT_CHAT.md als kanonischen Einstiegspunkt und folge den dort beschriebenen Session-Startup-Regeln.

Read `docs/development/NEXT_CHAT.md` first. If available, continue immediately with `.local/PROJECT_CONTEXT.md`. Never copy private information from the local context into committed documentation.

## Local development environment

Private paths, hosts, shell prompts, credentials, and environment notes belong only in the ignored `.local/PROJECT_CONTEXT.md`. The committed `.local/PROJECT_CONTEXT.template.md` documents its neutral structure.

To prevent GitHub email-privacy push rejections, configure neutral account-specific values globally:

```bash
git config --global user.name "<git-user-name>"
git config --global user.email "<github-id>+<github-user>@users.noreply.github.com"
git config --global user.name
git config --global user.email
```

Repository-local Git configuration overrides these global defaults.

## Implementation guard

Documentation, planning, architecture discussion, review, handoff, `NEXT_CHAT.md`, or `WORKFLOW.md` requests do not authorize a new implementation milestone. Code changes require explicit user approval.

## Binding milestone workflow

Use this single workflow for every implementation milestone:

```text
Implementation
  -> local build, tests, diff check, and review
  -> commit
  -> push to GitHub
  -> Raspberry Pi git pull
  -> Raspberry Pi install, build, tests, and package
  -> ioBroker installation
  -> feature, state, health, and log validation
  -> NEXT_CHAT.md handoff
```

Do not skip ahead, validate an unpushed working tree, or deploy an old local tarball. The Raspberry Pi must build the package from the exact GitHub commit pulled for validation.

Keep terminal context explicit: `<windows-dev-shell>` identifies the development terminal and `<raspberry-test-shell>` identifies the test-system terminal. Verify the active terminal before running deployment commands.

## Local quality gate

Before implementation, establish a clean baseline. After implementation and before commit, run:

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

## Deployment quality gate

Only after the reviewed commit is pushed may validation continue on the Raspberry Pi:

```bash
git pull --ff-only
npm install
npm run build
npm test
npm pack
```

Then install the newly created package and validate ioBroker:

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

Runtime, state-handling, provider, integration, or production-code changes are incomplete until this ioBroker validation passes. Documentation-only, typo, comment, and cosmetic changes are exempt unless they can affect runtime or packaging.

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

- `docs/development/NEXT_CHAT.md` is the canonical session handoff.
- GitHub is the handoff boundary between local development and Raspberry Pi validation.
- The Raspberry Pi packages only the revision pulled from GitHub.
- ioBroker integration validation is mandatory for production-code milestones.
- Runtime publication remains read-only until device execution receives separate architecture and user approval.
- Repository documentation uses neutral placeholders; private environment details remain local.

## Lessons learned

- A successful local build never replaces ioBroker validation.
- Testing the pushed commit keeps the tested change delta unambiguous.
- Rebuilding on the Raspberry Pi prevents accidental use of stale `.tgz` packages.
- New states must be checked as both objects and values.
- A state definition alone does not guarantee object creation or runtime publication.
- Read-only means writing only adapter-owned states, never source or device states.
- Missing sources must remain observable without producing fictional advice.
- Documentation and process improvements discovered during a milestone should be collected and applied before closing its handoff.

## Documentation rules

All internal project documents use a compact status line:

```text
Stand: DD.MM.YYYY HH:MM Uhr
```

Every milestone ends with an updated `docs/development/NEXT_CHAT.md` recording the result, validation, open risks, and next recommended step. Pure typo or minor documentation edits need no full handoff update unless they affect the handoff.

### Privacy rule

Committed documentation must never contain personal names, account names, email addresses, absolute local paths, credentials, machine identifiers, or machine-specific prompt examples. Use neutral placeholders such as `<repository-root>`, `<git-user-name>`, `<windows-dev-shell>`, `<raspberry-test-shell>`, and `<ioBroker-host>`.

## Definition of done

An implementation milestone is complete only when:

1. Local build, tests, `git diff --check`, status, and review succeed.
2. The focused change is committed and pushed.
3. The Raspberry Pi pulls that exact commit.
4. Raspberry Pi install, build, tests, and `npm pack` succeed.
5. The Raspberry-built package is installed in ioBroker.
6. Feature, state, health, regression, and log checks succeed.
7. No unresolved runtime regression remains.
8. `NEXT_CHAT.md` records the completed milestone and next step.

Do not begin the next milestone before this definition is satisfied.
