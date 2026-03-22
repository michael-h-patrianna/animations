import { test, expect } from './fixtures/catalog.fixture'

test.describe('App Shell', () => {
  test('loads without page errors and renders sidebar + cards', async ({ catalogPage, page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await catalogPage.goto()
    await catalogPage.waitForCards()

    const criticalErrors = consoleErrors.filter(
      (text) => !/Failed to load resource|favicon|net::ERR|ResizeObserver loop/i.test(text)
    )

    expect(pageErrors).toHaveLength(0)
    expect(criticalErrors).toHaveLength(0)
    await expect(page.locator('[data-testid="error-fallback"]')).toHaveCount(0)
  })

  test('root route canonicalizes to first group', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Root must redirect to a group route
    expect(catalogPage.currentPathname()).not.toBe('/')

    // The active group section must match the URL
    const groupId = catalogPage.currentPathname().slice(1)
    await expect(catalogPage.groupSection(groupId)).toBeVisible()
  })

  test('sidebar renders categories and group links', async ({ catalogPage }) => {
    await catalogPage.goto()

    // At least 2 categories exist
    expect(await catalogPage.categoryButtons().count()).toBeGreaterThan(1)

    // At least one group link is visible (all categories expanded by default)
    expect(await catalogPage.allGroupLinks().count()).toBeGreaterThan(0)
  })

  test('animation cards have replay controls and unique IDs', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Scope to card-grid direct children to avoid counting internal
    // data-animation-id elements rendered by animation components (e.g., prize-reveal)
    const groupId = catalogPage.currentPathname().slice(1)
    const cards = catalogPage.scopedCards(groupId)
    expect(await cards.count()).toBeGreaterThan(0)

    // First card has a replay button
    const firstCard = cards.first()
    await expect(catalogPage.replayButton(firstCard)).toBeVisible()

    // All card IDs are unique
    const ids = await cards.evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
    )
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
