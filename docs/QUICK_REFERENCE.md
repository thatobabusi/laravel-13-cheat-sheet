# Quick Reference

Fast lookup guide for common workflows and standards.

## Branching Quick Commands

**Branch naming:** `<type>/<YYYYMMDD>-<counter>-<Description>`

```bash
# Start feature (ALWAYS from main)
git checkout main
git pull origin main
git checkout -b feature/20260712-01-User-Authentication

# Push and create PR to development
git push -u origin feature/20260712-01-User-Authentication
# Create PR: development ← feature/20260712-01-User-Authentication

# Release to main
git checkout main
git pull origin main
git merge --no-ff feature/my-feature -m "Release v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
```

## Commit Message Quick Format

```
<type>(<scope>): <subject>

<body explaining why>

Closes #123
```

**Types:** `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci`

**Examples:**
```
feat(cheat-sheet): add queue examples
fix(docs): correct authentication code
docs(readme): add quick reference
```

## Release Checklist

- [ ] Update CHANGELOG.md with new version
- [ ] Create release branch: `release/v1.2.0`
- [ ] Merge to main with release commit
- [ ] Tag: `git tag -a v1.2.0 -m "Release v1.2.0"`
- [ ] Push: `git push origin main --tags`
- [ ] Sync back to development
- [ ] Announce release

## Semantic Versioning Quick Guide

| Change | Version |
|--------|---------|
| Breaking API change | v1.0.0 → v2.0.0 |
| New feature | v1.0.0 → v1.1.0 |
| Bug fix | v1.1.0 → v1.1.1 |
| Documentation | No version bump |

## Standards Documentation Map

| Topic | File | Purpose |
|-------|------|---------|
| Git Workflow | docs/BRANCHING_STRATEGY.md | Multi-tier branches, workflows |
| Commits | docs/COMMIT_STANDARDS.md | Semantic messages, changelog |
| Releases | docs/RELEASE_STANDARDS.md | Versioning, tagging, GitHub |
| Docs | docs/DOCUMENTATION_STANDARDS.md | README, guides, API docs |
| This File | QUICK_REFERENCE.md | Quick lookup guide |

## Need Help?

1. Check this QUICK_REFERENCE.md
2. Read relevant docs (docs/BRANCHING_STRATEGY, docs/COMMIT_STANDARDS, etc.)
3. Look at examples in docs/
4. Open issue on GitHub

---

**Last Updated:** 2026-07-13  
**Version:** 1.0.0
