import { test, expect } from './fixtures/catalog.fixture'

test.describe('Button Effects', () => {
  test('jitter animation renders a button element', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('button-effects-framer')

    const card = catalogPage.card('button-effects__jitter')
    const stage = await catalogPage.cardStage(card)

    const button = stage.locator('button')
    await expect(button).toBeVisible()

    // Button should have the standard demo button class
    await expect
      .poll(
        async () => {
          const cls = await button.getAttribute('class')
          return cls?.includes('pf-demo-btn') ?? false
        },
        { timeout: 3_000 }
      )
      .toBe(true)
  })

  test('button cards have meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('button-effects-framer')

    const card = catalogPage.card('button-effects__ripple')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(20)
  })

  test('all framer variants render without empty stages', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('button-effects-framer')

    const cards = catalogPage.scopedCards('button-effects-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(7)

    // Every card must have rendered content (not an empty stage)
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
    await catalogPage.gotoGroup('button-effects-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('button-effects-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
