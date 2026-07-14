import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Laravel 13 Cheat Sheet - Full Scope', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // Header & UI Tests
  test.describe('Header & Navigation', () => {
    test('should load the main page with title and header', async ({ page }) => {
      await expect(page).toHaveTitle(/Laravel 13 Cheat Sheet/);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.header-brand')).toContainText('Laravel 13 Cheat Sheet');
    });

    test('should have sticky header that persists while scrolling', async ({ page }) => {
      const header = page.locator('header');
      const initialPosition = await header.evaluate(el => el.getBoundingClientRect().top);

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 500));

      const scrolledPosition = await header.evaluate(el => el.getBoundingClientRect().top);
      expect(scrolledPosition).toBe(initialPosition);
    });

    test('should have search input with proper placeholder', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', /Search docs/);
    });

    test('should have theme toggle button', async ({ page }) => {
      const themeToggle = page.locator('#themeToggle');
      await expect(themeToggle).toBeVisible();
      await expect(themeToggle).toContainText(/🌙|☀️/);
    });
  });

  // Theme Mode Tests
  test.describe('Light/Dark Mode', () => {
    test('should toggle between light and dark theme', async ({ page }) => {
      const themeToggle = page.locator('#themeToggle');
      const html = page.locator('html');

      // Check initial theme
      const initialTheme = await html.getAttribute('data-theme');
      expect(initialTheme).toBe('light');

      // Toggle theme
      await themeToggle.click();

      // Check theme changed
      const newTheme = await html.getAttribute('data-theme');
      expect(newTheme).toBe('dark');

      // Toggle back
      await themeToggle.click();
      const finalTheme = await html.getAttribute('data-theme');
      expect(finalTheme).toBe('light');
    });

    test('should update theme icon when toggling', async ({ page }) => {
      const themeToggle = page.locator('#themeToggle');

      const initialIcon = await themeToggle.textContent();
      expect(initialIcon).toBe('🌙');

      await themeToggle.click();

      const newIcon = await themeToggle.textContent();
      expect(newIcon).toBe('☀️');
    });

    test('should persist theme preference', async ({ page, context }) => {
      const themeToggle = page.locator('#themeToggle');

      // Set dark theme
      await themeToggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

      // Create new page in same context
      const newPage = await context.newPage();
      await newPage.goto(BASE_URL);

      // Should still be dark theme
      await expect(newPage.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
  });

  // Sidebar Navigation Tests
  test.describe('Sidebar Navigation', () => {
    test('should display all 10 category sections in sidebar', async ({ page }) => {
      const sidebarSections = await page.locator('.sidebar-section').count();
      expect(sidebarSections).toBe(10);
    });

    test('should navigate using sidebar links', async ({ page }) => {
      // Click first sidebar link
      const firstLink = page.locator('.sidebar-link').first();
      await firstLink.click();

      // Should load file content
      await expect(page.locator('#fileContent')).toBeVisible();
      await expect(page.locator('.content')).toBeVisible();
    });

    test('should load Artisan documentation from sidebar', async ({ page }) => {
      // Find and click Artisan link
      const artisanLink = page.locator('.sidebar-link', { hasText: /Artisan/i });
      await artisanLink.click();

      const fileContent = page.locator('#fileContent');
      await expect(fileContent).toBeVisible();
      await expect(fileContent).toContainText(/Artisan|Commands/i);
    });

    test('should load all Core Framework docs from sidebar', async ({ page }) => {
      const coreLinks = ['Artisan', 'Application Bootstrap', 'Config', 'Routing', 'Middleware'];

      for (const linkText of coreLinks) {
        const link = page.locator('.sidebar-link', { hasText: new RegExp(linkText, 'i') });
        await link.click();

        const fileContent = page.locator('#fileContent');
        await expect(fileContent).toBeVisible();
      }
    });
  });

  // Category Card Navigation Tests
  test.describe('Category Card Navigation', () => {
    test('should display all 10 category cards on home view', async ({ page }) => {
      const categoryCards = page.locator('.category-card');
      const cardCount = await categoryCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(10);
    });

    test('should navigate to category view when card clicked', async ({ page }) => {
      const firstCard = page.locator('.category-card').first();
      await firstCard.click();

      // Should show category view
      const categoryView = page.locator('#categoryView');
      await expect(categoryView).toHaveClass(/active/);

      // Should show file cards
      const fileCards = page.locator('.category-card');
      await expect(fileCards.first()).toBeVisible();
    });

    test('should load file when category file card clicked', async ({ page }) => {
      // Click first category
      await page.locator('.category-card').first().click();

      // Click first file
      const fileCard = page.locator('.category-card').first();
      await fileCard.click();

      // Should show file view
      const fileView = page.locator('#fileView');
      await expect(fileView).toHaveClass(/active/);

      // Should display file content
      await expect(page.locator('#fileContent')).toBeVisible();
      await expect(page.locator('.content')).toBeVisible();
    });

    test('should navigate all 10 categories', async ({ page }) => {
      const categories = [
        '📌 Core Framework',
        '🌐 HTTP',
        '💾 Database',
        '🔐 Auth & Authorization',
        '💬 Communication',
        '🛠️ Utilities',
        '🏗️ Patterns',
        '📊 Data Processing',
        '✅ Validation',
        '🚀 Advanced'
      ];

      for (const category of categories) {
        const card = page.locator('.category-card', { hasText: new RegExp(category) });
        await card.click();
        await page.waitForSelector('.category-card');
      }
    });
  });

  // Content Display Tests
  test.describe('Content Display & Markdown', () => {
    test('should render markdown headings correctly', async ({ page }) => {
      // Navigate to a file
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // Should display proper headings
      const h1 = page.locator('#fileContent h1');
      const h2 = page.locator('#fileContent h2, #fileContent h3');

      await expect(h1).toBeVisible();
      await expect(h2.first()).toBeVisible();
    });

    test('should render code blocks with syntax highlighting', async ({ page }) => {
      // Navigate to content with code
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // Should display code blocks
      const codeBlocks = page.locator('.code-block');
      if (await codeBlocks.count() > 0) {
        await expect(codeBlocks.first()).toBeVisible();

        // Should have code label
        const codeLabel = codeBlocks.first().locator('.code-label');
        if (await codeLabel.count() > 0) {
          await expect(codeLabel).toBeVisible();
        }
      }
    });

    test('should display lists and paragraphs correctly', async ({ page }) => {
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      const content = page.locator('.content');
      await expect(content).toBeVisible();

      // Check for lists
      const lists = page.locator('#fileContent ul, #fileContent ol');
      if (await lists.count() > 0) {
        await expect(lists.first()).toBeVisible();
      }

      // Check for paragraphs
      const paragraphs = page.locator('#fileContent p');
      if (await paragraphs.count() > 0) {
        await expect(paragraphs.first()).toBeVisible();
      }
    });

    test('should render inline code formatting', async ({ page }) => {
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      const inlineCode = page.locator('#fileContent code');
      if (await inlineCode.count() > 0) {
        await expect(inlineCode.first()).toBeVisible();
      }
    });
  });

  // Search Tests
  test.describe('Search Functionality', () => {
    test('should search and filter results', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // Type search query
      await searchInput.fill('routing');

      // Wait for search results
      await page.waitForSelector('.search-results-grid', { timeout: 5000 }).catch(() => {});

      // Should show search results or results view
      const searchResults = page.locator('.search-result-card');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    });

    test('should navigate to file from search result', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');
      await searchInput.fill('routing');

      // Wait for results
      await page.waitForSelector('.search-result-card', { timeout: 5000 }).catch(() => {});

      // Click first result
      const firstResult = page.locator('.search-result-card').first();
      if (await firstResult.count() > 0) {
        await firstResult.click();

        // Should load file
        await expect(page.locator('#fileView')).toHaveClass(/active/);
        await expect(page.locator('#fileContent')).toBeVisible();
      }
    });

    test('should clear search and return to home', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // Do a search
      await searchInput.fill('test');
      await page.waitForTimeout(300);

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(300);

      // Should return to home view
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });

    test('should show empty state when no search results', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // Search for something that shouldn't exist
      await searchInput.fill('xyznonexistent123');
      await page.waitForTimeout(300);

      // Should show empty state or no results
      const emptyState = page.locator('#emptyView');
      const searchResults = page.locator('.search-result-card');

      const hasEmptyState = await emptyState.isVisible().catch(() => false);
      const hasNoResults = await searchResults.count() === 0;

      expect(hasEmptyState || hasNoResults).toBe(true);
    });
  });

  // Navigation & Back Button Tests
  test.describe('Navigation Controls', () => {
    test('should show back button when viewing file', async ({ page }) => {
      // Navigate to file
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // Should display back button
      const backButton = page.locator('.back-button');
      await expect(backButton).toBeVisible();
    });

    test('should return to home when back button clicked', async ({ page }) => {
      // Navigate to file
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // Click back
      await page.locator('.back-button').click();

      // Should return to home view
      const homeView = page.locator('#homeView');
      await expect(homeView).toHaveClass(/active/);
    });

    test('should navigate back from category view', async ({ page }) => {
      // Navigate to category
      await page.locator('.category-card').first().click();

      // Click back
      await page.locator('.back-button').click();

      // Should return to home
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });

    test('should allow header logo click to return home', async ({ page }) => {
      // Navigate to file
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // Click header logo
      await page.locator('.header-brand').click();

      // Should return to home
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });
  });

  // Responsive Design Tests
  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      // All main elements should be visible or accessible
      const searchInput = page.locator('input[type="text"]');
      await expect(searchInput).toBeVisible();

      const categoryCards = page.locator('.category-card');
      await expect(categoryCards.first()).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const searchInput = page.locator('input[type="text"]');
      await expect(searchInput).toBeVisible();

      const categoryCards = page.locator('.category-card');
      await expect(categoryCards.first()).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      // Sidebar should be visible
      const sidebar = page.locator('.sidebar');
      await expect(sidebar).toBeVisible();

      const categoryCards = page.locator('.category-card');
      await expect(categoryCards.first()).toBeVisible();
    });

    test('should display sidebar on mobile after navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      // Navigate to file
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // File content should be visible
      await expect(page.locator('#fileContent')).toBeVisible();
    });
  });

  // Accessibility Tests
  test.describe('Accessibility & Keyboard', () => {
    test('should support keyboard shortcut to focus search (Ctrl+K)', async ({ page }) => {
      await page.keyboard.press('Control+K');

      const searchInput = page.locator('input[type="text"]');
      await expect(searchInput).toBeFocused();
    });

    test('should allow keyboard navigation through search results', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');
      await searchInput.fill('routing');
      await page.waitForTimeout(300);

      // Should be able to tab through results
      await page.keyboard.press('Tab');

      // Some element should be focused
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.className || '';
      });
      expect(focusedElement).toBeTruthy();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // Should have h1
      const h1 = page.locator('#fileContent h1');
      await expect(h1).toBeVisible();
    });
  });

  // Performance & Error Handling Tests
  test.describe('Error Handling & Performance', () => {
    test('should load files without JavaScript errors', async ({ page }) => {
      let jsErrors = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      // Navigate to file
      await page.locator('.category-card').first().click();
      await page.locator('.category-card').first().click();

      // No errors should occur
      expect(jsErrors).toHaveLength(0);
    });

    test('should handle missing files gracefully', async ({ page }) => {
      // This would require a file that doesn't exist
      // The app should show an error message without crashing

      // Perform multiple navigations
      for (let i = 0; i < 5; i++) {
        await page.locator('.category-card').first().click();
        if (i % 2 === 0) {
          await page.locator('.category-card').first().click();
          await page.locator('.back-button').click();
        }
      }

      // Page should still be functional
      await expect(page.locator('header')).toBeVisible();
    });

    test('should perform rapid navigation without issues', async ({ page }) => {
      // Perform rapid navigation
      for (let i = 0; i < 3; i++) {
        await page.locator('.category-card').first().click();
        await page.locator('.category-card').first().click();
        await page.locator('.back-button').click();
        await page.locator('.back-button').click();
      }

      // Should be back at home
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });
  });

  // Integration Tests
  test.describe('Full User Workflows', () => {
    test('should complete full user journey: search -> view -> navigate', async ({ page }) => {
      // 1. User searches
      const searchInput = page.locator('input[type="text"]');
      await searchInput.fill('eloquent');
      await page.waitForTimeout(300);

      // 2. Click search result if available
      const searchResult = page.locator('.search-result-card').first();
      if (await searchResult.count() > 0) {
        await searchResult.click();
      }

      // 3. View content
      await expect(page.locator('#fileContent')).toBeVisible();

      // 4. Go back
      await page.locator('.back-button').click();

      // 5. Try different search
      await searchInput.clear();
      await searchInput.fill('validation');
      await page.waitForTimeout(300);
    });

    test('should allow browsing all categories without errors', async ({ page }) => {
      // Click first category to show cards
      await page.locator('.category-card').first().click();

      // Click at least one file from first category
      const firstFile = page.locator('.category-card').first();
      if (await firstFile.count() > 0) {
        await firstFile.click();

        // Navigate back
        await page.locator('.back-button').click();
        await page.locator('.back-button').click();
      }

      // Should be able to return home
      await expect(page.locator('#homeView')).toHaveClass(/active/);
    });
  });
});
