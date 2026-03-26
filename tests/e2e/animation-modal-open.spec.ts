import { test, expect } from './fixtures/catalog.fixture'

test.describe('Modal Open', () => {
  test('bubble-pop renders trigger buttons in demo mode', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-open-framer')

    const card = catalogPage.card('modal-open__bubble-pop')
    const stage = await catalogPage.cardStage(card)

    // In demo mode, the component shows trigger buttons (SharedDemoTriggers)
    // before the modal opens. At minimum the container must have content.
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)

    const box = await stage.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('all framer variants render without crashing', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-open-framer')

    const cards = catalogPage.scopedCards('modal-open-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(4)

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

  test('replay resets the modal open animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-open-framer')

    const card = catalogPage.card('modal-open__fly-in')
    const stage = await catalogPage.cardStage(card)

    const replay = catalogPage.replayButton(card)
    await replay.click()

    // After replay, stage should still have rendered content
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-open-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('modal-open-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
