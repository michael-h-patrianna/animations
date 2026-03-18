import { test, expect } from './fixtures/catalog.fixture'

test.describe('Code Mode Switching (Framer ↔ CSS)', () => {
  test('switching to CSS mode updates URL and card tags', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Verify starting in Framer mode
    expect(catalogPage.currentPathname()).toBe('/text-effects-framer')
    const framerMode = await catalogPage.activeCodeMode()
    expect(framerMode.trim()).toBe('Framer')

    // Switch to CSS
    await catalogPage.selectCssMode()

    // URL should change to -css
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    // Cards should now show CSS tags instead of FRAMER
    await catalogPage.waitForCards()
    const firstCard = catalogPage.allCards().first()
    const meta = catalogPage.cardMeta(firstCard)
    await expect(meta).toContainText('CSS')
  })

  test('switching to Framer mode updates URL and card tags', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-css')

    expect(catalogPage.currentPathname()).toBe('/text-effects-css')

    await catalogPage.selectFramerMode()

    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-framer')

    await catalogPage.waitForCards()
    const firstCard = catalogPage.allCards().first()
    const meta = catalogPage.cardMeta(firstCard)
    await expect(meta).toContainText('FRAMER')
  })

  test('mode switch preserves the current group context', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    await catalogPage.selectCssMode()

    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/progress-bars-css')

    // Wait for cards to confirm the view loaded
    await catalogPage.waitForCards()

    // Switch back
    await catalogPage.selectFramerMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/progress-bars-framer')
  })

  test('mode switch from sidebar navigation shows correct variant', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Switch to CSS mode first
    await catalogPage.selectCssMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)

    // Now click a group link — it should navigate to the CSS variant
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(1)

    const before = catalogPage.currentPathname()
    await groupLinks.nth(1).click()
    await catalogPage.waitForPathnameChange(before)

    // URL should end with -css
    expect(catalogPage.currentPathname()).toMatch(/-css$/)
  })
})
