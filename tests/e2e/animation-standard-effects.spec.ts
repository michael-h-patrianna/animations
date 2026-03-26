import { test, expect } from './fixtures/catalog.fixture'

test.describe('Standard Effects', () => {
  test('all framer variants render with visible stage content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const cards = catalogPage.scopedCards('standard-effects-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(15)

    // Spot-check: first and last card have rendered stage content
    for (const card of [cards.first(), cards.last()]) {
      const stage = await catalogPage.cardStage(card)
      await expect(stage.locator(':scope > *')).not.toHaveCount(0)
    }
  })

  test('bounce animation has meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(30)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('replay button remounts the animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()

    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeVisible()
    await replay.click()

    // After replay, stage content should still be present (remount succeeded)
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('standard-effects-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
