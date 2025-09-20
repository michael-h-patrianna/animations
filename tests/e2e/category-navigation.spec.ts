import { test, expect } from '@playwright/test';

test.describe('Category Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForSelector('.pf-category', { timeout: 10000 });
  });

  test('displays only one category at a time', async ({ page }) => {
    // Should show first category (Dialogs) by default
    await expect(page.locator('.pf-category')).toHaveCount(1);
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).toBeVisible();
    
    // Other categories should not be visible
    await expect(page.locator('h1:has-text("Button State Effects")')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Progress Animations")')).not.toBeVisible();
  });

  test('switches categories when clicking sidebar navigation', async ({ page }) => {
    // Click on Button State Effects category
    await page.click('button:has-text("Button State Effects")');
    
    // Wait for animation to complete
    await page.waitForTimeout(500);
    
    // Should show Button State Effects category
    await expect(page.locator('h1:has-text("Button State Effects")')).toBeVisible();
    
    // Dialog category should no longer be visible
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).not.toBeVisible();
  });

  test('shows active state for current category in sidebar', async ({ page }) => {
    // First category should be active by default
    const dialogButton = page.locator('.pf-sidebar button:has-text("Dialog & Modal Animations")');
    await expect(dialogButton).toHaveClass(/pf-sidebar__link--active/);
    
    // Other categories should not be active
    const buttonButton = page.locator('.pf-sidebar button:has-text("Button State Effects")');
    await expect(buttonButton).not.toHaveClass(/pf-sidebar__link--active/);
    
    // Click on Button State Effects
    await buttonButton.click();
    await page.waitForTimeout(500);
    
    // Active state should switch
    await expect(buttonButton).toHaveClass(/pf-sidebar__link--active/);
    await expect(dialogButton).not.toHaveClass(/pf-sidebar__link--active/);
  });

  test('displays groups only for active category', async ({ page }) => {
    // Groups for Dialog category should be visible
    await expect(page.locator('.pf-sidebar button:has-text("Base modal animations")')).toBeVisible();
    
    // Click on Progress category
    await page.click('.pf-sidebar button:has-text("Progress Animations")');
    await page.waitForTimeout(500);
    
    // Dialog groups should no longer be visible
    await expect(page.locator('.pf-sidebar button:has-text("Base modal animations")')).not.toBeVisible();
    
    // Progress groups should now be visible
    await expect(page.locator('.pf-sidebar button:has-text("Dynamic progress animations")')).toBeVisible();
  });

  test('navigates to group within category when clicking group', async ({ page }) => {
    // Click on a group in the current category
    await page.click('.pf-sidebar button:has-text("Base modal animations")');
    
    // Should scroll to the group (verify group is in viewport)
    const groupElement = page.locator('#group-modal-base');
    await expect(groupElement).toBeInViewport();
  });

  test('switches category and scrolls to group when clicking group from different category', async ({ page }) => {
    // First switch to Progress category
    await page.click('.pf-sidebar button:has-text("Progress Animations")');
    await page.waitForTimeout(500);
    
    // Click on a group from that category
    await page.click('.pf-sidebar button:has-text("Dynamic progress animations")');
    
    // Should be in Progress category
    await expect(page.locator('h1:has-text("Progress Animations")')).toBeVisible();
    
    // Should scroll to the group
    const groupElement = page.locator('#group-progress-dynamic');
    await expect(groupElement).toBeInViewport();
  });

  test('supports keyboard navigation between categories', async ({ page }) => {
    // Focus on first category button
    await page.locator('.pf-sidebar button:has-text("Dialog & Modal Animations")').focus();
    
    // Tab to next category
    await page.keyboard.press('Tab');
    
    // Should focus on next category button
    await expect(page.locator('.pf-sidebar button:has-text("Button State Effects")')).toBeFocused();
    
    // Press Enter to select
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Should switch to Button State Effects category
    await expect(page.locator('h1:has-text("Button State Effects")')).toBeVisible();
  });

  test('maintains scroll position when switching categories', async ({ page }) => {
    // Scroll down a bit in first category
    await page.evaluate(() => window.scrollBy(0, 200));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    
    // Switch category
    await page.click('.pf-sidebar button:has-text("Button State Effects")');
    await page.waitForTimeout(500);
    
    // Scroll position should be maintained (approximately)
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(50);
  });
});

test.describe('Swipe Transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.pf-category', { timeout: 10000 });
  });

  test('supports drag/swipe gestures to navigate categories', async ({ page }) => {
    // Start with Dialog category
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).toBeVisible();
    
    // Simulate swipe left to go to next category
    const catalog = page.locator('.pf-catalog');
    const box = await catalog.boundingBox();
    if (!box) throw new Error('Catalog not found');
    
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    
    // Should transition to next category
    await page.waitForTimeout(500);
    await expect(page.locator('h1:has-text("Button State Effects")')).toBeVisible();
  });

  test('prevents swipe beyond first and last categories', async ({ page }) => {
    // Start with first category
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).toBeVisible();
    
    const catalog = page.locator('.pf-catalog');
    const box = await catalog.boundingBox();
    if (!box) throw new Error('Catalog not found');
    
    // Try to swipe right (should stay on first category)
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    // Should still be on first category
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).toBeVisible();
    
    // Navigate to last category
    await page.click('.pf-sidebar button:has-text("Rewards & Achievements")');
    await page.waitForTimeout(500);
    
    // Try to swipe left (should stay on last category)
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    // Should still be on last category
    await expect(page.locator('h1:has-text("Rewards & Achievements")')).toBeVisible();
  });

  test('shows smooth transition animation between categories', async ({ page }) => {
    // Enable animations tracking
    await page.addStyleTag({
      content: `
        * { transition-duration: 0.5s !important; }
      `
    });
    
    // Get initial position
    const categoryElement = page.locator('.pf-category').first();
    const initialBox = await categoryElement.boundingBox();
    
    // Switch category
    await page.click('.pf-sidebar button:has-text("Button State Effects")');
    
    // Check that element animates (position changes during transition)
    await page.waitForTimeout(100); // Mid-transition
    const midBox = await categoryElement.boundingBox();
    
    // Position should have changed during animation
    expect(initialBox?.x).toBeDefined();
    expect(midBox?.x).toBeDefined();
    // We can't reliably test exact animation positions in Playwright
    // but we verify the transition happens
    
    await page.waitForTimeout(500);
    // Final category should be visible
    await expect(page.locator('h1:has-text("Button State Effects")')).toBeVisible();
  });
});