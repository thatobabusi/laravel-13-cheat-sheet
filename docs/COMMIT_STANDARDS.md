# Commit Standards

Semantic commit messages that enable automated changelog generation, clear history, and effective communication.

## Format

```
<type>(<scope>): <subject>
↓     ↓              ↓
│     │              └─ Lowercase, no period, <50 chars
│     └─ Feature area (auth, payment, api, etc)
└─ Commit type (feat, fix, test, docs, etc)

<blank line>

<body explaining WHY not WHAT>

<blank line>

<footer with issue references>
Closes #123
```

## Types

- **feat** — New feature
- **fix** — Bug fix  
- **docs** — Documentation only
- **style** — Formatting, no logic change
- **refactor** — Code restructure, no behavior change
- **perf** — Performance improvement
- **test** — Tests addition/update
- **chore** — Dependencies, build, tooling
- **ci** — CI/CD configuration
- **revert** — Revert previous commit

## Examples

### Feature
```
feat(cheat-sheet): add Laravel 13 queue section

Comprehensive coverage of Laravel 13 queue system including jobs,
chains, batches, and rate limiting examples.

Closes #42
```

### Bug Fix
```
fix(docs): correct authentication example

Fixed incorrect Sanctum token example that was missing the
authorization header setup.

Closes #89
```

### Documentation
```
docs(readme): add quick reference section

Added TL;DR section for users wanting immediate access to common
commands without browsing full sections.
```

## Guidelines

✅ **Do:**
- Use imperative mood ("add" not "adds")
- Lowercase first letter
- No period at end
- Keep subject under 50 characters
- Explain why in body, not what
- Reference issues: `Closes #123`
- Atomic commits (one concern per commit)

❌ **Don't:**
- Mix concerns in one commit
- Use vague messages ("fixed stuff")
- Add period at end of subject
- Write body without blank line separator
- Forget to reference related issues
- Make commits too large to review
