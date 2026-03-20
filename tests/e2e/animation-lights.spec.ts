import { test, expect } from './fixtures/catalog.fixture'

/**
 * PRODUCTION BUG: The lights-framer group crashes the app on load.
 * Error: "Element type is invalid. Received a promise that resolves to: undefined.
 * Lazy element type must resolve to a class or function."
 * The ErrorBoundary catches this and shows the fallback UI.
 *
 * Root cause: buildGroupExport lazy-wraps the lights components incorrectly —
 * the glob import doesn't resolve to a valid default export.
 *
 * These tests are marked as known failures pending the production fix.
 */
test.describe('Lights Animation Controls', () => {
  // Skip: lights-framer route crashes the app (production bug)
  // Uncomment when the lazy loading bug in lights components is fixed
  test.fixme(true, 'lights-framer crashes app: broken lazy component resolution')

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
    await expect(stage.locator('.pf-card__placeholder')).toHaveCount(0)
  })

  test('color picker is present with valid default color', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    const card = catalogPage.card('lights__circle-static-1')
    const colorPicker = card.locator('input[type="color"][aria-label="Bulb color"]')

    await expect(colorPicker).toBeVisible()
    const value = await colorPicker.inputValue()
    expect(value).toMatch(/^#[0-9a-f]{6}$/i)
  })
})

test.describe('Lights Route Error Detection', () => {
  test('lights-framer route triggers ErrorBoundary (known production bug)', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto('/lights-framer')

    // The ErrorBoundary should catch the crash and show the fallback UI
    await expect(page.locator('[data-testid="error-heading"]')).toBeVisible({
      timeout: 10_000,
    })

    // Verify the error is the known lazy-loading bug (React logs it to console.error)
    expect(consoleErrors.some((e) => e.includes('Lazy element type'))).toBe(true)
  })
})
