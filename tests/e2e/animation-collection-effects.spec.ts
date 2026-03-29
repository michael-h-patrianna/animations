import { test, expect } from './fixtures/catalog.fixture'

test.describe('Collection Effects', () => {
  test('coin-burst spawns particle elements', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-burst')
    const stage = await catalogPage.cardStage(card)

    // The burst container should have a stage with particle elements
    const burstContainer = stage.locator('[data-animation-id="collection-effects__coin-burst"]')
    await expect(burstContainer).toBeVisible({ timeout: 5_000 })

    // Particles spawn inside pf-coin-burst__stage
    await expect
      .poll(async () => stage.locator('[data-testid="coin-burst-particle"]').count(), {
        timeout: 5_000,
      })
      .toBeGreaterThan(0)
  })

  test('collection effect cards have meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-burst')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(50)
  })

  test('replay triggers a new particle burst', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-burst')
    const stage = await catalogPage.cardStage(card)

    // Wait for initial burst
    await expect
      .poll(async () => stage.locator('[data-testid="coin-burst-particle"]').count(), {
        timeout: 5_000,
      })
      .toBeGreaterThan(0)

    // Replay
    const replay = catalogPage.replayButton(card)
    await replay.click()

    // After replay, particles should reappear (component remounted)
    await expect
      .poll(async () => stage.locator('[data-testid="coin-burst-particle"]').count(), {
        timeout: 5_000,
      })
      .toBeGreaterThan(0)
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('collection-effects-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
