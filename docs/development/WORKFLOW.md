# Development workflow

Stand: 05.07.2026 16:45 Uhr

## Language policy

Repository documentation, ADRs, the README, workflow documentation, contributor-facing comments, and Codex prompts stored in the repository must be written in English. ChatGPT conversations with the project owner remain in German.

Future repository documentation must remain in English unless the project explicitly decides otherwise.

## Session startup

Recommended opening sentence for every new session:

> Wir arbeiten weiter am Projekt ioBroker.energyoptimizer. Bitte verwende docs/development/NEXT_CHAT.md als kanonischen Einstiegspunkt und folge den dort beschriebenen Session-Startup-Regeln.

- New sessions start with exactly this entry point.
- Start every new ChatGPT or Codex session with `docs/development/NEXT_CHAT.md`.
- If available, immediately continue with `.local/PROJECT_CONTEXT.md`.
- Never copy personal information from the local context into repository documentation.

## One-time development environment setup

### GitHub email configuration

Configure the GitHub noreply address globally to avoid push rejection when GitHub email privacy protection is enabled:

```bash
git config --global user.name "<git-user-name>"
git config --global user.email "<github-id>+<github-user>@users.noreply.github.com"
```

Verify the configuration:

```bash
git config --global user.name
git config --global user.email
```

Repository-local Git configuration overrides the global configuration. The global defaults still prevent identity and email-privacy problems in newly cloned repositories.

The current end-to-end development path is:

```text
ChatGPT
  ↓
Codex
  ↓
Git
  ↓
GitHub
  ↓
ioBroker Test Server
  ↓
Validation
  ↓
Production
```

ChatGPT supports architecture and scope discussions. Codex performs repository work and local validation. Git preserves focused project history, GitHub is the shared upstream, and the ioBroker test server validates integration behavior before production. Human review and explicit approval remain required at every boundary, especially before runtime integration or device control.

Within that end-to-end path, each focused change follows the established activity loop:

```text
Architecture Design
  -> Implementation
  -> Review
  -> Testing
  -> Documentation Update
  -> Commit
  -> GitHub
  -> Integration Testing
```

## Practical flow

1. Discuss architecture and scope, including explicit behavior boundaries.
2. Implement and review a focused change on a feature branch.
3. Verify that no unrelated runtime behavior moved.
4. Run `npm run build`, `npm test`, `git diff --check`, and `git status` locally.
5. Create a small, descriptive Git commit and push it to GitHub.
6. Pull that pushed revision on the Raspberry Pi test system.
7. Run `npm install`, `npm run build`, `npm test`, and `npm pack` on the Raspberry Pi.
8. Install the Raspberry-built package in ioBroker and validate object creation, polling, logs, mirrored values, costs, shutdown behavior, and relevant new functionality.
9. Promote only a reviewed and validated revision to production.

This order guarantees that integration testing covers the revision actually pushed to GitHub. Building the package on the Raspberry Pi after `git pull` also prevents accidental reuse of an outdated local `.tgz` file.

Keep command context explicit when documenting or sharing terminal output:

- Windows development commands use the placeholder `<windows-dev-shell>`.
- Raspberry validation commands use the placeholder `<raspberry-test-shell>`.

Before running deployment commands, verify which terminal is active. This prevents Linux or Raspberry Pi commands from being executed accidentally in the Windows development terminal.

## ioBroker validation checkpoint

Relevant architecture, domain, engine, factory, configuration, build, or runtime changes must pass validation on the ioBroker test server before work starts on the next architecture milestone. Apply the same rule to any other change where a regression could be introduced.

Minor documentation, typo, comment, or cosmetic README changes do not require a full ioBroker deployment. When in doubt, use the full validation path. Early validation keeps the change delta small and makes regressions easier to find.

### Test-server checklist

1. Pull the reviewed and pushed branch on the Raspberry Pi with `git pull --ff-only`.
2. Run `npm install` on the Raspberry Pi.
3. Run `npm run build`.
4. Run `npm test`.
5. Run `npm pack` on the Raspberry Pi and review the newly created package result.
6. Install or update the adapter from that package; do not reuse an older local `.tgz` file.
7. Run `iobroker upload energyoptimizer`.
8. Restart the instance with `iobroker restart energyoptimizer.0`.
9. Check the adapter status with `iobroker status energyoptimizer.0`.
10. Check adapter logs for errors and unexpected warnings.
11. Check connection, asset-health, normalized-asset health states, and `health.lastPollingTimestamp`.
12. Verify polling, mirrored values, cost calculations, and clean shutdown behavior.

