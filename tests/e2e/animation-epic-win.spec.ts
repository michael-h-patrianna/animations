import { test, expect } from './fixtures/catalog.fixture'

test.describe('Epic Win Animation', () => {
  test('framer variant renders layered text structure with chars and glows', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__epic-win')
    const stage = await catalogPage.cardStage(card)

    const container = stage.locator('[data-testid="epic-win"]')
    await expect(container).toBeVisible()

    // 8 chars in "EPIC WIN" (including space)
    await expect(container.locator('[data-testid="epic-char"]')).toHaveCount(8)
    await expect(container.locator('[data-testid="epic-char-glow"]')).toHaveCount(8)

    // Shadow layers exist for depth effect
    await expect(container.locator('[data-testid="shadow-far"]')).toBeVisible()
    await expect(container.locator('[data-testid="shadow-mid"]')).toBeVisible()
  })

  test('css variant renders BEM structure with chars and glows matching framer variant', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-css')

    const card = catalogPage.card('text-effects__epic-win')
    const stage = await catalogPage.cardStage(card)

    const container = stage.locator('[data-testid="epic-win"]')
    await expect(container).toBeVisible()

    // Same character count as framer variant (8 chars in "EPIC WIN")
    await expect(container.locator('[data-testid="epic-char"]')).toHaveCount(8)
    await expect(container.locator('[data-testid="epic-char-glow"]')).toHaveCount(8)

    // First character is visible (animation has started)
    await expect(container.locator('[data-testid="epic-char"]').first()).toBeVisible()
  })

  test('replay remounts epic-win in both variants', async ({ catalogPage }) => {
    const variants = [
      { groupId: 'text-effects-framer', rootSelector: '[data-testid="epic-win"]' },
      { groupId: 'text-effects-css', rootSelector: '[data-testid="epic-win"]' },
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
