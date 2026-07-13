# Branching Strategy

A clean, linear branching model where features branch from main and promote through integration layers.

## Overview

```
main/master (production, stable)
     ↑
     ├─ UAT (user acceptance) → PR to main after approval
     ↑
     ├─ QA (quality assurance) → promote to UAT
     ↑
     ├─ development (integration) → promote to QA
     ↑
     └─ feature/* (feature development) → PR to development
```

**Key Principle:** Features always branch from main (latest stable), promote through development → QA → UAT, then PR back to main.

## Branch Types

### `main` or `master` (Production)
- **Purpose:** Production-ready code only, single source of truth
- **Protection:** Requires PR review, all checks pass, status checks required
- **Merge from:** `uat/*` via PR (after all testing passed)
- **Policy:** 
  - Only stable, tested code
  - All releases tagged (v1.2.3)
  - All features have gone through full pipeline
  - Hotfixes for critical issues only
- **Lifetime:** Permanent, never delete
- **Deploy to:** Production

**When to create:** At project initialization (never delete)

### `development`
- **Purpose:** Integration branch where features first merge
- **Branch from:** main (weekly sync)
- **Merge from:** feature/* (via PR with 1 review)
- **Merge to:** qa/* (promotion)
- **Policy:** 
  - Contains accepted features from multiple branches
  - Serves as integration point before QA
  - Continuously tested
  - Synced back from main after releases
- **Lifetime:** Permanent, never delete
- **Deploy to:** Development/staging environment

**When to create:** At project initialization (never delete)

### `feature/*` (Feature Development)
- **Naming:** `feature/descriptive-name`
- **Created from:** `main` (always branch from latest stable)
- **Purpose:** Develop individual features
- **Merge to:** `development` (via PR)
- **Policy:** 
  - One feature per branch
  - Keep short-lived (< 2 weeks)
  - Frequent atomic commits
  - Include tests with feature code
  - PR title: `feat(scope): description`
- **Lifetime:** Delete after merge to development
- **Deploy to:** Feature environment (optional)

**Examples:**
```bash
feature/20260712-01-User-Authentication
feature/20260712-02-Payment-Integration
feature/20260713-01-Admin-Dashboard
feature/20260713-02-API-Rate-Limiting
```

## Key Principles

1. **Main is Stable** — Only production-ready code on main
2. **Feature Branch from Main** — Always get latest stable code
3. **Linear Promotion** — feature → development → QA → UAT → main
4. **No Cherry-picking** — Full pipeline ensures quality
5. **PR-based Workflow** — Traceability and review trail
6. **Tag All Releases** — Never trust branches for production
7. **Sync After Release** — Merge main back to development
8. **Atomic Commits** — Each commit should be independently valid
9. **Short Branches** — Max 2 weeks to minimize merge conflicts
10. **Clear Communication** — PR descriptions explain why

## Best Practices

1. **Keep feature branches short-lived** — Merge within 1-2 weeks
2. **Frequent commits** — Commit after each logical change
3. **Sync with main regularly** — Pull latest main into feature branch
4. **Write clear PR descriptions** — Explain what and why
5. **Test before pushing** — Run full test suite locally
6. **One feature per branch** — Don't combine unrelated work
7. **Use semantic commits** — Enables automated changelog
8. **Review thoroughly** — Don't approve without understanding
9. **Resolve conflicts early** — Don't let branches drift too far
10. **Clean up branches** — Delete after merge
