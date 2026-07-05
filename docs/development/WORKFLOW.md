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
6. Pull the branch on the ioBroker test server.
7. Install or update the adapter there and validate object creation, polling, logs, mirrored values, costs, shutdown behavior, and relevant new functionality.
8. Promote only a reviewed and validated revision to production.

## ioBroker validation checkpoint

Relevant architecture, domain, engine, factory, configuration, build, or runtime changes must pass validation on the ioBroker test server before work starts on the next architecture milestone. Apply the same rule to any other change where a regression could be introduced.

Minor documentation, typo, comment, or cosmetic README changes do not require a full ioBroker deployment. When in doubt, use the full validation path. Early validation keeps the change delta small and makes regressions easier to find.

### Test-server checklist

1. Pull the reviewed branch on the ioBroker test server with `git pull`.
2. Run `npm install` if dependencies or the lockfile changed.
3. Run `npm run build`.
4. Run `npm test`.
5. Run `npm pack` and review the package result.
6. Install or update the adapter with `iobroker url https://github.com/LPTR72/iobroker.energyoptimizer`.
7. Run `iobroker upload energyoptimizer`.
8. Restart the instance with `iobroker restart energyoptimizer.0`.
9. Check the adapter status with `iobroker status energyoptimizer.0`.
10. Check adapter logs for errors and unexpected warnings.
11. Check connection, asset-health, and normalized-asset health states.
12. Verify polling, mirrored values, cost calculations, and clean shutdown behavior.

Domain-only work should remain dormant in production until an explicit integration step is designed. Server testing confirms that structural changes did not disturb the existing adapter.
