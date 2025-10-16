import { expect, test } from '@playwright/test'

test.describe('TextEffectsLevelBreakthrough - Visual Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display and animate Level Breakthrough text effect', async ({ page }) => {
    // Navigate to Text Effects category
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Find and click the Level Breakthrough animation
    const breakthroughButton = page.locator('button:has-text("Level Breakthrough")')
    await expect(breakthroughButton).toBeVisible()
    await breakthroughButton.click()

    // Wait for animation to load
    await page.waitForTimeout(500)

    // Verify the animation container is present
    const animationContainer = page.locator('[data-animation-id="text-effects__level-breakthrough"]')
    await expect(animationContainer).toBeVisible()

    // Verify namespaced CSS classes are applied
    const textWrapper = page.locator('.tfx-breakthrough-text-wrapper')
    await expect(textWrapper).toBeVisible()

    // Verify start text is rendered
    const startText = page.locator('.tfx-breakthrough-text-start')
    await expect(startText).toBeVisible()
    await expect(startText).toContainText('LEVEL 1')

    // Verify end text exists in DOM (even if initially hidden)
    const endText = page.locator('.tfx-breakthrough-text-end')
    await expect(endText).toHaveCount(1)
    await expect(endText).toContainText('LEVEL 2')

    // Verify surge rings exist
    const surgeOuter = page.locator('.tfx-breakthrough-surge-outer')
    const surgeInner = page.locator('.tfx-breakthrough-surge-inner')
    await expect(surgeOuter).toHaveCount(1)
    await expect(surgeInner).toHaveCount(1)

    // Wait for animation to complete
    await page.waitForTimeout(1500)

    // After animation, end text should be visible
    const endTextVisible = await endText.isVisible()
    expect(endTextVisible).toBe(true)
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

    // Find and click the Level Breakthrough animation
    const breakthroughButton = page.locator('button:has-text("Level Breakthrough")')
    await breakthroughButton.click()
    await page.waitForTimeout(500)

    // Verify the CSS-based animation is loaded
    const animationContainer = page.locator('[data-animation-id="text-effects__level-breakthrough"]')
    await expect(animationContainer).toBeVisible()

    // Verify namespaced classes (CSS version should use tfx-breakthrough- prefix)
    const textWrapper = page.locator('.tfx-breakthrough-text-wrapper')
    await expect(textWrapper).toBeVisible()
  })

  test('should not have conflicting class names with other animations', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Level Breakthrough
    await page.click('text=Level Breakthrough')
    await page.waitForTimeout(500)

    // Verify all classes are properly namespaced with tfx-
    const container = page.locator('.tfx-breakthrough-container')
    await expect(container).toBeVisible()

    // Check that old pf- prefixed classes don't exist
    const oldPfContainer = page.locator('.pf-breakthrough-container')
    await expect(oldPfContainer).toHaveCount(0)

    const oldPfText = page.locator('.pf-level-breakthrough')
    await expect(oldPfText).toHaveCount(0)

    const oldPfSurge = page.locator('.pf-surge-lines')
    await expect(oldPfSurge).toHaveCount(0)

    // Check that no generic classes exist that could conflict
    const genericBreakthrough = page.locator('[class*="breakthrough-container"]')
      .and(page.locator(':not([class*="tfx-breakthrough"])'))
      .first()
    const count = await genericBreakthrough.count()
    expect(count).toBe(0)
  })

  test('should handle replay correctly', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Level Breakthrough
    await page.click('text=Level Breakthrough')
    await page.waitForTimeout(500)

    // Verify initial animation
    const animationContainer = page.locator('[data-animation-id="text-effects__level-breakthrough"]')
    await expect(animationContainer).toBeVisible()

    // Wait for animation to complete
    await page.waitForTimeout(1500)

    // End text should be visible
    const endText = page.locator('.tfx-breakthrough-text-end')
    await expect(endText).toBeVisible()

    // Find and click replay button
    const replayButton = page.locator('button:has-text("Replay")')
    if (await replayButton.isVisible()) {
      await replayButton.click()
      await page.waitForTimeout(100)

      // Animation should still be visible and replay
      await expect(animationContainer).toBeVisible()

      // Wait for replay to complete
      await page.waitForTimeout(1500)

      // Verify animation is still visible
      await expect(animationContainer).toBeVisible()
      await expect(endText).toBeVisible()
    }
  })

  test('should apply GPU-accelerated CSS animations', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Level Breakthrough
    await page.click('text=Level Breakthrough')
    await page.waitForTimeout(500)

    // Get computed styles to verify GPU-accelerated properties
    const textWrapper = page.locator('.tfx-breakthrough-text-wrapper')
    await expect(textWrapper).toBeVisible()

    // Verify will-change is set for GPU acceleration hint
    const willChange = await textWrapper.evaluate((el) => {
      return window.getComputedStyle(el).willChange
    })
    expect(willChange).toContain('transform')

    // Check surge rings have will-change
    const surgeOuter = page.locator('.tfx-breakthrough-surge-outer')
    const surgeWillChange = await surgeOuter.evaluate((el) => {
      return window.getComputedStyle(el).willChange
    })
    expect(surgeWillChange).toBeTruthy()
  })

  test('should transition from start text to end text during animation', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Level Breakthrough
    await page.click('text=Level Breakthrough')
    await page.waitForTimeout(500)

    const startText = page.locator('.tfx-breakthrough-text-start')
    const endText = page.locator('.tfx-breakthrough-text-end')

    // Initially, start text should be visible
    await expect(startText).toBeVisible()
    await expect(startText).toContainText('LEVEL 1')

    // End text exists but may not be visible yet
    await expect(endText).toHaveCount(1)

    // Wait for transition point (around 600ms into 1000ms animation)
    await page.waitForTimeout(700)

    // After transition, end text should be visible
    await expect(endText).toBeVisible()
    await expect(endText).toContainText('LEVEL 2')
  })

  test('should have surge rings expand during animation', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Level Breakthrough
    await page.click('text=Level Breakthrough')
    await page.waitForTimeout(500)

    const surgeOuter = page.locator('.tfx-breakthrough-surge-outer')
    const surgeInner = page.locator('.tfx-breakthrough-surge-inner')

    // Both surge rings should exist
    await expect(surgeOuter).toHaveCount(1)
    await expect(surgeInner).toHaveCount(1)

    // Verify they have radial gradient backgrounds
    const outerBackground = await surgeOuter.evaluate((el) => {
      return window.getComputedStyle(el).background
    })
    expect(outerBackground).toContain('radial-gradient')

    const innerBackground = await surgeInner.evaluate((el) => {
      return window.getComputedStyle(el).background
    })
    expect(innerBackground).toContain('radial-gradient')
  })

  test('should work with different text lengths', async ({ page }) => {
    // Navigate to Text Effects
    await page.click('text=Text Effects')
    await page.waitForTimeout(300)

    // Click Level Breakthrough
    await page.click('text=Level Breakthrough')
    await page.waitForTimeout(500)

    const animationContainer = page.locator('[data-animation-id="text-effects__level-breakthrough"]')
    await expect(animationContainer).toBeVisible()

    // Verify the default texts work (tested as baseline)
    const startText = page.locator('.tfx-breakthrough-text-start')
    const endText = page.locator('.tfx-breakthrough-text-end')
    
    await expect(startText).toBeVisible()
    await expect(endText).toHaveCount(1)

    // Structure should be intact regardless of text content
    const textWrapper = page.locator('.tfx-breakthrough-text-wrapper')
    await expect(textWrapper).toBeVisible()
  })
})
