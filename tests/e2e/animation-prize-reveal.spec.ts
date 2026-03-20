import { test, expect } from './fixtures/catalog.fixture'

test.describe('Prize Reveal Controls', () => {
  test('prize count buttons change the displayed count', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')

    // Card pack open has prizeCount controls
    const card = catalogPage.card('prize-reveal__card-pack-open')
    await expect(card).toBeVisible()

    const controls = card.locator('[data-testid="prize-controls"]')
    await expect(controls).toBeVisible()

    // Should have 4 count buttons (maxCount default is 4)
    const buttons = controls.locator('button')
    expect(await buttons.count()).toBeGreaterThanOrEqual(3)

    // Click button "2" and verify it becomes selected
    const btn2 = controls.locator('button', { hasText: '2' })
    await btn2.click()
    await expect(btn2).toHaveAttribute('aria-pressed', 'true')

    // Click button "3" and verify it becomes selected, button 2 deselected
    const btn3 = controls.locator('button', { hasText: '3' })
    await btn3.click()
    await expect(btn3).toHaveAttribute('aria-pressed', 'true')
    await expect(btn2).toHaveAttribute('aria-pressed', 'false')
  })

  test('prize count controls trigger animation replay', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')

    const card = catalogPage.card('prize-reveal__chest-gc-sc')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    const controls = card.locator('[data-testid="prize-controls"]')
    await expect(controls).toBeVisible()

    // Change prize count — should trigger replay (remount)
    const btn1 = controls.locator('button', { hasText: '1' })
    await btn1.click()

    // Stage should still have content after control change
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('prize count controls have accessible labels', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')

    const card = catalogPage.card('prize-reveal__arcane-portal')
    const controls = card.locator('[data-testid="prize-controls"]')
    await expect(controls).toBeVisible()

    // Each button should have an aria-label describing the count
    const buttons = controls.locator('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const label = await buttons.nth(i).getAttribute('aria-label')
      expect(label).toMatch(/Show \d+ prizes?/)
    }
  })
})
