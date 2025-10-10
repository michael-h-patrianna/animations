import { expect, test } from '@playwright/test'

/**
 * Search and Filter Tests
 *
 * Note: As of the current implementation, the app does not have dedicated search
 * or filter UI components. This test file verifies tag metadata is present
 * and provides placeholder tests for future search/filter functionality.
 *
 * When search/filter features are implemented, these tests should be updated to:
 * - Test search input field
 * - Test filtering by tags (css, framer, js)
 * - Test filtering by technology type
 * - Test search result updates
 * - Test clearing filters
 */

test.describe('Tag Metadata Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })
  })

  test('animation cards display technology tags', async ({ page }) => {
    // Navigate to Text effects (Framer animations)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Check for Framer tag
    const framerCard = page.locator('[data-animation-id="text-effects__character-reveal"]')
    await expect(framerCard.locator('.pf-card__meta')).toContainText('FRAMER')

    // Navigate to Button effects (mixed CSS/JS)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Button effects")').click()
    await page.waitForTimeout(500)

    // Check for CSS tag
    const cssCard = page.locator('[data-animation-id="button-effects__jitter"]')
    await expect(cssCard.locator('.pf-card__meta')).toContainText('CSS')

    // Check for JS tag
    const jsCard = page.locator('[data-animation-id="button-effects__ripple"]')
    const metaSection = jsCard.locator('.pf-card__meta')
    await expect(metaSection).toContainText('CSS')
    await expect(metaSection).toContainText('JS')
  })

  test('tags accurately reflect animation implementation technology', async ({ page }) => {
    // CSS-only animations
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Button effects")').click()
    await page.waitForTimeout(500)

    const jitterCard = page.locator('[data-animation-id="button-effects__jitter"]')
    const jitterMeta = jitterCard.locator('.pf-card__meta')
    await expect(jitterMeta).toContainText('CSS')
    // Should not have other tags
    const jitterText = await jitterMeta.textContent()
    expect(jitterText).not.toContain('FRAMER')
    expect(jitterText).not.toContain('JS')

    // Framer animations
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    const waveCard = page.locator('[data-animation-id="text-effects__wave-text"]')
    const waveMeta = waveCard.locator('.pf-card__meta')
    await expect(waveMeta).toContainText('FRAMER')
  })

  test('all animation cards have at least one tag', async ({ page }) => {
    // Navigate to Standard effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Standard effects")').click()
    await page.waitForTimeout(500)

    // Get all cards
    const cards = page.locator('[data-animation-id^="standard-effects__"]')
    const count = await cards.count()

    expect(count).toBeGreaterThan(0)

    // Check first 5 cards have tags
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i)
      const metaSection = card.locator('.pf-card__meta')

      // Should have at least one tag
      const tagCount = await metaSection.locator('span').count()
      expect(tagCount).toBeGreaterThan(0)
    }
  })

  test('tags are displayed in uppercase', async ({ page }) => {
    // Navigate to any group
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Check a card
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    const metaSection = card.locator('.pf-card__meta')

    // Get tag text
    const tagText = await metaSection.textContent()

    // Should be uppercase
    expect(tagText).toBe(tagText?.toUpperCase())
  })
})

