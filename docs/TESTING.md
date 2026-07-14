# End-to-End Testing Guide

Complete e2e test suite using Playwright to verify the cheatsheet UI works correctly.

## Setup

### Install Dependencies

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (browser visible)
```bash
npm run test:e2e:headed
```

### Debug mode (step through each test)
```bash
npm run test:e2e:debug
```

## What's Tested

### Page Loading
- ✅ Page title loads correctly
- ✅ Header and search box visible
- ✅ All 10 categories display

### File Loading
- ✅ Clicking category cards loads files
- ✅ Clicking file cards loads markdown content
- ✅ Specific files load correctly:
  - artisan.md
  - routing.md
  - eloquent-orm.md
  - And all other 31 sections

### Search Functionality
- ✅ Search box accepts input
- ✅ Results appear in real-time
- ✅ Results are clickable and load files
- ✅ Search filters work for topics like "eloquent", "routing", etc.

### Navigation
- ✅ Category buttons work
- ✅ Back button returns to categories
- ✅ Clearing search returns to home
- ✅ Multiple navigations work correctly

### Responsive Design
- ✅ Works on mobile (375x667)
- ✅ Works on tablet (768x1024)
- ✅ Works on desktop (1280x800)

### Keyboard Shortcuts
- ✅ Cmd+K / Ctrl+K focuses search
- ✅ Tab navigation works

## Test Coverage

**13 test cases** covering:
- Initial page load
- Category display
- File loading from cards
- Specific section loads (Artisan, Routing, Eloquent)
- Search functionality
- Search result navigation
- Back button behavior
- Search clearing
- Mobile responsiveness
- Keyboard shortcuts

## CI/CD Integration

The tests run automatically:
- All tests: `npm run test:e2e`
- Outputs HTML report in `playwright-report/`
- Retries failed tests 2x in CI

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Tests Timeout
- Increase timeout in playwright.config.ts
- Check if server is running: `python -m http.server 8000 --directory public`

### File Not Found Errors
- Verify markdown files exist in `docs/cheatsheet/`
- Check file paths use `../docs/cheatsheet/` prefix
- Ensure paths are relative to `public/index.html`

## Local Development Workflow

1. Start dev server:
```bash
npm run dev
```

2. In another terminal, run tests in UI mode:
```bash
npm run test:e2e:ui
```

3. Tests auto-reload as you make changes

## Debugging Failed Tests

1. Run in headed mode to see browser:
```bash
npm run test:e2e:headed
```

2. Check HTML report:
```bash
npx playwright show-report
```

3. Use debug mode to step through:
```bash
npm run test:e2e:debug
```

## File Paths Reference

- **Tests:** `tests/e2e/cheatsheet.spec.ts`
- **Config:** `playwright.config.ts`
- **HTML:** `public/index.html`
- **Markdown files:** `docs/cheatsheet/{01-10}/*`

All file paths in tests use the base URL `http://localhost:8000` configured in `playwright.config.ts`.
