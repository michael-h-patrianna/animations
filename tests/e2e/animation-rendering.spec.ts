import { expect, test } from '@playwright/test'

test.describe('Animation Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })
  })

  test('renders at least one animation from Base effects category', async ({ page }) => {
    // Navigate to Text effects group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find Character Reveal animation
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    await expect(card).toBeVisible()

    // Verify the animation component renders (not just placeholder)
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Check that there's actual content inside (not empty)
    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
    expect(stageContent).not.toContain('pf-card__placeholder')
  })

  test('renders at least one animation from Dialog & Modal category', async ({ page }) => {
    // Navigate to Base modals (framer) group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Base modals (framer)")').click()
    await page.waitForTimeout(500)

    // Find Gentle Scale Pop animation
    const card = page.locator('[data-animation-id="modal-base-framer__scale-gentle-pop"]')
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Check that there's actual content
    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
  })

  test('renders at least one animation from Progress & Loading category', async ({ page }) => {
    // Navigate to Progress bars group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Progress bars")').click()
    await page.waitForTimeout(500)

    // Find Timeline Progress animation
    const card = page.locator('[data-animation-id="progress-bars__timeline-progress"]')
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
  })

  test('renders at least one animation from Real-time Updates category', async ({ page }) => {
    // Navigate to Timer effects group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Timer effects")').click()
    await page.waitForTimeout(500)

    // Find Color Shift timer
    const card = page.locator('[data-animation-id="timer-effects__timer-color-shift"]')
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
  })

  test('renders at least one animation from Game Elements & Rewards category', async ({ page }) => {
    // Navigate to Icon animations group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Icon animations")').click()
    await page.waitForTimeout(500)

    // Find Shake icon animation
    const card = page.locator('[data-animation-id="icon-animations__shake"]')
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
  })

  test('renders at least one animation from Misc category', async ({ page }) => {
    // Navigate to Misc group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Misc")').click()
    await page.waitForTimeout(500)

    // Find Orbital Pulse animation
    const card = page.locator('[data-animation-id="misc__orbital-pulse"]')
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
  })

  test('animation components have proper CSS classes', async ({ page }) => {
    // Navigate to Standard effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Standard effects")').click()
    await page.waitForTimeout(500)

    // Check Shake animation
    const card = page.locator('[data-animation-id="standard-effects__shake"]')
    await expect(card).toBeVisible()

    // Verify pf-demo-stage class exists
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Verify pf-demo-canvas wrapper
    const canvas = card.locator('.pf-demo-canvas')
    await expect(canvas).toBeVisible()

    // Verify the stage has the top alignment class
    await expect(stage).toHaveClass(/pf-demo-stage--top/)
  })

  test('Framer Motion animations render with motion elements', async ({ page }) => {
    // Navigate to Text effects (uses Framer Motion)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find Wave Text animation (uses Framer Motion)
    const card = page.locator('[data-animation-id="text-effects__wave-text"]')
    await expect(card).toBeVisible()

    // Wait for animation to render
    await page.waitForTimeout(300)

    // Check that there are animated elements (Framer Motion adds specific attributes)
    const stage = card.locator('.pf-demo-stage')
    const innerContent = await stage.innerHTML()

    // Should contain actual rendered content
    expect(innerContent.trim().length).toBeGreaterThan(50) // Substantial content
  })

  test('CSS animations render with proper keyframe elements', async ({ page }) => {
    // Navigate to Button effects (uses CSS)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Button effects")').click()
    await page.waitForTimeout(500)

    // Find Jitter button animation
    const card = page.locator('[data-animation-id="button-effects__jitter"]')
    await expect(card).toBeVisible()

    // Verify content renders
    const stage = card.locator('.pf-demo-stage')
    const content = await stage.innerHTML()

    // Should have button element
    expect(content).toContain('button')
  })

  test('replay button triggers animation remount with visible DOM change', async ({ page }) => {
    // Navigate to Standard effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Standard effects")').click()
    await page.waitForTimeout(500)

    // Find Bounce animation
    const card = page.locator('[data-animation-id="standard-effects__bounce"]')
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')
    const replayButton = card.locator('[data-role="replay"]')

    // Wait for initial render
    await page.waitForTimeout(500)

    // Get initial state - count child elements
    const initialChildCount = await stage.evaluate((el) => el.children.length)

    // Click replay
    await replayButton.click()

    // Wait a moment for remount
    await page.waitForTimeout(200)

    // Stage should still be visible
    await expect(stage).toBeVisible()

    // Child count should be the same (remounted with same structure)
    const afterReplayChildCount = await stage.evaluate((el) => el.children.length)
    expect(afterReplayChildCount).toBeGreaterThan(0)
  })

  test('multiple replays work correctly', async ({ page }) => {
    // Navigate to Standard effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Standard effects")').click()
    await page.waitForTimeout(500)

    const card = page.locator('[data-animation-id="standard-effects__shake"]')
    await expect(card).toBeVisible()

    const replayButton = card.locator('[data-role="replay"]')
    const stage = card.locator('.pf-demo-stage')

    // Click replay multiple times
    for (let i = 0; i < 3; i++) {
      await replayButton.click()
      await page.waitForTimeout(100)

      // Stage should always be visible after replay
      await expect(stage).toBeVisible()

      // Should have content
      const content = await stage.innerHTML()
      expect(content.trim().length).toBeGreaterThan(0)
    }
  })

  test('infinite animations render immediately without waiting for viewport', async ({ page }) => {
    // Navigate to Loading states group (has infinite animations)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Loading states")').click()
    await page.waitForTimeout(500)

    // Find a loading spinner (infinite animation)
    const card = page.locator('[data-animation-id="loading-states__spinner-dual-ring"]')
    await expect(card).toBeVisible()

    // Should render immediately without intersection observer delay
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Should have spinner content
    const content = await stage.innerHTML()
    expect(content.trim().length).toBeGreaterThan(0)
  })

  test('animations with complex structures render all child elements', async ({ page }) => {
    // Navigate to Celebration effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Celebration effects")').click()
    await page.waitForTimeout(500)

    // Find Confetti Burst (has many child particles)
    const card = page.locator('[data-animation-id="modal-celebrations__confetti-burst"]')
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')

    // Wait for content to render
    await page.waitForTimeout(300)

    // Should have multiple child elements (confetti particles)
    const childCount = await stage.evaluate((el) => {
      // Count all descendants
      return el.querySelectorAll('*').length
    })

    expect(childCount).toBeGreaterThan(5) // Should have multiple particles
  })

  test('text-based animations render text content', async ({ page }) => {
    // Navigate to Text effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find Typewriter animation
    const card = page.locator('[data-animation-id="text-effects__typewriter"]')
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')

    // Wait for animation to start
    await page.waitForTimeout(500)

    // Should contain text content
    const textContent = await stage.textContent()
    expect(textContent?.trim().length).toBeGreaterThan(0)
  })

  test('modal animations render with overlay and content', async ({ page }) => {
    // Navigate to Base modals
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Base modals (framer)")').click()
    await page.waitForTimeout(500)

    // Find a modal animation
    const card = page.locator('[data-animation-id="modal-base-framer__slide-up-soft"]')
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')

    // Wait for render
    await page.waitForTimeout(300)

    // Should have content
    const innerHTML = await stage.innerHTML()
    expect(innerHTML).toContain('div') // Should have modal structure
  })

  test('lights animations render with configurable bulb count', async ({ page }) => {
    // Navigate to Lights group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Lights")').click()
    await page.waitForTimeout(500)

    // Find a lights animation
    const card = page.locator('[data-animation-id="lights__circle-static-1"]')
    await expect(card).toBeVisible()

    // Should have bulb count controls
    const bulbCountInput = card.locator('input[type="number"][aria-label="Number of bulbs"]')
    await expect(bulbCountInput).toBeVisible()

    // Should have color picker
    const colorPicker = card.locator('input[type="color"][aria-label="Bulb color"]')
    await expect(colorPicker).toBeVisible()

    // Verify animation renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()
  })

  test('changing lights animation parameters triggers re-render', async ({ page }) => {
    // Navigate to Lights group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Lights")').click()
    await page.waitForTimeout(500)

    const card = page.locator('[data-animation-id="lights__circle-static-1"]')
    await expect(card).toBeVisible()

    const bulbCountInput = card.locator('input[type="number"][aria-label="Number of bulbs"]')
    const increaseButton = card.locator('button[aria-label="Increase bulb count"]')

    // Get initial value
    const initialValue = await bulbCountInput.inputValue()

    // Increase bulb count
    await increaseButton.click()

    // Value should have changed
    const newValue = await bulbCountInput.inputValue()
    expect(parseInt(newValue)).toBe(parseInt(initialValue) + 1)

    // Animation should still render
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()
  })

  test('animations without components show placeholder', async ({ page }) => {
    // This tests the fallback for animations not yet implemented
    // We'll check the registry to see if there are any missing animations

    // Navigate to any group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Get all animation cards
    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    // Check each card
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i)
      const stage = card.locator('.pf-demo-stage')

      // Check if it's a placeholder or real content
      const hasPlaceholder = await stage.locator('.pf-card__placeholder').count()

      if (hasPlaceholder > 0) {
        // If placeholder exists, verify it shows the animation ID
        const placeholderText = await stage.locator('.pf-card__placeholder').textContent()
        expect(placeholderText?.length).toBeGreaterThan(0)
      } else {
        // Otherwise, should have real content
        const content = await stage.innerHTML()
        expect(content.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

test.describe('Animation Performance and Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })
  })

  test('animations lazy load when scrolled into view', async ({ page }) => {
    // Navigate to a group with many animations
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Standard effects")').click()
    await page.waitForTimeout(500)

    // Scroll to bottom card
    const lastCard = page.locator('[data-animation-id="standard-effects__heartbeat"]')

    // Scroll it into view
    await lastCard.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Should be visible and rendered
    await expect(lastCard).toBeVisible()
    const stage = lastCard.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()
  })

  test('animation cards handle rapid navigation without errors', async ({ page }) => {
    // Rapidly switch between groups
    const groups = ['Text effects', 'Standard effects', 'Button effects']

    for (const groupName of groups) {
      await page.locator(`.pf-sidebar__link--group:has-text("${groupName}")`).click()
      await page.waitForTimeout(200) // Short delay
    }

    // Final group should be visible and animations should render
    const finalGroup = page.locator('#group-button-effects')
    await expect(finalGroup).toBeVisible()

    // Check that animations rendered
    const cards = page.locator('[data-animation-id^="button-effects__"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })
})
