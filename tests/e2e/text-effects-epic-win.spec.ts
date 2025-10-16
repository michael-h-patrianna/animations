import { expect, test } from '@playwright/test'

test.describe('TextEffectsEpicWin - Visual Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display and animate Epic Win text effect', async ({ page }) => {
    // Navigate to Text Effects category
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Find and click the Epic Win animation
    const epicWinButton = page.locator('button:has-text("Epic Win")')
    await expect(epicWinButton).toBeVisible()
    await epicWinButton.click()

    // Wait for animation to load
    await page.waitForTimeout(500)

    // Verify the animation container is present
    const animationContainer = page.locator('[data-animation-id="text-effects__epic-win"]')
    await expect(animationContainer).toBeVisible()

    // Verify namespaced CSS classes are applied
    const mainText = page.locator('.tfe-epic-win__main-text')
    await expect(mainText).toBeVisible()

    // Verify text content is rendered
    await expect(mainText).toContainText('EPIC WIN')

    // Verify shadow layers exist
    const shadowFar = page.locator('.tfe-epic-win__shadow-far')
    const shadowMid = page.locator('.tfe-epic-win__shadow-mid')
    await expect(shadowFar).toBeVisible()
    await expect(shadowMid).toBeVisible()

    // Verify animation class is applied
    await expect(animationContainer).toHaveClass(/tfe-epic-win--animate/)

    // Verify individual characters are rendered
    const characters = page.locator('.tfe-epic-win__char')
    const characterCount = await characters.count()
    expect(characterCount).toBe(8) // "EPIC WIN" = 8 characters including space

    // Verify character glows are present
    const glows = page.locator('.tfe-epic-win__char-glow')
    const glowCount = await glows.count()
    expect(glowCount).toBe(8)

    // Wait for animation to complete
    await page.waitForTimeout(2000)

    // Verify final animation state - characters should be visible
    const firstChar = characters.first()
    await expect(firstChar).toBeVisible()
  })

  test('should render with CSS mode selected', async ({ page }) => {
    // Ensure CSS mode is selected
    const cssModeButton = page.locator('button:has-text("CSS")')
    if (await cssModeButton.isVisible()) {
      await cssModeButton.click()
      await page.waitForTimeout(200)
    }

    // Navigate to Text Effects category
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Find and click the Epic Win animation
    const epicWinButton = page.locator('button:has-text("Epic Win")')
    await epicWinButton.click()
    await page.waitForTimeout(500)

    // Verify the CSS-based animation is loaded
    const animationContainer = page.locator('[data-animation-id="text-effects__epic-win"]')
    await expect(animationContainer).toBeVisible()

    // Verify namespaced classes (CSS version should use tfe-epic-win- prefix)
    const mainText = page.locator('.tfe-epic-win__main-text')
    await expect(mainText).toBeVisible()
  })

  test('should not have conflicting class names with other animations', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Epic Win
    await page.click('text=Epic Win')
    await page.waitForTimeout(500)

    // Verify all classes are properly namespaced
    const container = page.locator('.tfe-epic-win')
    await expect(container).toBeVisible()

    // Check that no generic classes exist that could conflict
    const genericEpicClasses = page.locator('[class*="epic-win-container"]')
    await expect(genericEpicClasses).toHaveCount(0)

    const genericCharClasses = page
      .locator('[class*="epic-char"]')
      .and(page.locator(':not([class*="tfe-epic-win"])'))
      .first()
    // Should not find any generic epic-char classes
    const count = await genericCharClasses.count()
    expect(count).toBe(0)
  })

  test('should handle replay correctly', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Epic Win
    await page.click('text=Epic Win')
    await page.waitForTimeout(500)

    // Verify initial animation
    const animationContainer = page.locator('[data-animation-id="text-effects__epic-win"]')
    await expect(animationContainer).toBeVisible()

    // Wait for animation to complete
    await page.waitForTimeout(2000)

    // Find and click replay button
    const replayButton = page.locator('button:has-text("Replay")')
    if (await replayButton.isVisible()) {
      await replayButton.click()
      await page.waitForTimeout(100)

      // Animation should still be visible and replay
      await expect(animationContainer).toBeVisible()

      // Wait for replay to complete
      await page.waitForTimeout(2000)

      // Verify animation is still visible
      await expect(animationContainer).toBeVisible()
    }
  })

  test('should apply GPU-accelerated CSS animations', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Epic Win
    await page.click('text=Epic Win')
    await page.waitForTimeout(500)

    // Get computed styles to verify GPU-accelerated properties
    const firstChar = page.locator('.tfe-epic-win__char').first()
    await expect(firstChar).toBeVisible()

    // Verify will-change is set (for GPU acceleration hint)
    const willChange = await firstChar.evaluate((el) => {
      return window.getComputedStyle(el).willChange
    })

    // Should have will-change set for GPU acceleration
    expect(willChange).toBeTruthy()

    // Verify transform style is preserved for 3D
    const transformStyle = await firstChar.evaluate((el) => {
      return window.getComputedStyle(el).transformStyle
    })
    expect(transformStyle).toBe('preserve-3d')
  })
})
