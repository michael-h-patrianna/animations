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
      const isActive = await link.evaluate((el) =>
        el.classList.contains('pf-sidebar__link--active')
      )
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
    await expect(groupLinks.nth(2)).toHaveClass(/pf-sidebar__link--active/)

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
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('page title includes Animation Showcase', async ({ catalogPage }) => {
    await catalogPage.goto()
    await expect(catalogPage.page).toHaveTitle(/Animation Showcase/)
  })
})
