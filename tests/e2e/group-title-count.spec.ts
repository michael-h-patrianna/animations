import { test, expect } from './fixtures/catalog.fixture'

/**
 * Group title animation count test: verifies the "(N)" count displayed
 * in the top bar group title matches the actual number of animation cards
 * rendered in the card grid.
 *
 * Bug this catches: metadata registration mismatch where the animations
 * array length differs from the actual cards rendered (e.g., a component
 * fails to register, or an extra meta.ts without a component exists).
 */
test.describe('Group Title Card Count', () => {
  test('group title count matches actual rendered card count for multiple groups', async ({
    catalogPage,
  }) => {
    const groups = [
      'text-effects-framer',
      'modal-base-framer',
      'standard-effects-framer',
      'progress-bars-framer',
      'button-effects-css',
    ]

    for (const groupId of groups) {
      await catalogPage.gotoGroup(groupId)
      await catalogPage.waitForCards()

      // Extract the count from the title "(N)" pattern
      const titleText = await catalogPage.groupTitle().textContent()
      expect(titleText).toBeTruthy()
      const countMatch = titleText!.match(/\((\d+)\)/)
      expect(countMatch, `Group title "${titleText}" should contain "(N)" count`).not.toBeNull()
      const titleCount = Number.parseInt(countMatch![1], 10)

      // Count actual card-grid direct children
      const actualCards = catalogPage.scopedCards(groupId)
      const actualCount = await actualCards.count()

      expect(
        actualCount,
        `${groupId}: title says (${titleCount}) but ${actualCount} cards rendered`
      ).toBe(titleCount)
    }
  })

  test('count updates correctly when switching between Framer and CSS modes', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.waitForCards()

    // Get Framer count
    const framerTitle = await catalogPage.groupTitle().textContent()
    const framerMatch = framerTitle!.match(/\((\d+)\)/)
    expect(framerMatch).not.toBeNull()
    const framerCount = Number.parseInt(framerMatch![1], 10)

    // Switch to CSS
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')
    await catalogPage.waitForCards()

    // Get CSS count
    const cssTitle = await catalogPage.groupTitle().textContent()
    const cssMatch = cssTitle!.match(/\((\d+)\)/)
    expect(cssMatch).not.toBeNull()
    const cssCount = Number.parseInt(cssMatch![1], 10)

    // Both modes should have the same count (dual implementation)
    expect(cssCount).toBe(framerCount)
  })
})
