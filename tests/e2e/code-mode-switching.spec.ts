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

    // Code mode switch should reflect CSS (poll to wait for React state sync)
    await catalogPage.waitForCards()
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('CSS')
  })

  test('switching to Framer mode updates URL and card tags', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-css')

    expect(catalogPage.currentPathname()).toBe('/text-effects-css')

    await catalogPage.selectFramerMode()

    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-framer')

    await catalogPage.waitForCards()
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('Framer')
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

  test('mode switch preserves all sidebar group links', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Count groups in Framer mode
    const framerCount = await catalogPage.allGroupLinks().count()
    expect(framerCount).toBeGreaterThan(5)

    // Collect all Framer group link labels
    const framerLabels: string[] = []
    for (let i = 0; i < framerCount; i++) {
      const text = (await catalogPage.allGroupLinks().nth(i).innerText()).trim()
      framerLabels.push(text)
    }

    // Switch to CSS
    await catalogPage.selectCssMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
    await catalogPage.waitForCards()

    // Count groups in CSS mode — should be identical
    const cssCount = await catalogPage.allGroupLinks().count()
    expect(cssCount).toBe(framerCount)

    // Labels should match (same groups, just different code mode)
    for (let i = 0; i < cssCount; i++) {
      const text = (await catalogPage.allGroupLinks().nth(i).innerText()).trim()
      expect(text).toBe(framerLabels[i])
    }
  })

  test('card count matches between Framer and CSS variants of same group', async ({
    catalogPage,
  }) => {
    // Test multiple groups
    const groups = ['text-effects', 'button-effects', 'progress-bars']

    for (const baseGroup of groups) {
      const framerId = `${baseGroup}-framer`
      await catalogPage.gotoGroup(framerId)
      await catalogPage.waitForTransitionSettle()
      // Use scopedCards to avoid counting internal data-animation-id elements
      const framerCards = catalogPage.scopedCards(framerId)
      const framerIds = await framerCards.evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
      )

      const cssId = `${baseGroup}-css`
      await catalogPage.gotoGroup(cssId)
      await catalogPage.waitForTransitionSettle()
      const cssCards = catalogPage.scopedCards(cssId)
      const cssIds = await cssCards.evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
      )

      // Same animation IDs should exist in both modes
      expect(framerIds.length).toBe(cssIds.length)

      // Same animation IDs (order may differ)
      expect(framerIds.sort()).toEqual(cssIds.sort())
    }
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