test.describe('Tag-based Navigation (Manual)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })
  })

  test('can find all CSS animations by manually navigating groups', async ({ page }) => {
    const cssAnimations: string[] = []

    // Navigate to Button effects (has CSS animations)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Button effects")').click()
    await page.waitForTimeout(500)

    // Find CSS-tagged animations
    const cards = page.locator('[data-animation-id^="button-effects__"]')
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const meta = card.locator('.pf-card__meta')
      const metaText = await meta.textContent()

      if (metaText?.includes('CSS')) {
        const animationId = await card.getAttribute('data-animation-id')
        if (animationId) cssAnimations.push(animationId)
      }
    }

    expect(cssAnimations.length).toBeGreaterThan(0)
  })

  test('can find all Framer animations by manually navigating groups', async ({ page }) => {
    const framerAnimations: string[] = []

    // Navigate to Text effects (has Framer animations)
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Text effects")').click()
    await page.waitForTimeout(500)

    // Find Framer-tagged animations
    const cards = page.locator('[data-animation-id^="text-effects__"]')
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const meta = card.locator('.pf-card__meta')
      const metaText = await meta.textContent()

      if (metaText?.includes('FRAMER')) {
        const animationId = await card.getAttribute('data-animation-id')
        if (animationId) framerAnimations.push(animationId)
      }
    }

    expect(framerAnimations.length).toBeGreaterThan(0)
  })

  test('can identify animations with multiple tags', async ({ page }) => {
    // Navigate to Button effects
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--group:has-text("Button effects")').click()
    await page.waitForTimeout(500)

    // Find Ripple button (has CSS + JS tags)
    const card = page.locator('[data-animation-id="button-effects__ripple"]')
    const meta = card.locator('.pf-card__meta')

    // Should have multiple tags
    const tagCount = await meta.locator('span').count()
    expect(tagCount).toBeGreaterThan(1)

    // Verify specific tags
    const metaText = await meta.textContent()
    expect(metaText).toContain('CSS')
    expect(metaText).toContain('JS')
  })
})

/**
 * Placeholder Tests for Future Search/Filter Implementation
 *
 * These tests are currently skipped but provide a template for when
 * search and filter functionality is added to the application.
 */
test.describe('Search Functionality (Not Implemented)', () => {
  test.skip('search input filters animations by name', async ({ page }) => {
    await page.goto('/')

    // Find search input (to be implemented)
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()

    // Type search query
    await searchInput.fill('bounce')

    // Results should update
    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    // Should show only bounce-related animations
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const title = await card.locator('.pf-card__title').textContent()
      expect(title?.toLowerCase()).toContain('bounce')
    }
  })

  test.skip('search input filters animations by description', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('pulse')

    // Should find animations with "pulse" in description
    const cards = page.locator('[data-animation-id]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test.skip('search is case-insensitive', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"]')

    // Test uppercase
    await searchInput.fill('SHAKE')
    const upperResults = await page.locator('[data-animation-id]').count()

    // Test lowercase
    await searchInput.fill('shake')
    const lowerResults = await page.locator('[data-animation-id]').count()

    expect(upperResults).toBe(lowerResults)
  })

  test.skip('clear search shows all animations', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"]')

    // Search for something specific
    await searchInput.fill('bounce')
    const searchResults = await page.locator('[data-animation-id]').count()

    // Clear search
    await searchInput.fill('')

    // Should show more animations
    const allResults = await page.locator('[data-animation-id]').count()
    expect(allResults).toBeGreaterThan(searchResults)
  })
})

