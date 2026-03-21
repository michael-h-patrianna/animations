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

  test('invalid route redirects to first group', async ({ catalogPage, page }) => {
    await page.goto('/nonexistent-group-does-not-exist')

    // Should redirect away from the invalid URL
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 10_000 })
      .not.toBe('/nonexistent-group-does-not-exist')

    // Should land on a valid group
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    const pathname = catalogPage.currentPathname()
    expect(pathname).not.toBe('/')
    await expect(catalogPage.groupSection(pathname.slice(1))).toBeVisible()
  })

  test('base group name without suffix canonicalizes to -framer', async ({ catalogPage, page }) => {
    await page.goto('/text-effects')
    await catalogPage.waitForShell()

    // Should canonicalize to framer variant
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 10_000 })
      .toBe('/text-effects-framer')

    await catalogPage.waitForCards()
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

    // Verify CSS mode is active after reload
    const firstCard = catalogPage.allCards().first()
    await expect(catalogPage.cardMeta(firstCard)).toContainText('CSS')
  })

  test('browser back from invalid route returns to previous valid state', async ({
    catalogPage,
    page,
  }) => {
    // Navigate to a valid group first
    await catalogPage.gotoGroup('text-effects-framer')
    const validPath = catalogPage.currentPathname()

    // Programmatically navigate to an invalid route
    await page.goto('/this-route-does-not-exist-at-all')

    // App should redirect away from invalid route
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 10_000 })
      .not.toBe('/this-route-does-not-exist-at-all')

    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

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
    const firstCard = catalogPage.allCards().first()
    await expect(catalogPage.cardMeta(firstCard)).toContainText('CSS')
  })
})
