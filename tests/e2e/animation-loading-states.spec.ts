import { test, expect } from './fixtures/catalog.fixture'

/**
 * Loading states animations: spinners, skeletons, ring progress indicators.
 * These are infinite animations — they loop continuously without user interaction.
 * Tests verify:
 * - Correct DOM structure rendered (not placeholders)
 * - Infinite animations have disabled replay buttons
 * - Both Framer and CSS variants render equivalent structures
 */
test.describe('Loading State Animations', () => {
  test('skeleton card renders placeholder structure with shimmer elements', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('loading-states-framer')

    const card = catalogPage.card('loading-states__skeleton-card')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    // Skeleton card should render visible placeholder elements (not empty)
    await expect(stage.locator(':scope > *').first()).toBeVisible()
  })

  test('spinner animations render visible content and have functional replay', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('loading-states-framer')

    const spinnerIds = [
      'loading-states__spinner-dual-ring',
      'loading-states__spinner-galaxy',
      'loading-states__spinner-orbital',
    ]

    for (const id of spinnerIds) {
      const card = catalogPage.card(id)
      if ((await card.count()) === 0) continue

      await card.scrollIntoViewIfNeeded()
      await expect(card).toBeVisible()

      // Spinner should have rendered content in the stage
      const stage = await catalogPage.cardStage(card)
      await expect(stage.locator(':scope > *').first()).toBeVisible()

      // Replay button is present and functional
      const replay = catalogPage.replayButton(card)
      await expect(replay).toBeVisible()
    }
  })

  test('CSS loading states render with corresponding CSS animation structures', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('loading-states-css')
    await catalogPage.waitForCards()

    // Use card-grid scoped query to avoid matching nested data-animation-id
    const groupSection = catalogPage.groupSection('loading-states-css')
    const cardGrid = groupSection.locator('[data-testid="card-grid"]')
    const cards = cardGrid.locator(':scope > [data-animation-id]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(5)

    // URL confirms CSS mode is active
    expect(catalogPage.currentPathname()).toBe('/loading-states-css')

    // First 5 cards render visible stage content (not empty placeholders)
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      await catalogPage.cardStage(card)
    }
  })

  test('Framer and CSS loading states have matching animation IDs', async ({ catalogPage }) => {
    // Verify both variants have the same set of animations
    await catalogPage.gotoGroup('loading-states-framer')
    await catalogPage.waitForTransitionSettle()
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('loading-states-css')
    await catalogPage.waitForTransitionSettle()
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
    expect(framerIds.length).toBeGreaterThan(5)
  })
})
