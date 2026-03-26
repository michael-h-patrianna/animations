/**
 * Visual regression tests — screenshot comparison for animation rendering.
 *
 * These tests capture screenshots of animation cards in their static state
 * (after initial animation completes) and compare against committed baselines.
 *
 * Run with: npm run test:e2e -- --project=chromium visual-regression
 * Update baselines: npm run test:e2e -- --project=chromium visual-regression --update-snapshots
 */

import { test, expect } from './fixtures/catalog.fixture'

// Representative groups — one per category to keep the test fast.
// Each group is tested in Framer mode (the default).
const REPRESENTATIVE_GROUPS = [
  { id: 'button-effects-framer', category: 'base' },
  { id: 'modal-base-framer', category: 'dialogs' },
  { id: 'progress-bars-framer', category: 'progress' },
  { id: 'timer-effects-framer', category: 'realtime' },
  { id: 'collection-effects-framer', category: 'rewards' },
]

test.describe('Visual regression', () => {
  for (const group of REPRESENTATIVE_GROUPS) {
    test(`${group.category}: ${group.id} renders consistently`, async ({ catalogPage }) => {
      await catalogPage.gotoGroup(group.id)

      // Wait for animations to be present and stable
      const cards = catalogPage.page.locator('[data-animation-id]')
      await expect(cards.first()).toBeVisible({ timeout: 10_000 })

      // Wait for animations to reach a stable state — all cards visible and loaded
      await expect(cards.last()).toBeVisible({ timeout: 10_000 })

      // Screenshot the main content area (excludes sidebar/topbar for stability)
      const contentPane = catalogPage.page.locator('[data-testid="editor-center-pane"]')
      await expect(contentPane).toHaveScreenshot(`${group.id}.png`, {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })
  }
})

test.describe('CSS vs Framer visual parity', () => {
  // Test one group per category for parity between CSS and Framer variants
  const PARITY_GROUPS = [
    { base: 'modal-base', category: 'dialogs' },
    { base: 'button-effects', category: 'base' },
  ]

  for (const group of PARITY_GROUPS) {
    test(`${group.category}: ${group.base} Framer and CSS variants have similar layout`, async ({
      catalogPage,
    }) => {
      // Capture Framer variant
      await catalogPage.gotoGroup(`${group.base}-framer`)
      const contentPane = catalogPage.page.locator('[data-testid="editor-center-pane"]')
      await expect(contentPane).toBeVisible()
      await expect(catalogPage.page.locator('[data-animation-id]').last()).toBeVisible({ timeout: 10_000 })

      const framerCards = await catalogPage.page.locator('[data-animation-id]').count()

      // Switch to CSS variant
      await catalogPage.gotoGroup(`${group.base}-css`)
      await expect(catalogPage.page.locator('[data-animation-id]').last()).toBeVisible({ timeout: 10_000 })

      const cssCards = await catalogPage.page.locator('[data-animation-id]').count()

      // Both variants should render the same number of animation cards
      expect(cssCards).toBe(framerCards)

      // Screenshot the CSS variant for its own baseline
      await expect(contentPane).toHaveScreenshot(`${group.base}-css-parity.png`, {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })
  }
})
