import { expect, test } from '@playwright/test'

test.describe('Category Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for the app to load
    await page.waitForSelector('.pf-category', { timeout: 10000 })
  })

  test('displays only one category at a time', async ({ page }) => {
    // Should show first category (Dialogs) by default
    await expect(page.locator('.pf-category')).toHaveCount(1)
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).toBeVisible()

    // Other categories should not be visible
    await expect(page.locator('h1:has-text("Button State Effects")')).not.toBeVisible()
    await expect(page.locator('h1:has-text("Progress Animations")')).not.toBeVisible()
  })

  test('switches categories when clicking sidebar navigation', async ({ page }) => {
    // Click on Button State Effects category
    await page.click('button:has-text("Button State Effects")')

    // Wait for animation to complete
    await page.waitForTimeout(500)

    // Should show Button State Effects category
    await expect(page.locator('h1:has-text("Button State Effects")')).toBeVisible()

    // Dialog category should no longer be visible
    await expect(page.locator('h1:has-text("Dialog & Modal Animations")')).not.toBeVisible()
  })

  test('shows active state for current category in sidebar', async ({ page }) => {
    // First category should be active by default
    const dialogButton = page.locator('.pf-sidebar button:has-text("Dialog & Modal Animations")')
    await expect(dialogButton).toHaveClass(/pf-sidebar__link--active/)

    // Other categories should not be active
    const buttonButton = page.locator('.pf-sidebar button:has-text("Button State Effects")')
    await expect(buttonButton).not.toHaveClass(/pf-sidebar__link--active/)

    // Click on Button State Effects
    await buttonButton.click()
    await page.waitForTimeout(500)

    // Active state should switch
    await expect(buttonButton).toHaveClass(/pf-sidebar__link--active/)
    await expect(dialogButton).not.toHaveClass(/pf-sidebar__link--active/)
  })

  test('displays groups only for active category', async ({ page }) => {
    // Groups for Dialog category should be visible
    await expect(page.locator('.pf-sidebar button:has-text("Base modal animations")')).toBeVisible()

    // Click on Progress category
    await page.click('.pf-sidebar button:has-text("Progress Animations")')
    await page.waitForTimeout(500)

    // Dialog groups should no longer be visible
    await expect(
      page.locator('.pf-sidebar button:has-text("Base modal animations")')
    ).not.toBeVisible()

    // Progress groups should now be visible
    await expect(
      page.locator('.pf-sidebar button:has-text("Dynamic progress animations")')
    ).toBeVisible()
  })

  test('navigates to group within category when clicking group', async ({ page }) => {
    // Click on a group in the current category
    await page.click('.pf-sidebar button:has-text("Base modal animations")')

    // Should scroll to the group (verify group is in viewport)
    const groupElement = page.locator('#group-modal-base')
    await expect(groupElement).toBeInViewport()
  })

  test('switches category and scrolls to group when clicking group from different category', async ({
    page,
  }) => {
    // First switch to Progress category
    await page.click('.pf-sidebar button:has-text("Progress Animations")')
    await page.waitForTimeout(500)

    // Click on a group from that category
    await page.click('.pf-sidebar button:has-text("Dynamic progress animations")')

    // Should be in Progress category
    await expect(page.locator('h1:has-text("Progress Animations")')).toBeVisible()

    // Should scroll to the group
    const groupElement = page.locator('#group-progress-dynamic')
    await expect(groupElement).toBeInViewport()
  })

  test('supports keyboard navigation between categories', async ({ page }) => {
    // Focus on first category button
    await page.locator('.pf-sidebar button:has-text("Dialog & Modal Animations")').focus()

    // Tab to next category
    await page.keyboard.press('Tab')

    // Should focus on next category button
    await expect(page.locator('.pf-sidebar button:has-text("Button State Effects")')).toBeFocused()

    // Press Enter to select
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)

    // Should switch to Button State Effects category
    await expect(page.locator('h1:has-text("Button State Effects")')).toBeVisible()
  })

  test('maintains scroll position when switching categories', async ({ page }) => {
    // Scroll down a bit in first category
    await page.evaluate(() => window.scrollBy(0, 200))
    const scrollBefore = await page.evaluate(() => window.scrollY)

    // Switch category
    await page.click('.pf-sidebar button:has-text("Button State Effects")')
    await page.waitForTimeout(500)

    // Scroll position should be maintained (approximately)
    const scrollAfter = await page.evaluate(() => window.scrollY)
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(50)
  })
})
