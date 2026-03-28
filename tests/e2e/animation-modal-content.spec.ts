import { test, expect } from './fixtures/catalog.fixture'

test.describe('Modal Content', () => {
  test('list-soft-stagger renders a modal with staggered list items', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-content-framer')

    const card = catalogPage.card('modal-content__list-soft-stagger')
    const stage = await catalogPage.cardStage(card)

    // The component renders a demo overlay with a modal inside
    const modal = stage.locator('[class*="pf-demo-modal"]')
    await expect(modal).toBeVisible({ timeout: 5_000 })

    // Modal should have a header with text content
    const header = modal.locator('[class*="pf-demo-modal-header"]')
    await expect(header).toBeVisible()
    await expect(header).not.toBeEmpty()
  })

  test('content stagger components have meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-content-framer')

    const card = catalogPage.card('modal-content__buttons-stagger-2')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(50)
  })

  test('all framer variants render with visible content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-content-framer')

    const cards = catalogPage.scopedCards('modal-content-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(7)

    // Spot-check 3 cards have rendered stage content
    for (let i = 0; i < Math.min(3, count); i++) {
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
    await catalogPage.gotoGroup('modal-content-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('modal-content-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
