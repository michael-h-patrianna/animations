import { test, expect } from './fixtures/catalog.fixture'

test.describe('Lights Animation Controls', () => {
  test('bulb count controls increment and decrement correctly', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    const card = catalogPage.card('lights__circle-static-1')
    await expect(card).toBeVisible()

    const bulbInput = card.locator('input[type="number"][aria-label="Number of bulbs"]')
    const increaseBtn = card.locator('button[aria-label="Increase bulb count"]')
    const decreaseBtn = card.locator('button[aria-label="Decrease bulb count"]')

    const initialValue = Number.parseInt(await bulbInput.inputValue(), 10)
    expect(initialValue).toBeGreaterThan(0)

    await increaseBtn.click()
    const afterIncrease = Number.parseInt(await bulbInput.inputValue(), 10)
    expect(afterIncrease).toBe(initialValue + 1)

    await decreaseBtn.click()
    const afterDecrease = Number.parseInt(await bulbInput.inputValue(), 10)
    expect(afterDecrease).toBe(initialValue)

    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()
  })

  test('color picker is present with valid default color', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    const card = catalogPage.card('lights__circle-static-1')
    const colorPicker = card.locator('input[type="color"][aria-label="Bulb color"]')

    await expect(colorPicker).toBeVisible()
    const value = await colorPicker.inputValue()
    expect(value).toMatch(/^#[0-9a-f]{6}$/i)
  })

  test('boundary buttons disable at min and max bulb count', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    const card = catalogPage.card('lights__circle-static-1')
    const bulbInput = card.locator('input[type="number"][aria-label="Number of bulbs"]')
    const increaseBtn = card.locator('button[aria-label="Increase bulb count"]')
    const decreaseBtn = card.locator('button[aria-label="Decrease bulb count"]')

    // Default is 16, min is 4, max is 22
    const initialValue = Number.parseInt(await bulbInput.inputValue(), 10)
    expect(initialValue).toBe(16)

    // Both buttons should be enabled at default value (4 < 16 < 22)
    await expect(increaseBtn).toBeEnabled()
    await expect(decreaseBtn).toBeEnabled()

    // Increase to max (22) — increase button should disable
    for (let v = initialValue; v < 22; v++) {
      await increaseBtn.click()
    }
    await expect
      .poll(async () => Number.parseInt(await bulbInput.inputValue(), 10), { timeout: 3_000 })
      .toBe(22)
    await expect(increaseBtn).toBeDisabled()
    await expect(decreaseBtn).toBeEnabled()

    // Decrease back to min (4) — decrease button should disable
    for (let v = 22; v > 4; v--) {
      await decreaseBtn.click()
    }
    await expect
      .poll(async () => Number.parseInt(await bulbInput.inputValue(), 10), { timeout: 3_000 })
      .toBe(4)
    await expect(decreaseBtn).toBeDisabled()
    await expect(increaseBtn).toBeEnabled()
  })

  test('lights-framer route loads without ErrorBoundary', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    await catalogPage.expectNoErrorBoundary()

    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(0)
  })
})
