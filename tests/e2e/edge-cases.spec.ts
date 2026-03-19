import { test, expect } from './fixtures/catalog.fixture'

test.describe('Edge Cases', () => {
  test('CSS mode persists when navigating between groups via sidebar', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    // Click a different group in the sidebar
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(1)

    // Find a non-active group and click it
    for (let i = 0; i < count; i++) {
      const link = groupLinks.nth(i)
      const isActive = await link.getAttribute('data-active')
      if (!isActive) {
        await link.click()
        break
      }
    }

    // The new route should end with -css (mode persists)
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
  })

  test('rapid group switching does not break the UI', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(2)

    // Click 3 groups rapidly without waiting for transitions
    await groupLinks.nth(0).click()
    await groupLinks.nth(1).click()
    await groupLinks.nth(2).click()

    // After rapid clicks, the UI should settle on the last clicked group
    // with the third group link active
    await expect(groupLinks.nth(2)).toHaveAttribute('data-active', 'true')

    // Content should be present (no crash)
    const pathname = catalogPage.currentPathname()
    expect(pathname).not.toBe('/')
    await catalogPage.waitForCards()
  })

  test('multiple replay clicks do not crash the animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()

    // Click replay 3 times rapidly
    await replay.click()
    await replay.click()
    await replay.click()

    // Card should still be functional after rapid replays
    const stage = card.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('page title includes Animation Showcase', async ({ catalogPage }) => {
    await catalogPage.goto()
    await expect(catalogPage.page).toHaveTitle(/Animation Showcase/)
  })

  test('collapsing all categories leaves sidebar navigable', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Collapse all categories
    const categoryBtns = catalogPage.categoryButtons()
    const count = await categoryBtns.count()
    expect(count).toBeGreaterThan(1)

    for (let i = 0; i < count; i++) {
      const btn = categoryBtns.nth(i)
      const isExpanded = await btn.getAttribute('aria-expanded')
      if (isExpanded === 'true') {
        await btn.click()
        await expect(btn).toHaveAttribute('aria-expanded', 'false')
      }
    }

    // All group links should be hidden
    expect(await catalogPage.allGroupLinks().count()).toBe(0)

    // Expand first category — groups should reappear
    await categoryBtns.first().click()
    await expect(categoryBtns.first()).toHaveAttribute('aria-expanded', 'true')
    expect(await catalogPage.allGroupLinks().count()).toBeGreaterThan(0)

    // Can still navigate to a group by clicking the first visible group link
    const currentPath = catalogPage.currentPathname()
    const firstLink = catalogPage.allGroupLinks().first()
    await firstLink.click()

    // Verify navigation worked — either URL changed or we stayed on the same group
    // (clicking the already-active group is valid and should not crash)
    await catalogPage.waitForCards()
    const finalPath = catalogPage.currentPathname()
    expect(finalPath).not.toBe('/')
    await expect(catalogPage.page.getByText('Something went wrong')).toHaveCount(0)
  })

  test('deep linking to multiple group types renders correct content', async ({ catalogPage }) => {
    // Test deep links to diverse categories — catches routing bugs across the catalog
    const groups = [
      { id: 'modal-base-framer', expectedTitle: 'Base modal animations' },
      { id: 'progress-bars-css', expectedTitle: 'Progress bars' },
      { id: 'button-effects-framer', expectedTitle: 'Button effects' },
    ]

    for (const { id, expectedTitle } of groups) {
      await catalogPage.gotoGroup(id)

      await expect(catalogPage.groupSection(id)).toBeVisible()
      await expect(catalogPage.groupTitle()).toContainText(expectedTitle)

      const cards = catalogPage.allCards()
      expect(await cards.count()).toBeGreaterThan(0)

      // No error boundary
      await expect(catalogPage.page.getByText('Something went wrong')).toHaveCount(0)
    }
  })

  test('viewport resize from mobile to desktop preserves navigation state', async ({
    catalogPage,
    page,
  }) => {
    // Start at mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await catalogPage.gotoGroup('text-effects-framer')

    const pathname = catalogPage.currentPathname()

    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 720 })

    // URL should not change
    expect(catalogPage.currentPathname()).toBe(pathname)

    // Desktop sidebar should be visible
    await expect(catalogPage.sidebar).toBeVisible()
    await catalogPage.waitForCards()

    // Resize back to mobile — content still present
    await page.setViewportSize({ width: 375, height: 667 })
    expect(catalogPage.currentPathname()).toBe(pathname)
    await catalogPage.waitForCards()
  })
})
