import { test, expect } from './fixtures/catalog.fixture'

test.describe('Icon Animations', () => {
  test('bounce animation renders an image or placeholder', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('icon-animations-framer')

    const card = catalogPage.card('icon-animations__bounce')
    const stage = await catalogPage.cardStage(card)

    // Icon animation renders either an <img> or a placeholder div
    const imageOrPlaceholder = stage.locator('img, .pf-icon-anim__placeholder')
    await expect(imageOrPlaceholder.first()).toBeVisible({ timeout: 5_000 })
  })

  test('icon cards have meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('icon-animations-framer')

    const card = catalogPage.card('icon-animations__float')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(30)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('all framer variants render with visible content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('icon-animations-framer')

    const cards = catalogPage.scopedCards('icon-animations-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(3)

    for (let i = 0; i < count; i++) {
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
    await catalogPage.gotoGroup('icon-animations-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('icon-animations-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
