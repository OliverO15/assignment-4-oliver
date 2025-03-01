import { test, expect } from '@playwright/test';

test("should navigate to index page and have correct title", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("/");
  // The page should contain a title element with the text "TODO 📃"
  await expect(page.title()).resolves.toMatch("TODO 📃");
});

test.describe.serial('Todo Test Suite', () => {
  // To run before each to clear the page
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for the API call to complete
    await page.waitForResponse(response => response.url().includes('/api/todos') && response.request().method() === 'GET');

    const items = await page.getByRole('listitem').all();

    for (let i = 0; i < items.length; i++) {
      const items = await page.getByRole('listitem').all();
      const row = items[0];

      if (!row) {
        continue;
      }

      const deleteButton = row.getByRole('button');

      // Wait for the button to be visible and clickable before clicking
      await deleteButton.waitFor({ state: 'visible', timeout: 5000 });

      await deleteButton.click();

      // Wait for the API response, but fail gracefully after a timeout
      await Promise.race([
        page.waitForResponse(response =>
          response.url().includes('/api/todos') && response.request().method() === 'GET'
        ),
        page.waitForTimeout(5000), // Fallback timeout to prevent getting stuck
      ]);
    }

    // Check if the list is empty
    const listItems = await page.getByRole('listitem').all();
    expect(listItems).toHaveLength(0);
  });

  test('todo list should be empty', async ({ page }) => {
    // Get all the list items
    const listItems = await page.getByRole('listitem').all();
    // Check if the list is empty
    expect(listItems).toHaveLength(0);
  });

  test('should add a new todo', async ({ page }) => {
    // Add a new todo
    await page.getByPlaceholder('Add a new todo...').fill('Learn Playwright');
    const button = await page.getByRole('button', { name: 'Add ✨' });
    expect(button).not.toBeNull();
    await button.click();

    await page.waitForResponse(response => response.url().includes('/api/todos') && response.request().method() === 'GET');

    const list = page.getByRole('listitem');
    await expect(list).toHaveCount(1);
  });

  test('should add another todo', async ({ page }) => {
    // Add a new todo
    await page.getByPlaceholder('Add a new todo...').fill('Learn Playwright 1');
    const button = await page.getByRole('button', { name: 'Add ✨' });
    expect(button).not.toBeNull();
    await button.click();

    await page.waitForResponse(response => response.url().includes('/api/todos') && response.request().method() === 'GET');

    await page.getByPlaceholder('Add a new todo...').fill('Learn Playwright 2');
    await button.click();

    await page.waitForResponse(response => response.url().includes('/api/todos') && response.request().method() === 'GET');

    const list = page.getByRole('listitem');
    await expect(list).toHaveCount(2);
  });

  test('should remove a todo from the list', async ({ page }) => {
    // Add a new todo
    await page.getByPlaceholder('Add a new todo...').fill('Learn Playwright');
    const button = await page.getByRole('button', { name: 'Add ✨' });
    expect(button).not.toBeNull();
    await button.click();

    await page.waitForResponse(response => response.url().includes('/api/todos') && response.request().method() === 'GET');

    let items = page.getByRole('listitem');
    await expect(items).toHaveCount(1);

    // Remove the todo
    const removeButton = await page.locator('li button');
    expect(removeButton).not.toBeNull();
    await removeButton.click();

    await page.waitForResponse(response => response.url().includes('/api/todos') && response.request().method() === 'GET');

    items = page.getByRole('listitem');
    await expect(items).toHaveCount(0);
  });
});
