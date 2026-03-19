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
})
