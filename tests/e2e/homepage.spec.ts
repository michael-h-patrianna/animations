import { expect, test } from '@playwright/test';

test('displays categories and groups in the sidebar', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
  await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Dialog & Modal Animations' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Base modal animations' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Advanced effects' })).toBeVisible();
});

test('renders animation cards with replay controls', async ({ page }) => {
  await page.goto('/');

  const categoryHeading = page.getByRole('heading', {
    name: /Dialog & Modal Animations/i
  });
  await expect(categoryHeading).toBeVisible();

  const groupSection = page.locator('#group-modal-base');
  await expect(groupSection.getByRole('heading', { name: 'Base modal animations' })).toBeVisible();
  // Check that animation card exists (we no longer display the animation ID directly)
  const animationCard = groupSection.locator('[data-animation-id="modal-base__scale-gentle-pop"]');
  await expect(animationCard).toBeVisible();
  await expect(groupSection.getByRole('button', { name: 'Replay' }).first()).toBeVisible();

  // Ensure replay button remains functional
  await groupSection.getByRole('button', { name: 'Replay' }).first().click();
  // Animation card should still be visible after replay
  await expect(animationCard).toBeVisible();
});

test('sidebar navigation scrolls to target group', async ({ page }) => {
  await page.goto('/');

  const targetGroupButton = page.getByRole('button', { name: 'Advanced effects' });
  await targetGroupButton.click();

  const targetGroup = page.locator('#group-advanced-effects');
  await targetGroup.waitFor();
  await expect(targetGroup.getByRole('heading', { name: 'Advanced effects' })).toBeVisible();
});