Domain-only work should remain dormant in production until an explicit integration step is designed. Server testing confirms that structural changes did not disturb the existing adapter.

## Deployment Quality Gate

Before every Raspberry Pi test installation, complete these steps locally:

1. Run `git status`.
2. Run `npm run build`.
3. Run `npm test`.
4. Run `git diff --check`.
5. Commit the reviewed change.
6. Push the commit.

Only then continue on the Raspberry Pi with `git pull --ff-only`, `npm install`, `npm run build`, `npm test`, `npm pack`, and adapter installation. Runtime changes are complete only after successful ioBroker validation of the pushed commit.

## State Validation

For every newly introduced adapter state, verify:

- The object exists.
- The state exists.
- The initial value is correct.
- Runtime updates are correct.

Use both commands with the full object or state ID:

```bash
iobroker object get <object-id>
iobroker state get <state-id>
```

## Read-only Phase

Until an Execution Engine is explicitly introduced and approved:

- Do not control devices.
- Do not write foreign states.
- Write only adapter-owned `energyoptimizer.0.*` states.
- Generating recommendations is allowed.
- Publishing simulation results is allowed.

## Documentation Rules

`docs/development/NEXT_CHAT.md` remains the mandatory session handoff. After every significant milestone, record the result, validation, lessons learned, open risks, and next recommended step.

All internal project documents must include a compact status line in this form:

```text
Stand: DD.MM.YYYY HH:MM Uhr
```

### Privacy Rule

Repository documentation must never contain:

- Personal names.
- Usernames and Windows account names.
- Absolute local file paths.
- Email addresses.
- Machine-specific identifiers and prompt examples.

Use neutral placeholders such as `<project-root>`, `<repository-root>`, `<git-user-name>`, `<windows-dev-shell>`, `<raspberry-test-shell>`, and `<ioBroker-host>` instead.

Private and local environment details belong only in `.local/PROJECT_CONTEXT.md`, which must never be committed. The committed neutral template is `.local/PROJECT_CONTEXT.template.md`; repository documentation must continue to use neutral placeholders.

## Implementation Guard

When the user requests only documentation, planning, architecture discussion, reviews, handoff work, `NEXT_CHAT.md`, or `WORKFLOW.md`, no implementation milestone may begin.

Code changes require explicit user approval. This rule is mandatory.

## Lessons Learned

- Runtime changes are complete only after successful Raspberry Pi and ioBroker validation.
- Before Raspberry Pi validation, confirm that the exact commit has been pushed and pulled.
- Local builds never replace integration validation.
- New adapter states require both object and state-value checks.
- Read-only work writes only adapter-owned `energyoptimizer.0.*` states.
- Publication JSON must remain valid even when source data is incomplete.
- Missing sources produce warnings, never invented recommendations.

## Definition of Done

A relevant architecture or runtime milestone is complete only when all of the following are done:

1. `npm run build`, `npm test`, and `git diff --check` succeed.
2. The focused change is committed and pushed.
3. The Raspberry Pi has pulled the pushed GitHub revision.
4. `npm install`, build, tests, and `npm pack` succeed on the Raspberry Pi.
5. The Raspberry-built package is installed on the ioBroker test server.
6. Intended states and health values are verified.
7. Logs contain no new adapter errors.
8. `NEXT_CHAT.md` records the validated state and identifies the next milestone.

Do not start the next architecture milestone before this checkpoint is complete.

## Mandatory session handoff

Every milestone must end with an updated `docs/development/NEXT_CHAT.md`. It is the canonical handoff document for every new ChatGPT/Codex development session and must record:

- The completed milestone.
- Validation results.
- Open risks or unresolved constraints.
- The next recommended step.

This rule also applies to small code changes when they represent a milestone. Pure typo fixes and minor documentation edits do not require a full `NEXT_CHAT.md` update unless they affect the session handoff.
