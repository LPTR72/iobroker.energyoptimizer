# Development workflow

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

- Windows development commands use a prompt such as `Lars Petrovcic@DESKTOP...`.
- Raspberry validation commands use a prompt such as `pi@IoBroker...`.

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

## Definition of milestone complete

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
