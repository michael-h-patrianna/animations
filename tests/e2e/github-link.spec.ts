import { test, expect } from './fixtures/catalog.fixture'

test.describe('GitHub Link', () => {
  test('header GitHub link has correct href and opens in new tab', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // The GitHub link is in the MobileHeader (visible at all viewports as a header element)
    const link = catalogPage.page.locator('[data-testid="github-link"]')

    // Link may only be in the mobile header — check at mobile viewport
    if ((await link.count()) === 0) {
      // Try at mobile viewport
      await catalogPage.page.setViewportSize({ width: 375, height: 667 })
      await expect(link).toBeVisible({ timeout: 5_000 })
    }

    // Correct href pointing to the GitHub repository
    await expect(link).toHaveAttribute('href', /github\.com/)

    // Opens in new tab (target="_blank") for external links
    await expect(link).toHaveAttribute('target', '_blank')

    // Has accessible label
    await expect(link).toHaveAttribute('aria-label', /GitHub/i)
  })
})
