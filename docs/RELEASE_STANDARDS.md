# Release Standards

Semantic versioning, release workflow, tagging, and changelog management.

## Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0) — Breaking changes, incompatible API changes
- **MINOR** (1.Y.0) — New features, backward compatible
- **PATCH** (1.0.Z) — Bug fixes only, no new features

**Examples:**
```
1.0.0 — Initial release
1.1.0 — Add new features
1.1.1 — Fix bugs
2.0.0 — Breaking changes
```

## Release Workflow

### 1. Prepare Release Branch
```bash
# Create release branch from development
git checkout -b release/v2.1.0 development

# Update version in files
# Update CHANGELOG.md with new version
git commit -m "chore(release): bump version to 2.1.0"
```

### 2. Release to Main
```bash
git checkout main
git pull origin main
git merge --no-ff release/v2.1.0 -m "Release v2.1.0"
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin main --tags
```

### 3. Sync Back to Development
```bash
git checkout development
git pull origin development
git merge --no-ff main -m "Sync v2.1.0 to development"
git push origin development
```

## CHANGELOG Format

Keep `CHANGELOG.md` updated following "Keep a CHANGELOG" format:

```markdown
# Changelog

All notable changes documented here.

## [Unreleased]
### Added
- New feature

### Fixed
- Fixed bug

## [1.0.0] - 2026-07-01
### Added
- Initial release
```

## Version Bump Checklist

Before releasing, update:

- [ ] `CHANGELOG.md` — new version section with date
- [ ] Version references in docs if applicable
- [ ] Git tag annotation — descriptive release notes

## Release Cadence

**Recommended:**
- Features: Monthly minor releases (1.1.0 → 1.2.0)
- Hotfixes: As needed (1.2.0 → 1.2.1)
- Major: Annually or when breaking changes accumulate

## Post-Release

After release:

1. ✅ Verify release on GitHub
2. ✅ Test changes in staging
3. ✅ Update project documentation if needed
4. ✅ Announce release
5. ✅ Close related GitHub issues
