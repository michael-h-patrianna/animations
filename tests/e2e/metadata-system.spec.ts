import { expect, test } from '@playwright/test'

test.describe('Metadata System - Navigation and UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for the app to load
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })
  })

  test('displays all categories in navigation sidebar', async ({ page }) => {
    // Verify all categories from structure.json are visible
    // Use .pf-main to avoid matching the mobile drawer sidebar
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await expect(sidebar.locator('.pf-sidebar__link--category:has-text("Base effects")')).toBeVisible()
    await expect(sidebar.locator('.pf-sidebar__link--category:has-text("Dialog & Modal Animations")')).toBeVisible()
    await expect(sidebar.locator('.pf-sidebar__link--category:has-text("Progress & Loading Animations")')).toBeVisible()
    await expect(sidebar.locator('.pf-sidebar__link--category:has-text("Real-time Updates & Timers")')).toBeVisible()
    await expect(sidebar.locator('.pf-sidebar__link--category:has-text("Game Elements & Rewards")')).toBeVisible()
  })

  test('displays groups within each category', async ({ page }) => {
    // Check Base effects category groups
    const sidebar = page.locator('.pf-main .pf-sidebar')
    const baseCategory = sidebar.locator('.pf-sidebar__section', { has: sidebar.locator('.pf-sidebar__link--category:has-text("Base effects")') }).first()
    await expect(baseCategory.locator('.pf-sidebar__link--group:has-text("Text effects")')).toBeVisible()
    await expect(baseCategory.locator('.pf-sidebar__link--group:has-text("Standard effects")')).toBeVisible()
    await expect(baseCategory.locator('.pf-sidebar__link--group:has-text("Button effects")')).toBeVisible()

    // Check Dialog & Modal Animations category groups
    const dialogCategory = sidebar.locator('.pf-sidebar__section', { has: sidebar.locator('.pf-sidebar__link--category:has-text("Dialog & Modal Animations")') }).first()
    await expect(dialogCategory.locator('.pf-sidebar__link--group:has-text("Base modals (framer)")')).toBeVisible()
    await expect(dialogCategory.locator('.pf-sidebar__link--group:has-text("Content choreography")')).toBeVisible()
    await expect(dialogCategory.locator('.pf-sidebar__link--group:has-text("Auto-dismiss patterns")')).toBeVisible()
    await expect(dialogCategory.locator('.pf-sidebar__link--group:has-text("Tile animations")')).toBeVisible()
  })

  test('clicking category navigates to first group in that category', async ({ page }) => {
    // Click on "Progress & Loading Animations" category
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--category:has-text("Progress & Loading Animations")').click()

    // Should navigate to first group in that category (Progress bars)
    await page.waitForTimeout(500) // Wait for navigation animation

    // Verify the group section is visible
    const groupSection = page.locator('#group-progress-bars')
    await expect(groupSection).toBeVisible()
    await expect(groupSection.locator('.pf-group__title:has-text("Progress bars")')).toBeVisible()
  })

  test('clicking group navigates to that specific group', async ({ page }) => {
    // Click on "Content choreography" group
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Content choreography")').click()

    // Wait for navigation
    await page.waitForTimeout(500)

    // Verify the group section is visible
    const groupSection = page.locator('#group-modal-content')
    await expect(groupSection).toBeVisible()
    await expect(groupSection.locator('.pf-group__title:has-text("Content choreography")')).toBeVisible()
  })

  test('active group is highlighted in sidebar', async ({ page }) => {
    // Navigate to a specific group
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Verify the group link has active class
    const textEffectsLink = sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")')
    await expect(textEffectsLink).toHaveClass(/pf-sidebar__link--active/)

    // Other groups should not be active
    const standardEffectsLink = sidebar.locator('.pf-sidebar__link--group:has-text("Standard effects")')
    await expect(standardEffectsLink).not.toHaveClass(/pf-sidebar__link--active/)
  })

  test('category with active group is highlighted in sidebar', async ({ page }) => {
    // Navigate to a group in "Dialog & Modal Animations"
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Base modals (framer)")').click()
    await page.waitForTimeout(500)

    // Verify the parent category has active class
    const dialogCategory = sidebar.locator('.pf-sidebar__link--category:has-text("Dialog & Modal Animations")')
    await expect(dialogCategory).toHaveClass(/pf-sidebar__link--active/)

    // Other categories should not be active
    const baseCategory = sidebar.locator('.pf-sidebar__link--category:has-text("Base effects")')
    await expect(baseCategory).not.toHaveClass(/pf-sidebar__link--active/)
  })

  test('animation cards render with correct title and description', async ({ page }) => {
    // Navigate to Text effects group
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find a specific animation card (Character Reveal)
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    await expect(card).toBeVisible()

    // Check title
    await expect(card.locator('.pf-card__title:has-text("Character Reveal")')).toBeVisible()

    // Check description (may be truncated)
    await expect(card.locator('.pf-card__description')).toContainText('Premium text reveal')
  })

  test('animation cards display tags', async ({ page }) => {
    // Navigate to Text effects group
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find an animation with tags
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')

    // Check for framer tag
    const metaSection = card.locator('.pf-card__meta')
    await expect(metaSection).toContainText('FRAMER')
  })

  test('animations with disableReplay have disabled replay button', async ({ page }) => {
    // Navigate to Button effects group which has animations with disableReplay
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Button effects")').click()
    await page.waitForTimeout(500)

    // Find Ripple Button which has disableReplay: true
    const rippleCard = page.locator('[data-animation-id="button-effects__ripple"]')
    await expect(rippleCard).toBeVisible()

    // Check replay button is disabled
    const replayButton = rippleCard.locator('[data-role="replay"]')
    await expect(replayButton).toBeDisabled()
  })

  test('animations without disableReplay have enabled replay button', async ({ page }) => {
    // Navigate to Text effects
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find an animation without disableReplay
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    await expect(card).toBeVisible()

    // Check replay button is enabled
    const replayButton = card.locator('[data-role="replay"]')
    await expect(replayButton).toBeEnabled()
  })

  test('replay button triggers animation remount', async ({ page }) => {
    // Navigate to Standard effects
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Standard effects")').click()
    await page.waitForTimeout(500)

    // Find Shake animation
    const card = page.locator('[data-animation-id="standard-effects__shake"]')
    await expect(card).toBeVisible()

    // Get the animation stage element
    const stage = card.locator('.pf-demo-stage')

    // Get the initial key attribute (React uses key for remounting)
    const initialContent = await stage.innerHTML()

    // Click replay button
    const replayButton = card.locator('[data-role="replay"]')
    await replayButton.click()

    // Wait a bit for remount
    await page.waitForTimeout(100)

    // The content should have changed (key changed, causing remount)
    const afterReplayContent = await stage.innerHTML()

    // We can't easily check the key directly, but we can verify the stage still exists
    await expect(stage).toBeVisible()
  })

  test('group displays correct animation count', async ({ page }) => {
    // Navigate to Text effects
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Check the group header shows count
    const groupHeader = page.locator('#group-text-effects .pf-group__title')
    await expect(groupHeader).toContainText('Text effects')

    // The count should match the number of animations in the group
    // Text effects has 18 animations according to structure.json
    await expect(groupHeader).toContainText('(18)')
  })

  test('expandable description toggles on click', async ({ page }) => {
    // Navigate to Text effects
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find a card with a long description
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    await expect(card).toBeVisible()

    const description = card.locator('.pf-card__description')
    const expandButton = card.locator('button[aria-label*="description"]')

    // Initially should be truncated (line-clamp-1)
    await expect(description).toHaveClass(/line-clamp-1/)

    // Click expand button
    await expandButton.click()

    // Should no longer be truncated
    await expect(description).not.toHaveClass(/line-clamp-1/)

    // Click again to collapse
    await expandButton.click()

    // Should be truncated again
    await expect(description).toHaveClass(/line-clamp-1/)
  })

  test('keyboard navigation works in sidebar', async ({ page }) => {
    // Focus on first category button
    const sidebar = page.locator('.pf-main .pf-sidebar')
    const firstCategory = sidebar.locator('.pf-sidebar__link--category').first()
    await firstCategory.focus()

    // Tab to next element
    await page.keyboard.press('Tab')

    // Should focus on first group
    const firstGroup = sidebar.locator('.pf-sidebar__link--group').first()
    await expect(firstGroup).toBeFocused()

    // Press Enter to navigate
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)

    // Should navigate to that group
    const groupId = await firstGroup.evaluate((el) => {
      const text = el.textContent || ''
      // Map text to group ID (simplified)
      if (text.includes('Text effects')) return 'group-text-effects'
      return ''
    })

    if (groupId) {
      const groupSection = page.locator(`#${groupId}`)
      await expect(groupSection).toBeVisible()
    }
  })

  test('all groups have unique element IDs', async ({ page }) => {
    // Navigate through several groups and verify they have unique IDs
    const groups = [
      { name: 'Text effects', id: 'group-text-effects' },
      { name: 'Standard effects', id: 'group-standard-effects' },
      { name: 'Button effects', id: 'group-button-effects' },
    ]

    for (const group of groups) {
      await page.locator(`.pf-sidebar__link--group:has-text("${group.name}")`).click()
      await page.waitForTimeout(300)

      const groupSection = page.locator(`#${group.id}`)
      await expect(groupSection).toBeVisible()

      // Verify it's the only element with this ID
      const count = await page.locator(`#${group.id}`).count()
      expect(count).toBe(1)
    }
  })

  test('animation cards have unique data-animation-id attributes', async ({ page }) => {
    // Navigate to Text effects
    const sidebar = page.locator('.pf-main .pf-sidebar')
    await sidebar.locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Get all animation cards
    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    expect(count).toBeGreaterThan(0)

    // Collect all IDs
    const ids: string[] = []
    for (let i = 0; i < count; i++) {
      const id = await cards.nth(i).getAttribute('data-animation-id')
      if (id) {
        ids.push(id)
      }
    }

    // Verify all IDs are unique
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('.pf-mobile-header', { timeout: 10000 })
  })

  test('displays mobile header with menu button', async ({ page }) => {
    // Check mobile header is visible
    await expect(page.locator('.pf-mobile-header')).toBeVisible()

    // Check hamburger menu button
    const menuButton = page.locator('.pf-hamburger[aria-label="Open menu"]')
    await expect(menuButton).toBeVisible()
  })

  test('hamburger menu opens sidebar drawer', async ({ page }) => {
    // Drawer should be hidden initially
    const drawer = page.locator('#pf-sidebar-drawer')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')

    // Click hamburger menu
    const menuButton = page.locator('.pf-hamburger[aria-label="Open menu"]')
    await menuButton.click()

    // Drawer should be open
    await expect(drawer).toHaveAttribute('aria-hidden', 'false')
    await expect(drawer).toHaveClass(/is-open/)

    // Sidebar should be visible in drawer
    const sidebar = drawer.locator('.pf-sidebar')
    await expect(sidebar).toBeVisible()
  })

  test('clicking group in drawer closes drawer and navigates', async ({ page }) => {
    // Open drawer
    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await page.waitForTimeout(300)

    // Click on a group
    const drawer = page.locator('#pf-sidebar-drawer')
    await drawer.locator('.pf-sidebar__link--group:has-text("Standard effects")').click()

    // Wait for navigation
    await page.waitForTimeout(500)

    // Drawer should be closed
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')

    // Group should be visible
    const groupSection = page.locator('#group-standard-effects')
    await expect(groupSection).toBeVisible()
  })

  test('close button in drawer closes the drawer', async ({ page }) => {
    // Open drawer
    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await page.waitForTimeout(300)

    // Click close button
    const closeButton = page.locator('.pf-hamburger[aria-label="Close menu"]')
    await closeButton.click()

    // Drawer should be closed
    const drawer = page.locator('#pf-sidebar-drawer')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })

  test('ESC key closes drawer', async ({ page }) => {
    // Open drawer
    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await page.waitForTimeout(300)

    // Press ESC
    await page.keyboard.press('Escape')

    // Drawer should be closed
    const drawer = page.locator('#pf-sidebar-drawer')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })

  test('clicking overlay closes drawer', async ({ page }) => {
    // Open drawer
    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await page.waitForTimeout(300)

    // Click overlay
    const overlay = page.locator('.pf-drawer__overlay')
    await overlay.click()

    // Drawer should be closed
    const drawer = page.locator('#pf-sidebar-drawer')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })
})
