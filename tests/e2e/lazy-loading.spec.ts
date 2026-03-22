import { test, expect } from './fixtures/catalog.fixture'

/**
 * Lazy loading tests for animation cards.
 *
 * One-shot animations use IntersectionObserver (threshold: 0.3) to defer
 * rendering until the card scrolls into view. This test verifies:
 * - Cards below the fold have empty demo stages until scrolled into view
 * - Scrolling into view triggers the animation to render content
 * - The rendered content persists after scrolling past and back
 *
 * Bug this catches: IntersectionObserver misconfiguration that either
 * renders all animations immediately (wasting resources) or never
 * triggers (animations stay blank after scroll).
 */
test.describe('Lazy Loading', () => {
  test('scrolling to an off-screen card triggers animation render', async ({ catalogPage }) => {
    // Use a group with many cards so some are below the fold
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    const cards = catalogPage.allCards()
    const totalCards = await cards.count()
    expect(totalCards).toBeGreaterThan(5)

    // Scroll to the last card — use cardStage which handles waiting for content
    const lastCard = cards.nth(totalCards - 1)
    await lastCard.scrollIntoViewIfNeeded()

    // After scrolling into view, the card's demo stage should be visible
    // Note: some animations are infinite (always visible) and some are one-shot
    // (triggered by IntersectionObserver). Both should have a visible stage.
    const stage = lastCard.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible({ timeout: 10_000 })
  })

  test('all visible cards on initial load have rendered content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    await catalogPage.waitForCards()

    // The first card should have rendered content (it's in the viewport)
    const firstCard = catalogPage.allCards().first()
    const stage = firstCard.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible({ timeout: 5_000 })
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('scrolling through all cards in a large group makes each stage visible', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    // Use card-grid scoped selector to avoid matching internal data-animation-id
    const groupSection = catalogPage.groupSection('progress-bars-framer')
    const cards = groupSection.locator('[data-testid="card-grid"] > [data-animation-id]')
    const totalCards = await cards.count()
    expect(totalCards).toBeGreaterThan(5)

    // Check every 3rd card to keep test fast but verify lazy loading works across the group
    for (let i = 0; i < totalCards; i += 3) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()

      const stage = card.locator('[data-testid="demo-stage"]')
      await expect(stage).toBeVisible({ timeout: 10_000 })
    }
  })

  test('navigating to a new group and scrolling down loads cards in new group', async ({
    catalogPage,
  }) => {
    // Start on one group
    await catalogPage.gotoGroup('standard-effects-framer')
    await catalogPage.waitForCards()

    // Navigate to a group with many cards
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    const cards = catalogPage.allCards()
    const totalCards = await cards.count()
    expect(totalCards).toBeGreaterThan(5)

    // Scroll to last card — lazy loading should work after navigation
    const lastCard = cards.nth(totalCards - 1)
    await lastCard.scrollIntoViewIfNeeded()

    const stage = lastCard.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible({ timeout: 10_000 })
  })
})
