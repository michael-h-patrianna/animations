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

  test('lights-framer route loads without ErrorBoundary', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    await catalogPage.expectNoErrorBoundary()

    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(0)
  })
})
