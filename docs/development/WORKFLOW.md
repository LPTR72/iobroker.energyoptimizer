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

Domain-only work should remain dormant in production until an explicit integration step is designed. Server testing confirms that structural changes did not disturb the existing adapter.
