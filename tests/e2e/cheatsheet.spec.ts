import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Laravel 13 Cheat Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should load the main page with title and header', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Laravel 13 Cheat Sheet/);

    // Check header exists
    await expect(page.locator('h1')).toContainText('Laravel 13 Cheat Sheet');

    // Check search box exists
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Search topics/);
  });

  test('should display all 10 categories in sidebar', async ({ page }) => {
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
      const button = page.locator('button', { hasText: category });
      await expect(button).toBeVisible();
    }
  });

  test('should load files when cards are clicked', async ({ page }) => {
    // Click first category card
    await page.locator('.section-card').first().click();

    // Wait for files to be displayed
    await page.waitForSelector('.section-card');

    // Click first file card
    const fileCard = page.locator('.section-card').first();
    await fileCard.click();

    // Should show file content
    await expect(page.locator('#fileContent')).toBeVisible();
    await expect(page.locator('.file-view')).toBeVisible();
  });

  test('should load artisan.md when core/artisan card clicked', async ({ page }) => {
    // Navigate to Core Framework
    await page.locator('button', { hasText: '📌 Core Framework' }).click();

    // Click Artisan card
    await page.locator('.section-card', { hasText: 'Artisan' }).click();

    // Should display artisan content
    const fileContent = page.locator('#fileContent');
    await expect(fileContent).toBeVisible();
    await expect(fileContent).toContainText(/Artisan|PHP/i);
  });

  test('should load routing.md when routing card clicked', async ({ page }) => {
    // Navigate to Core Framework
    await page.locator('button', { hasText: '📌 Core Framework' }).click();

    // Click Routing card
    await page.locator('.section-card', { hasText: 'Routing' }).click();

    // Should display routing content
    const fileContent = page.locator('#fileContent');
    await expect(fileContent).toBeVisible();
    await expect(fileContent).toContainText(/Route|Routing/i);
  });

  test('should load database category files', async ({ page }) => {
    // Navigate to Database
    await page.locator('button', { hasText: '💾 Database' }).click();

    // Click Eloquent ORM card
    await page.locator('.section-card', { hasText: 'Eloquent' }).click();

    // Should display content
    const fileContent = page.locator('#fileContent');
    await expect(fileContent).toBeVisible();
    await expect(fileContent).toContainText(/Eloquent|Model/i);
  });

  test('should search and filter sections', async ({ page }) => {
    // Type in search
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('routing');

    // Wait for search results
    await page.waitForSelector('.search-result');

    // Should show search results
    const searchResults = page.locator('.search-result');
    const count = await searchResults.count();
    expect(count).toBeGreaterThan(0);

    // Click a search result
    await searchResults.first().click();

    // Should load the file
    await expect(page.locator('#fileContent')).toBeVisible();
  });

  test('should search for database topics', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('eloquent');

    // Wait for results
    await page.waitForSelector('.search-result');

    // Should have results
    const results = page.locator('.search-result');
    await expect(results.first()).toContainText(/Eloquent/i);
  });

  test('should return to categories when back button clicked', async ({ page }) => {
    // Navigate to a file
    await page.locator('.section-card').first().click();
    await page.locator('.section-card').first().click();

    // Click back
    await page.locator('.back-btn').click();

    // Should return to categories view
    await expect(page.locator('#categoriesView')).toHaveClass(/active/);
  });

  test('should clear search and return to categories', async ({ page }) => {
    // Do a search
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('test');
    await page.waitForSelector('.search-result');

    // Clear search
    await searchInput.clear();

    // Should return to categories
    await expect(page.locator('#categoriesView')).toHaveClass(/active/);
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still be usable
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();

    // Click a category
    await page.locator('.section-card').first().click();
    await expect(page.locator('.section-card').first()).toBeVisible();
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Press Cmd+K / Ctrl+K
    await page.keyboard.press('Control+K');

    // Search input should be focused
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeFocused();
  });
});
