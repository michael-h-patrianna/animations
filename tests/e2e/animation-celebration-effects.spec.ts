import { test, expect } from './fixtures/catalog.fixture'

test.describe('Modal Celebrations', () => {
  test('confetti-burst spawns particle and sparkle elements', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('celebration-effects-framer')

    const card = catalogPage.card('celebration-effects__confetti-burst')
    const stage = await catalogPage.cardStage(card)

    // The celebration container renders depth layers with confetti pieces
    const celebration = stage.locator('[data-testid="celebration"]')
    await expect(celebration).toBeVisible({ timeout: 5_000 })

    // Confetti particles should spawn in depth layers
    await expect
      .poll(async () => stage.locator('[data-testid="confetti-piece"]').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('celebration effects have meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('celebration-effects-framer')

    const card = catalogPage.card('celebration-effects__confetti-burst')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(50)
  })

  test('all framer variants render with visible content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('celebration-effects-framer')

    const cards = catalogPage.scopedCards('celebration-effects-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(8)

    // Spot-check first 4 cards have rendered content
    for (let i = 0; i < Math.min(4, count); i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      const stage = card.locator('[data-testid="demo-stage"]')
      await expect(stage).toBeVisible({ timeout: 5_000 })
      await expect
        .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
        .toBeGreaterThan(0)
    }
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('celebration-effects-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('celebration-effects-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
