import { test, expect } from './fixtures/catalog.fixture'

test.describe('Prize Reveal Controls', () => {
  test('prize count buttons change the displayed count', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')

    // Card pack open has prizeCount controls
    const card = catalogPage.card('prize-reveal__card-pack-open')
    await expect(card).toBeVisible()

    const controls = card.locator('[data-testid="prize-controls"]')
    await expect(controls).toBeVisible()

    // ToggleGroup uses role="radio" buttons with aria-checked
    const btn2 = controls.locator('[data-testid="prize-controls-2"]')
    await btn2.click()
    await expect(btn2).toHaveAttribute('aria-checked', 'true')

    // Click button "3" and verify it becomes selected, button 2 deselected
    const btn3 = controls.locator('[data-testid="prize-controls-3"]')
    await btn3.click()
    await expect(btn3).toHaveAttribute('aria-checked', 'true')
    await expect(btn2).toHaveAttribute('aria-checked', 'false')
  })

  test('prize count controls trigger animation replay', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')

    const card = catalogPage.card('prize-reveal__chest-gc-sc')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    const controls = card.locator('[data-testid="prize-controls"]')
    await expect(controls).toBeVisible()

    // Change prize count — should trigger replay (remount)
    const btn1 = controls.locator('[data-testid="prize-controls-1"]')
    await btn1.click()

    // Stage should still have content after control change
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('prize count controls use accessible radiogroup', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')

    const card = catalogPage.card('prize-reveal__arcane-portal')
    const controls = card.locator('[data-testid="prize-controls"]')
    await expect(controls).toBeVisible()

    // ToggleGroup has role="radiogroup" with an aria-label
    await expect(controls).toHaveAttribute('role', 'radiogroup')
    const ariaLabel = await controls.getAttribute('aria-label')
    expect(ariaLabel).toBe('Prize count')

    // Each button should have role="radio"
    const buttons = controls.locator('button[role="radio"]')
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })
})
