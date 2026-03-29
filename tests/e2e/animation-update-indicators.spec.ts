import { test, expect } from './fixtures/catalog.fixture'

test.describe('Update Indicators', () => {
  test('badge-pop renders an indicator badge with text', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('update-indicators-framer')

    const card = catalogPage.card('update-indicators__badge-pop')
    const stage = await catalogPage.cardStage(card)

    // The indicator wraps a badge element
    const badge = stage.locator('[data-testid="indicator-badge"]')
    await expect(badge).toBeVisible({ timeout: 5_000 })

    // Badge should have text content (default: "New")
    await expect(badge).not.toBeEmpty()
  })

  test('badge indicators have meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('update-indicators-framer')

    const card = catalogPage.card('update-indicators__badge-pulse')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(20)
    expect(box!.height).toBeGreaterThan(10)
  })

  test('all framer variants render with visible content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('update-indicators-framer')

    const cards = catalogPage.scopedCards('update-indicators-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(5)

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
    await catalogPage.gotoGroup('update-indicators-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('update-indicators-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
