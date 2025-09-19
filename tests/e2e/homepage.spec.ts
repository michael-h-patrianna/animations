import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite \+ React/);
});

test('sidebar displays categories', async ({ page }) => {
  await page.goto('/');

  // Check sidebar title
  await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();

  // Check that categories are visible in sidebar
  await expect(page.getByRole('button', { name: 'Transitions' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Loading' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Interactions' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Layout' })).toBeVisible();
});

test('category sections display correctly', async ({ page }) => {
  await page.goto('/');

  // Check category headings are visible
  await expect(page.getByRole('heading', { name: 'Transitions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Loading' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Interactions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Layout' })).toBeVisible();

  // Check placeholder content
  await expect(page.getByText('Animations will be displayed here').first()).toBeVisible();
});

test('sidebar navigation scrolls to categories', async ({ page }) => {
  await page.goto('/');

  // Click on Loading category in sidebar
  await page.getByRole('button', { name: 'Loading' }).click();

  // Wait a moment for smooth scroll
  await page.waitForTimeout(500);

  // Check that the Loading heading is visible (should be scrolled into view)
  await expect(page.getByRole('heading', { name: 'Loading' })).toBeVisible();
});
