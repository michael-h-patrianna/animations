import { test, expect } from './fixtures/catalog.fixture'

/**
 * Tests code mode switching via the mobile drawer. The mobile drawer has its own
 * CodeModeSwitch instance — mode changes there must propagate to URL and card content.
 */
test.describe('Mobile Code Mode Switching', () => {
  test('switching to CSS mode in drawer updates URL and cards', async ({ mobilePage, page }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Open drawer and switch to CSS
    await mobilePage.openDrawer()

    // Verify starting in Framer mode
    const initialMode = await mobilePage.activeCodeMode()
    expect(initialMode.trim()).toBe('Framer')

    await mobilePage.selectCssMode()

    // URL should change to -css
    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 5_000 })
      .toBe('/text-effects-css')

    // Close drawer and verify cards show CSS tags
    await mobilePage.closeDrawer()
    const firstCard = page.locator('[data-animation-id]').first()
    await expect(firstCard).toBeVisible({ timeout: 5_000 })
    await expect(firstCard.locator('[data-testid="card-meta"]')).toContainText('CSS')
  })

  test('mode persists when navigating via drawer group links', async ({ mobilePage, page }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Switch to CSS mode
    await mobilePage.openDrawer()
    await mobilePage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)

    // Close drawer, then reopen to navigate to a different group
    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()

    await mobilePage.openDrawer()
    await mobilePage.clickDrawerGroup(1)
    await mobilePage.expectDrawerClosed()

    // New group should also be in CSS mode
    const pathname = new URL(page.url()).pathname
    expect(pathname).toMatch(/-css$/)
  })

  test('switching back to Framer mode in drawer restores framer URL', async ({
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('text-effects-css')

    await mobilePage.openDrawer()
    await mobilePage.selectFramerMode()

    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 5_000 })
      .toBe('/text-effects-framer')

    // Cards should show FRAMER tag
    await mobilePage.closeDrawer()
    const firstCard = page.locator('[data-animation-id]').first()
    await expect(firstCard).toBeVisible({ timeout: 5_000 })
    await expect(firstCard.locator('[data-testid="card-meta"]')).toContainText('FRAMER')
  })
})
