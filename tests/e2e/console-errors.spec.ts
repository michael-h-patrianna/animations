import { test, expect } from './fixtures/catalog.fixture'

/**
 * Console error monitoring across multi-step user flows.
 *
 * app-shell.spec.ts checks for errors on initial load. These tests monitor
 * for JS errors across complex navigation sequences that can trigger:
 * - Stale state references after navigation
 * - Unmounted component state updates
 * - Failed lazy imports during rapid navigation
 * - Race conditions between AnimatePresence transitions and mode switches
 *
 * Bug this catches: async operations (IntersectionObserver, lazy import,
 * Shiki highlighter) that fire after the component unmounts, causing
 * "setState on unmounted component" or "Failed to fetch dynamically
 * imported module" errors.
 */
test.describe('Console Error Monitoring', () => {
  test('no JS errors during navigate → switch mode → navigate → back flow', async ({
    catalogPage,
    errorCollector,
    page,
  }) => {
    // Step 1: Initial load
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Step 2: Navigate to a specific group
    await catalogPage.gotoGroup('text-effects-framer')

    // Step 3: Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')
    await catalogPage.waitForCards()

    // Step 4: Navigate to a different group via sidebar
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // Step 5: Browser back
    await page.goBack()
    await catalogPage.waitForCards()

    // Step 6: Switch back to Framer
    await catalogPage.selectFramerMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)
    await catalogPage.waitForCards()

    errorCollector.expectNoErrors()
  })

  test('no JS errors during code viewer open/close across groups', async ({
    catalogPage,
    errorCollector,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    // Open code viewer
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Close code viewer
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Navigate to a different group
    await catalogPage.gotoGroup('standard-effects-framer')

    // Open code viewer on a different card
    const card2 = catalogPage.card('standard-effects__bounce')
    await catalogPage.codeViewerButton(card2).click()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Close and navigate again
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    await catalogPage.gotoGroup('button-effects-framer')
    await catalogPage.waitForCards()

    errorCollector.expectNoErrors()
  })

  test('no JS errors during rapid preview open/close cycles', async ({
    catalogPage,
    errorCollector,
    page,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.allCards().first()

    // Open and close preview 3 times rapidly
    for (let i = 0; i < 3; i++) {
      await catalogPage.openDesktopPreview(card)
      await expect(catalogPage.previewAnimation()).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })
    }

    // Open once more and switch modes
    await catalogPage.openDesktopPreview(card)
    await catalogPage.previewModeMobileButton().click()
    await expect(catalogPage.previewMobileFrame()).toBeVisible()
    await catalogPage.closePreview()

    errorCollector.expectNoErrors()
  })

  test('no JS errors during mobile drawer + code viewer interaction', async ({
    mobilePage,
    errorCollector,
    page,
  }) => {
    await mobilePage.gotoMobile('modal-base-framer')

    // Open code viewer
    const card = page.locator('[data-animation-id="modal-base__scale-gentle-pop"]')
    await expect(card).toBeVisible({ timeout: 10_000 })
    const codeBtn = card.locator('[data-testid="code-viewer-btn"]')
    await codeBtn.click()
    await expect(page.locator('[data-testid="code-viewer-modal"]')).toBeVisible({ timeout: 10_000 })

    // Close code viewer
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-testid="code-viewer-modal"]')).not.toBeVisible()

    // Open drawer and navigate
    await mobilePage.openDrawer()
    await mobilePage.clickDrawerGroup(1)
    await mobilePage.expectDrawerClosed()

    // Open drawer again, switch mode, navigate
    await mobilePage.openDrawer()
    await mobilePage.selectCssMode()
    await mobilePage.closeDrawer()

    errorCollector.expectNoErrors()
  })

  test('no JS errors during filter apply → remove → navigate flow', async ({
    catalogPage,
    errorCollector,
    page,
  }) => {
    // Apply filter via URL
    await page.goto('/text-effects-framer?animation=text-effects__character-reveal')
    await catalogPage.waitForShell()
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Remove filter
    await catalogPage.removeFilterButton().click()
    await catalogPage.waitForCards()

    // Navigate to a different group
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // Apply filter again via URL on new group
    const currentPath = catalogPage.currentPathname().slice(1)
    const ids = await catalogPage.getAllAnimationIds()
    if (ids.length > 0) {
      await page.goto(`/${currentPath}?animation=${encodeURIComponent(ids[0])}`)
      await catalogPage.waitForShell()
    }

    errorCollector.expectNoErrors()
  })

  test('no JS errors during preview open → close → code mode switch → preview open', async ({
    catalogPage,
    errorCollector,
    page,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.allCards().first()

    // Open and close preview
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })

    // Switch code mode
    await catalogPage.selectCssMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Get a fresh card reference after mode switch (old cards are detached)
    const cssCard = catalogPage.allCards().first()
    await expect(cssCard).toBeVisible({ timeout: 5_000 })
    await catalogPage.openDesktopPreview(cssCard)
    await expect(catalogPage.previewAnimation()).toBeVisible()
    await catalogPage.closePreview()

    // Switch back to Framer
    await catalogPage.selectFramerMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)
    await catalogPage.waitForCards()

    errorCollector.expectNoErrors()
  })
})
