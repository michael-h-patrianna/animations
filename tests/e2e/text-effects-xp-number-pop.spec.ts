import { expect, test } from '@playwright/test'

test.describe('Text Effects - XP Number Pop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Navigate to text-effects category
    const textEffectsLink = page.locator('a[href="/text-effects"]')
    await textEffectsLink.click()
    await page.waitForURL('/text-effects')
  })

  test('XP Number Pop - renders with proper structure', async ({ page }) => {
    // Find the animation card
    const card = page.locator('.pf-card[data-animation-id="text-effects__xp-number-pop"]').first()
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Check for the container
    const container = stage.locator('.txnp-container')
    await expect(container).toBeVisible()

    // Verify the number wrapper exists
    const numberWrapper = container.locator('.txnp-number-wrapper')
    await expect(numberWrapper).toBeVisible()

    // Check for the number value
    const numberValue = numberWrapper.locator('.txnp-number-value')
    await expect(numberValue).toBeVisible()

    // Check for the XP label
    const label = numberWrapper.locator('.txnp-label')
    await expect(label).toBeVisible()
    await expect(label).toHaveText('XP')
  })

  test('XP Number Pop - counts up to final value', async ({ page }) => {
    const card = page.locator('.pf-card[data-animation-id="text-effects__xp-number-pop"]').first()
    await expect(card).toBeVisible()

    const numberValue = card.locator('.txnp-number-value')
    await expect(numberValue).toBeVisible()

    // Wait for animation to complete
    await page.waitForTimeout(3000)

    // Check that it reaches the final value (default is 240)
    const finalText = await numberValue.textContent()
    expect(finalText).toMatch(/\+\d+/)

    // Extract number and verify it's around 240
    const finalNumber = parseInt(finalText?.replace('+', '') || '0', 10)
    expect(finalNumber).toBeGreaterThanOrEqual(235)
    expect(finalNumber).toBeLessThanOrEqual(245)
  })

  test('XP Number Pop - shows floating particles', async ({ page }) => {
    const card = page.locator('.pf-card[data-animation-id="text-effects__xp-number-pop"]').first()
    await expect(card).toBeVisible()

    // Wait for particles to appear
    await page.waitForTimeout(800)

    // Check that particles exist
    const particles = card.locator('.txnp-particle')
    const particleCount = await particles.count()

    // Should have at least 1 particle (default maxParticles is 10, but depends on finalValue)
    expect(particleCount).toBeGreaterThan(0)
    expect(particleCount).toBeLessThanOrEqual(10)

    // Verify particles have increment values
    if (particleCount > 0) {
      const firstParticle = particles.first()
      const particleText = await firstParticle.textContent()
      expect(particleText).toMatch(/\+\d+/)
    }
  })

  test('XP Number Pop - particles have CSS variable positions', async ({ page }) => {
    const card = page.locator('.pf-card[data-animation-id="text-effects__xp-number-pop"]').first()
    await expect(card).toBeVisible()

    // Wait for particles to render
    await page.waitForTimeout(500)

    const particles = card.locator('.txnp-particle')
    const particleCount = await particles.count()

    if (particleCount > 0) {
      const firstParticle = particles.first()

      // Check that CSS variables are set
      const style = await firstParticle.getAttribute('style')
      expect(style).toContain('--particle-x')
      expect(style).toContain('--particle-y')
      expect(style).toContain('animation-delay')
    }
  })

  test('XP Number Pop - has proper data attribute', async ({ page }) => {
    const card = page.locator('.pf-card[data-animation-id="text-effects__xp-number-pop"]').first()
    await expect(card).toBeVisible()

    const container = card.locator('[data-animation-id="text-effects__xp-number-pop"]')
    await expect(container).toBeVisible()
  })
})
