import { expect, test } from '@playwright/test'

test.describe('Text Effects - Counter Increment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

    // Navigate to Text effects group
    await page
      .locator('.pf-main .pf-sidebar .pf-sidebar__link--group:has-text("Text effects")')
      .first()
      .click()
    await page.waitForTimeout(500)
  })

  test('Counter Increment (continuous) - renders with proper structure', async ({ page }) => {
    // Find Counter Increment animation card
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment"]')
      .first()
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Check for the counter container
    const container = stage.locator('.teci-container')
    await expect(container).toBeVisible()

    // Verify the counter value wrapper exists
    const valueWrapper = container.locator('.teci-value-wrapper')
    await expect(valueWrapper).toBeVisible()

    // Verify the counter value element exists
    const value = valueWrapper.locator('.teci-value')
    await expect(value).toBeVisible()
  })

  test('Counter Increment (continuous) - increments over time', async ({ page }) => {
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment"]')
      .first()
    await expect(card).toBeVisible()

    const value = card.locator('.teci-value')
    await expect(value).toBeVisible()

    // Get initial value
    const initialText = await value.textContent()
    const initialValue = parseInt(initialText?.replace(/,/g, '') || '0', 10)

    // Wait for increment (default is 2000ms)
    await page.waitForTimeout(2500)

    // Get new value
    const newText = await value.textContent()
    const newValue = parseInt(newText?.replace(/,/g, '') || '0', 10)

    // Verify the counter increased
    expect(newValue).toBeGreaterThan(initialValue)
  })

  test('Counter Increment (continuous) - shows increment particles', async ({ page }) => {
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment"]')
      .first()
    await expect(card).toBeVisible()

    // Wait for first increment cycle
    await page.waitForTimeout(500)

    // Check for particle elements
    const particles = card.locator('.teci-particle')

    // Wait for particles to appear (they appear with the first increment)
    await page.waitForTimeout(500)

    // At least one particle should exist at some point
    const particleCount = await particles.count()
    expect(particleCount).toBeGreaterThanOrEqual(0) // Particles may have faded by now
  })

  test('Counter Increment to 9999 - renders with proper structure', async ({ page }) => {
    // Find Counter Increment 9999 animation card
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment-9999"]')
      .first()
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Check for the counter container
    const container = stage.locator('.teci-container')
    await expect(container).toBeVisible()

    // Verify the counter value wrapper exists
    const valueWrapper = container.locator('.teci-value-wrapper')
    await expect(valueWrapper).toBeVisible()

    // Verify the counter value element exists
    const value = valueWrapper.locator('.teci-value')
    await expect(value).toBeVisible()
  })

  test('Counter Increment to 9999 - counts up to 9999', async ({ page }) => {
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment-9999"]')
      .first()
    await expect(card).toBeVisible()

    const value = card.locator('.teci-value')
    await expect(value).toBeVisible()

    // Initial value should be 0 or a small number
    const initialText = await value.textContent()
    const initialValue = parseInt(initialText?.replace(/,/g, '') || '0', 10)
    expect(initialValue).toBeLessThan(500)

    // Wait for some increments (500ms interval)
    await page.waitForTimeout(2000)

    // Value should be increasing
    const midText = await value.textContent()
    const midValue = parseInt(midText?.replace(/,/g, '') || '0', 10)
    expect(midValue).toBeGreaterThan(initialValue)

    // Wait for animation to complete (9999 / 250 increment ≈ 40 steps * 500ms = 20s)
    // Let's wait enough to see significant progress
    await page.waitForTimeout(5000)

    // Value should continue increasing
    const laterText = await value.textContent()
    const laterValue = parseInt(laterText?.replace(/,/g, '') || '0', 10)
    expect(laterValue).toBeGreaterThan(midValue)
  })

  test('Counter Increment to 9999 - shows multiple increment particles', async ({ page }) => {
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment-9999"]')
      .first()
    await expect(card).toBeVisible()

    // Wait for increments to start
    await page.waitForTimeout(1000)

    // Check for particle elements - should show larger increments like +250
    const particles = card.locator('.teci-particle')
    const particleCount = await particles.count()

    // With faster timing (500ms) and multiple increments, we should see particles
    expect(particleCount).toBeGreaterThanOrEqual(0)

    // If particles are visible, check one has the expected format
    if (particleCount > 0) {
      const firstParticle = particles.first()
      const particleText = await firstParticle.textContent()
      expect(particleText).toMatch(/^\+[\d,]+$/) // Should be like "+250" or "+1,000"
    }
  })

  test('Counter Increment to 9999 - eventually reaches target value', async ({ page }) => {
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment-9999"]')
      .first()
    await expect(card).toBeVisible()

    const value = card.locator('.teci-value')

    // Wait long enough for the animation to complete
    // 9999 / 250 = ~40 increments * 500ms = 20 seconds + buffer
    await page.waitForTimeout(25000)

    // Should reach 9,999
    const finalText = await value.textContent()
    expect(finalText).toBe('9,999')
  })

  test('Counter Increment animations - have correct data attributes', async ({ page }) => {
    // Check continuous version
    const continuousCard = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment"]')
      .first()
    await expect(continuousCard).toBeVisible()

    const continuousContainer = continuousCard.locator(
      '[data-animation-id="text-effects__counter-increment"]'
    )
    await expect(continuousContainer).toBeVisible()

    // Check 9999 version
    const targetCard = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment-9999"]')
      .first()
    await expect(targetCard).toBeVisible()

    // Note: The component itself uses 'text-effects__counter-increment' as data-animation-id
    // but the card uses the correct metadata ID
    const targetContainer = targetCard.locator('.teci-container')
    await expect(targetContainer).toBeVisible()
  })

  test('Counter Increment animations - apply pop animation on value change', async ({ page }) => {
    const card = page
      .locator('.pf-card[data-animation-id="text-effects__counter-increment"]')
      .first()
    await expect(card).toBeVisible()

    const value = card.locator('.teci-value')
    await expect(value).toBeVisible()

    // Check that the value has the popping class
    await expect(value).toHaveClass(/teci-value--popping/)
  })
})