test.describe('Filter Functionality (Not Implemented)', () => {
  test.skip('filter by CSS tag shows only CSS animations', async ({ page }) => {
    await page.goto('/')

    // Click CSS filter (to be implemented)
    const cssFilter = page.locator('button:has-text("CSS"), [data-filter="css"]')
    await cssFilter.click()

    // All visible animations should have CSS tag
    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const meta = card.locator('.pf-card__meta')
      await expect(meta).toContainText('CSS')
    }
  })

  test.skip('filter by Framer tag shows only Framer animations', async ({ page }) => {
    await page.goto('/')

    const framerFilter = page.locator('button:has-text("Framer"), [data-filter="framer"]')
    await framerFilter.click()

    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const meta = card.locator('.pf-card__meta')
      await expect(meta).toContainText('FRAMER')
    }
  })

  test.skip('filter by JS tag shows only JS animations', async ({ page }) => {
    await page.goto('/')

    const jsFilter = page.locator('button:has-text("JS"), [data-filter="js"]')
    await jsFilter.click()

    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const meta = card.locator('.pf-card__meta')
      await expect(meta).toContainText('JS')
    }
  })

  test.skip('multiple filters can be active simultaneously', async ({ page }) => {
    await page.goto('/')

    // Select CSS and JS filters
    await page.locator('[data-filter="css"]').click()
    await page.locator('[data-filter="js"]').click()

    // Results should include animations with either CSS or JS tags
    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const meta = card.locator('.pf-card__meta')
      const metaText = await meta.textContent()

      // Should have at least one of the selected tags
      const hasTag = metaText?.includes('CSS') || metaText?.includes('JS')
      expect(hasTag).toBe(true)
    }
  })

  test.skip('clear all filters shows all animations', async ({ page }) => {
    await page.goto('/')

    // Apply filter
    await page.locator('[data-filter="css"]').click()
    const filteredCount = await page.locator('[data-animation-id]').count()

    // Clear filter
    const clearButton = page.locator('button:has-text("Clear"), [data-action="clear-filters"]')
    await clearButton.click()

    // Should show more animations
    const allCount = await page.locator('[data-animation-id]').count()
    expect(allCount).toBeGreaterThan(filteredCount)
  })

  test.skip('filter state persists during navigation', async ({ page }) => {
    await page.goto('/')

    // Apply CSS filter
    await page.locator('[data-filter="css"]').click()

    // Navigate to different category
    await page.locator('.pf-main .pf-sidebar').locator('.pf-sidebar__link--category:has-text("Progress & Loading Animations")').click()
    await page.waitForTimeout(500)

    // Filter should still be active
    const filterButton = page.locator('[data-filter="css"]')
    await expect(filterButton).toHaveAttribute('aria-pressed', 'true')

    // Or check that only CSS animations are shown
    const cards = page.locator('[data-animation-id]')
    const firstCard = cards.first()
    const meta = firstCard.locator('.pf-card__meta')
    await expect(meta).toContainText('CSS')
  })

  test.skip('filter count shows number of results', async ({ page }) => {
    await page.goto('/')

    // Apply filter
    await page.locator('[data-filter="framer"]').click()

    // Filter should show count
    const filterButton = page.locator('[data-filter="framer"]')
    const filterText = await filterButton.textContent()

    // Should show number like "Framer (24)"
    expect(filterText).toMatch(/\(\d+\)/)
  })
})

test.describe('Combined Search and Filter (Not Implemented)', () => {
  test.skip('search and filter work together', async ({ page }) => {
    await page.goto('/')

    // Apply filter
    await page.locator('[data-filter="css"]').click()

    // Then search
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('bounce')

    // Should show only CSS animations with "bounce" in name/description
    const cards = page.locator('[data-animation-id]')
    const count = await cards.count()

    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)

      // Should have CSS tag
      const meta = card.locator('.pf-card__meta')
      await expect(meta).toContainText('CSS')

      // Should have "bounce" in title
      const title = card.locator('.pf-card__title')
      await expect(title).toContainText(/bounce/i)
    }
  })

  test.skip('clearing search maintains active filters', async ({ page }) => {
    await page.goto('/')

    // Apply filter and search
    await page.locator('[data-filter="framer"]').click()
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('text')

    // Clear search
    await searchInput.fill('')

    // Filter should still be active
    const filterButton = page.locator('[data-filter="framer"]')
    await expect(filterButton).toHaveAttribute('aria-pressed', 'true')

    // All results should still have Framer tag
    const cards = page.locator('[data-animation-id]')
    const firstCard = cards.first()
    await expect(firstCard.locator('.pf-card__meta')).toContainText('FRAMER')
  })

  test.skip('clearing filters maintains search query', async ({ page }) => {
    await page.goto('/')

    // Apply filter and search
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('modal')
    await page.locator('[data-filter="framer"]').click()

    // Clear filters
    await page.locator('[data-action="clear-filters"]').click()

    // Search query should still be active
    await expect(searchInput).toHaveValue('modal')

    // Results should still be filtered by search
    const cards = page.locator('[data-animation-id]')
    const firstCard = cards.first()
    const title = await firstCard.locator('.pf-card__title').textContent()
    expect(title?.toLowerCase()).toContain('modal')
  })
})
