import { test, expect } from './fixtures/catalog.fixture'

test.describe('URL Routing', () => {
  test('direct navigation to valid group renders correct content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    await expect(catalogPage.groupSection('text-effects-framer')).toBeVisible()

    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(0)

    // Group title is rendered within the animated section
    await expect(catalogPage.groupTitle()).toContainText('Text effects')
  })

  test('invalid route preserves the URL and shows the load error state', async ({
    catalogPage,
    page,
  }) => {
    await page.goto('/nonexistent-group-does-not-exist')

    await catalogPage.waitForShell()
    await expect
      .poll(() => catalogPage.page.locator('text=Failed to load animations').count(), { timeout: 10_000 })
      .toBeGreaterThan(0)
    expect(catalogPage.currentPathname()).toBe('/nonexistent-group-does-not-exist')
  })

  test('base group name without suffix shows the same route-level error state', async ({
    catalogPage,
    page,
  }) => {
    await page.goto('/text-effects')
    await catalogPage.waitForShell()

    await expect
      .poll(() => catalogPage.page.locator('text=Failed to load animations').count(), { timeout: 10_000 })
      .toBeGreaterThan(0)
    expect(catalogPage.currentPathname()).toBe('/text-effects')
  })

  test('browser back/forward preserves navigation state', async ({ catalogPage, page }) => {
    // Navigate to first group
    await catalogPage.gotoGroup('text-effects-framer')
    const firstPath = catalogPage.currentPathname()

    // Navigate to a different group via sidebar
    await catalogPage.waitForShell()
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()

    // Find a link that will navigate to a different group
    let navigated = false
    for (let i = 0; i < count; i++) {
      const link = groupLinks.nth(i)
      const isActive = await link.getAttribute('data-active')
      if (!isActive) {
        await link.click()
        navigated = true
        break
      }
    }

    if (navigated) {
      await catalogPage.waitForPathnameChange(firstPath)
      const secondPath = catalogPage.currentPathname()
      expect(secondPath).not.toBe(firstPath)

      // Go back
      await page.goBack()
      await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(firstPath)

      // Go forward
      await page.goForward()
      await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(secondPath)
    }
  })

  test('hard page refresh preserves deep-linked framer route', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const pathBefore = catalogPage.currentPathname()
    const titleBefore = await catalogPage.groupTitle().textContent()

    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    expect(catalogPage.currentPathname()).toBe(pathBefore)
    await expect(catalogPage.groupTitle()).toHaveText(titleBefore!)
    await expect(catalogPage.groupSection('modal-base-framer')).toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })

  test('hard page refresh preserves deep-linked CSS route', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('progress-bars-css')
    const pathBefore = catalogPage.currentPathname()

    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    expect(catalogPage.currentPathname()).toBe(pathBefore)

    // URL suffix confirms CSS mode is preserved after reload
    expect(catalogPage.currentPathname()).toMatch(/-css$/)
  })

  test('browser back from invalid route returns to previous valid state', async ({ catalogPage, page }) => {
    // Navigate to a valid group first
    await catalogPage.gotoGroup('text-effects-framer')
    const validPath = catalogPage.currentPathname()

    // Programmatically navigate to an invalid route
    await page.goto('/this-route-does-not-exist-at-all')
    await catalogPage.waitForShell()
    await expect
      .poll(() => catalogPage.page.locator('text=Failed to load animations').count(), { timeout: 10_000 })
      .toBeGreaterThan(0)

    // Go back — should return to the valid route
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 10_000 }).toBe(validPath)

    await catalogPage.waitForCards()
    await expect(catalogPage.groupSection('text-effects-framer')).toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })

  test('hard refresh after mode switch preserves CSS mode', async ({ catalogPage, page }) => {
    // Start in Framer, switch to CSS, then reload
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // After reload, URL should still be CSS variant
    expect(catalogPage.currentPathname()).toBe('/text-effects-css')
  })
})
