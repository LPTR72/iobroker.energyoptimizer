# Development workflow

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

1. Plan architecture and scope, including explicit behavior boundaries.
2. Implement a focused change on a feature branch.
3. Review changed files and verify no unrelated runtime behavior moved.
4. Run `npm run build`, `npm test`, `git diff --check`, and `git status`.
5. Create a small, descriptive Git commit and push it to GitHub.
6. Pull the branch on the ioBroker server.
7. Install or update the adapter there and verify object creation, polling, logs, mirrored values, costs, and shutdown behavior.

Domain-only work should remain dormant in production until an explicit integration step is designed. Server testing confirms that structural changes did not disturb the existing adapter.
