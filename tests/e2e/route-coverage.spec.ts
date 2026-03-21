import { test, expect } from './fixtures/catalog.fixture'

/**
 * Route coverage: navigates to EVERY group in the catalog (both Framer and CSS
 * variants) and verifies it loads correctly with meaningful content.
 *
 * Each test verifies:
 * 1. No ErrorBoundary triggered
 * 2. At least one animation card rendered
 * 3. All card IDs are unique (no duplicate registrations)
 * 4. Card titles are non-empty (metadata properly configured)
 * 5. Correct technology tag (FRAMER/CSS) matches the route suffix
 * 6. Group title heading is visible and non-empty
 *
 * Uses separate test cases per group to isolate failures.
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
    const expectedTag = suffix === '-framer' ? 'FRAMER' : 'CSS'

    test(`route /${groupId} renders correct content`, async ({ catalogPage }) => {
      await catalogPage.page.goto(`/${groupId}`)
      await expect(catalogPage.sidebar).toBeVisible({ timeout: 15_000 })

      // No error boundary
      await catalogPage.expectNoErrorBoundary()

      // Wait for the specific group section to be visible. This avoids false
      // positives from AnimatePresence transitions where a departing group's
      // DOM momentarily coexists with the incoming group under heavy load.
      const groupSection = catalogPage.groupSection(groupId)
      await expect(groupSection).toBeVisible({ timeout: 15_000 })

      // Query card wrappers from the card-grid (direct children only) to avoid
      // counting data-animation-id from nested animation component roots.
      // Some animation components (e.g., prize-reveal) also set data-animation-id
      // on their internal root element — querying all [data-animation-id]
      // descendants would double-count those cards.
      const cardGrid = groupSection.locator('[data-testid="card-grid"]')
      await expect(cardGrid).toBeVisible({ timeout: 15_000 })
      const scopedCards = cardGrid.locator(':scope > [data-animation-id]')
      await expect(scopedCards.first()).toBeVisible({ timeout: 15_000 })

      // All card IDs within the grid are unique (catches duplicate registrations)
      const ids = await scopedCards.evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
      )
      expect(ids.length).toBeGreaterThan(0)
      expect(new Set(ids).size).toBe(ids.length)

      // First card has non-empty title (metadata is configured)
      const firstCard = scopedCards.first()
      const title = catalogPage.cardTitle(firstCard)
      const titleText = await title.textContent()
      expect(titleText?.trim().length).toBeGreaterThan(0)

      // First card shows the correct technology tag
      await expect(catalogPage.cardMeta(firstCard)).toContainText(expectedTag)

      // Group title heading is visible and non-empty
      const groupTitle = catalogPage.groupTitle()
      await expect(groupTitle).toBeVisible()
      const groupTitleText = await groupTitle.textContent()
      expect(groupTitleText?.trim().length).toBeGreaterThan(0)
    })
  }
}
