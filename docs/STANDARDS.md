# Development Standards

This project follows professional development standards for code quality, git workflow, commits, and releases.

## Quick Links

- **[Branching Strategy](BRANCHING_STRATEGY.md)** — Git workflow with multi-tier branches
- **[Commit Standards](COMMIT_STANDARDS.md)** — Semantic commit messages and conventions
- **[Release Standards](RELEASE_STANDARDS.md)** — Versioning, tagging, and release process
- **[Documentation Standards](DOCUMENTATION_STANDARDS.md)** — Writing and organizing documentation
- **[Quick Reference](../QUICK_REFERENCE.md)** — Fast lookup for common workflows

## Standards Overview

### Branching
- Feature branches branch from `main` (latest stable)
- Promote through: `development` → `qa/*` → `uat/*` → `main`
- Each branch type has clear responsibilities and lifecycle
- Branch names include date and counter for organization

### Commits
- Semantic commit format: `<type>(<scope>): <subject>`
- Types: feat, fix, docs, style, refactor, perf, test, chore, ci
- Enables automated changelog generation
- Each commit should be independently meaningful

### Releases
- Semantic Versioning: MAJOR.MINOR.PATCH
- Follow quality gate workflow (QA → UAT → main)
- Tag all releases with git tags
- Generate GitHub Releases with release notes
- Sync main back to development after release

### Documentation
- Professional README with structure
- CHANGELOG in "Keep a Changelog" format
- Clear API/usage documentation
- Examples for common use cases

## Getting Started

1. Read [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) to understand the workflow
2. Review [COMMIT_STANDARDS.md](COMMIT_STANDARDS.md) for commit format
3. Check [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) for quick commands
4. Follow the guidelines for each type of work

## Need Help?

- Quick commands? See [QUICK_REFERENCE.md](../QUICK_REFERENCE.md)
- New to the project? Start with [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md)
- Making a release? Check [RELEASE_STANDARDS.md](RELEASE_STANDARDS.md)
- Writing docs? See [DOCUMENTATION_STANDARDS.md](DOCUMENTATION_STANDARDS.md)
