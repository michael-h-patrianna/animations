import { test, expect } from './fixtures/catalog.fixture'

/**
 * Mobile integration tests: complete user journeys combining drawer navigation,
 * code mode switching, code viewer, and viewport transitions.
 *
 * These catch bugs that only appear when mobile-specific features interact
 * with shared application state (code mode, current group, modal state).
 */
test.describe('Mobile Integration Flows', () => {
  test('complete mobile journey: navigate → switch mode → view code → navigate back', async ({
    catalogPage,
    mobilePage,
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await mobilePage.gotoMobile('text-effects-framer')

    // Step 1: Open drawer and switch to CSS mode
    await mobilePage.openDrawer()
    await mobilePage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)

    // Step 2: Close drawer, verify CSS mode active via URL
    await mobilePage.closeDrawer()
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 5_000 })
    expect(new URL(page.url()).pathname).toMatch(/-css$/)

    // Step 3: Navigate to a different group via drawer
    await mobilePage.openDrawer()
    await mobilePage.clickDrawerGroup(2) // Third group
    await mobilePage.expectDrawerClosed()

    // URL should still be in CSS mode (mode persists)
    const pathname = new URL(page.url()).pathname
    expect(pathname).toMatch(/-css$/)

    // Step 4: Open code viewer on the new group
    const newCard = catalogPage.allCards().first()
    await expect(newCard).toBeVisible({ timeout: 10_000 })

    const codeBtn = catalogPage.codeViewerButton(newCard)
    if ((await codeBtn.count()) > 0) {
      await codeBtn.click()
      const modal = catalogPage.codeViewerModal()
      await expect(modal).toBeVisible({ timeout: 10_000 })

      // Close modal
      await page.keyboard.press('Escape')
      await expect(modal).not.toBeVisible()
    }

    // Step 5: Browser back should return to previous group
    await page.goBack()
    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 10_000 })
      .toBe('/text-effects-css')

    // No error boundary
    await catalogPage.expectNoErrorBoundary()
  })

  test('rapid drawer open/close does not corrupt state', async ({ mobilePage }) => {
    await mobilePage.gotoMobile('standard-effects-framer')

    // Rapidly open and close the drawer
    for (let i = 0; i < 3; i++) {
      await mobilePage.openDrawer()
      await mobilePage.closeDrawer()
    }

    // State should be clean — scroll lock released, drawer closed
    await mobilePage.expectDrawerClosed()
    expect(await mobilePage.isScrollLocked()).toBe(false)

    // Can still open the drawer normally
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()
    expect(await mobilePage.isScrollLocked()).toBe(true)

    // And navigate
    await mobilePage.clickDrawerGroup(1)
    await mobilePage.expectDrawerClosed()
    expect(await mobilePage.isScrollLocked()).toBe(false)
  })

  test('viewport resize during drawer open transitions correctly', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('text-effects-framer')
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    // Resize to desktop while drawer is open
    await page.setViewportSize({ width: 1280, height: 720 })

    // Desktop sidebar should be visible now
    await expect(catalogPage.sidebar).toBeVisible({ timeout: 10_000 })

    // Content should still be present
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 5_000 })

    // No error state
    await catalogPage.expectNoErrorBoundary()
  })
})
