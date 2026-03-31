import { test, expect } from './fixtures/catalog.fixture'

test.describe('Modal Dismiss', () => {
  test('snackbar-scale renders visible content before dismissal', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('auto-dismiss-framer')

    const card = catalogPage.card('auto-dismiss__snackbar-scale')
    const stage = await catalogPage.cardStage(card)

    // The dismiss wrapper should have visible content on mount
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('toast-drop has meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('auto-dismiss-framer')

    const card = catalogPage.card('auto-dismiss__toast-drop')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(20)
  })

  test('replay remounts the dismiss animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('auto-dismiss-framer')

    const card = catalogPage.card('auto-dismiss__toast-raise')
    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()

    // Content should be visible initially
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)

    // Replay to remount
    const replay = catalogPage.replayButton(card)
    await replay.click()

    // After replay, content should reappear
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('auto-dismiss-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('auto-dismiss-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
