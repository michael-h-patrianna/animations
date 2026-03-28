import { test, expect } from './fixtures/catalog.fixture'

test.describe('Epic Win Animation', () => {
  test('framer variant renders layered text structure with chars and glows', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__epic-win')
    const stage = await catalogPage.cardStage(card)

    const container = stage.locator('[class*="pf-epic-win"]')
    await expect(container).toBeVisible()

    // 8 chars in "EPIC WIN" (including space)
    await expect(container.locator('[class*="pf-epic-win__char"]')).toHaveCount(8)
    await expect(container.locator('[class*="pf-epic-win__char-glow"]')).toHaveCount(8)

    // Shadow layers exist for depth effect
    await expect(container.locator('[class*="pf-epic-win__shadow-far"]')).toBeVisible()
    await expect(container.locator('[class*="pf-epic-win__shadow-mid"]')).toBeVisible()
  })

  test('css variant renders BEM structure with chars and glows matching framer variant', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-css')

    const card = catalogPage.card('text-effects__epic-win')
    const stage = await catalogPage.cardStage(card)

    const container = stage.locator('[class*="tfe-epic-win"]')
    await expect(container).toBeVisible()

    // Same character count as framer variant (8 chars in "EPIC WIN")
    await expect(container.locator('[class*="tfe-epic-win__char"]')).toHaveCount(8)
    await expect(container.locator('[class*="tfe-epic-win__char-glow"]')).toHaveCount(8)

    // First character is visible (animation has started)
    await expect(container.locator('[class*="tfe-epic-win__char"]').first()).toBeVisible()
  })

  test('replay remounts epic-win in both variants', async ({ catalogPage }) => {
    const variants = [
      { groupId: 'text-effects-framer', rootSelector: '[class*="pf-epic-win"]' },
      { groupId: 'text-effects-css', rootSelector: '[class*="tfe-epic-win"]' },
    ] as const

    for (const variant of variants) {
      await catalogPage.gotoGroup(variant.groupId)

      const card = catalogPage.card('text-effects__epic-win')
      const stage = await catalogPage.cardStage(card)
      const replay = catalogPage.replayButton(card)

      await expect(replay).toBeEnabled()
      await replay.click()

      await expect(stage).toBeVisible()
      await expect(stage.locator(variant.rootSelector)).toBeVisible()
    }
  })
})
