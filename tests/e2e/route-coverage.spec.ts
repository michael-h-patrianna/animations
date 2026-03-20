import { test, expect } from './fixtures/catalog.fixture'

/**
 * Route coverage: navigates to EVERY group in the catalog (both Framer and CSS
 * variants) and verifies it loads without errors. Catches lazy loading failures,
 * broken imports, routing misconfigurations, and ErrorBoundary triggers.
 *
 * Uses separate test cases per group to isolate failures and avoid state
 * accumulation from navigating many lazy-loaded routes in a single page.
 */

/** All group IDs in the catalog, derived from component directory structure. */
const ALL_GROUP_IDS = [
  'button-effects',
  'text-effects',
  'standard-effects',
  'modal-base',
  'modal-content',
  'modal-dismiss',
  'modal-orchestration',
  'modal-celebrations',
  'prize-reveal',
  'icon-animations',
  'collection-effects',
  'lights',
  'progress-bars',
  'loading-states',
  'update-indicators',
  'timer-effects',
  'realtime-data',
]

for (const baseId of ALL_GROUP_IDS) {
  for (const suffix of ['-framer', '-css'] as const) {
    const groupId = `${baseId}${suffix}`

    test(`route /${groupId} loads cards without error`, async ({ catalogPage }) => {
      await catalogPage.page.goto(`/${groupId}`)
      await expect(catalogPage.sidebar).toBeVisible({ timeout: 15_000 })

      // No error boundary
      await expect(catalogPage.page.locator('[data-testid="error-fallback"]')).toHaveCount(0)

      // At least one animation card is visible
      await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 15_000 })
    })
  }
}
