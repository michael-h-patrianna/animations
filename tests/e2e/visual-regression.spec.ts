/**
 * Visual regression tests — screenshot comparison for all animation groups.
 *
 * These tests capture screenshots of every group's animation cards in their
 * static state (after initial animation completes) and compare against
 * committed baselines. Both Framer rendering and CSS/Framer card-count parity
 * are verified for all 18 groups across 5 categories.
 *
 * Run with: npm run test:e2e -- --project=chromium visual-regression
 * Update baselines: npm run test:e2e -- --project=chromium visual-regression --update-snapshots
 */

import { test, expect } from './fixtures/catalog.fixture'

// All groups — full visual regression coverage across every category.
// Each group is tested in Framer mode (the default).
const ALL_GROUPS = [
  // base
  { id: 'text-effects-framer', category: 'base' },
  { id: 'standard-effects-framer', category: 'base' },
  { id: 'button-effects-framer', category: 'base' },
  // dialogs
  { id: 'modal-base-framer', category: 'dialogs' },
  { id: 'modal-content-framer', category: 'dialogs' },
  { id: 'modal-dismiss-framer', category: 'dialogs' },
  { id: 'modal-open-framer', category: 'dialogs' },
  { id: 'modal-orchestration-framer', category: 'dialogs' },
  // progress
  { id: 'progress-bars-framer', category: 'progress' },
  { id: 'loading-states-framer', category: 'progress' },
  // realtime
  { id: 'timer-effects-framer', category: 'realtime' },
  { id: 'update-indicators-framer', category: 'realtime' },
  { id: 'realtime-data-framer', category: 'realtime' },
  // rewards
  { id: 'collection-effects-framer', category: 'rewards' },
  { id: 'icon-animations-framer', category: 'rewards' },
  { id: 'lights-framer', category: 'rewards' },
  { id: 'modal-celebrations-framer', category: 'rewards' },
  { id: 'prize-reveal-framer', category: 'rewards' },
]

// Groups with Math.random()-driven particle effects or in-flight Motion
// transitions produce non-deterministic renders. A higher threshold prevents
// flaky failures while still catching large layout regressions.
const NONDETERMINISTIC_GROUPS = new Set([
  'modal-content-framer', // gradient sweep captured mid-transition
  'prize-reveal-framer', // random particle positions/sizes
])

test.describe('Visual regression', () => {
  for (const group of ALL_GROUPS) {
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
        maxDiffPixelRatio: NONDETERMINISTIC_GROUPS.has(group.id) ? 0.10 : 0.02,
        animations: 'disabled',
      })
    })
  }
})

test.describe('CSS vs Framer visual parity', () => {
  // All groups — full CSS vs Framer parity coverage
  const PARITY_GROUPS = [
    // base
    { base: 'text-effects', category: 'base' },
    { base: 'standard-effects', category: 'base' },
    { base: 'button-effects', category: 'base' },
    // dialogs
    { base: 'modal-base', category: 'dialogs' },
    { base: 'modal-content', category: 'dialogs' },
    { base: 'modal-dismiss', category: 'dialogs' },
    { base: 'modal-open', category: 'dialogs' },
    { base: 'modal-orchestration', category: 'dialogs' },
    // progress
    { base: 'progress-bars', category: 'progress' },
    { base: 'loading-states', category: 'progress' },
    // realtime
    { base: 'timer-effects', category: 'realtime' },
    { base: 'update-indicators', category: 'realtime' },
    { base: 'realtime-data', category: 'realtime' },
    // rewards
    { base: 'collection-effects', category: 'rewards' },
    { base: 'icon-animations', category: 'rewards' },
    { base: 'lights', category: 'rewards' },
    { base: 'modal-celebrations', category: 'rewards' },
    { base: 'prize-reveal', category: 'rewards' },
  ]

  for (const group of PARITY_GROUPS) {
    test(`${group.category}: ${group.base} Framer and CSS variants have similar layout`, async ({
      catalogPage,
    }) => {
      // Capture Framer variant — use scopedCards to avoid counting internal
      // animation roots (e.g., some components nest data-animation-id)
      await catalogPage.gotoGroup(`${group.base}-framer`)
      const contentPane = catalogPage.page.locator('[data-testid="editor-center-pane"]')
      await expect(contentPane).toBeVisible()
      await catalogPage.waitForCards()

      const framerCards = await catalogPage.scopedCards(`${group.base}-framer`).count()

      // Switch to CSS variant
      await catalogPage.gotoGroup(`${group.base}-css`)
      await catalogPage.waitForCards()

      const cssCards = await catalogPage.scopedCards(`${group.base}-css`).count()

      // Both variants should render the same number of animation cards
      expect(cssCards).toBe(framerCards)

      // Screenshot the CSS variant for its own baseline
      const isNondeterministic = NONDETERMINISTIC_GROUPS.has(`${group.base}-framer`)
      await expect(contentPane).toHaveScreenshot(`${group.base}-css-parity.png`, {
        maxDiffPixelRatio: isNondeterministic ? 0.10 : 0.02,
        animations: 'disabled',
      })
    })
  }
})
