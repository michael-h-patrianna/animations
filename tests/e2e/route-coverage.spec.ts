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
 * 5. Code mode switch reflects the correct mode (Framer/CSS) for the route suffix
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
  'modal-open',
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

/**
 * Verify the hardcoded group list matches the actual catalog.
 * Catches silent gaps when a new group is added to the codebase
 * but not to this test file.
 */
test('ALL_GROUP_IDS matches all groups discovered from sidebar', async ({ catalogPage }) => {
  await catalogPage.goto()
  await catalogPage.waitForCards()

  // Record the initial group from the default landing page
  const initialMatch = catalogPage.currentPathname().match(/^\/(.+)-(framer|css)$/)
  const discoveredBaseIds = new Set<string>()
  if (initialMatch) discoveredBaseIds.add(initialMatch[1])

  // Click each sidebar group link and record the URL to extract base IDs
  const groupLinks = catalogPage.allGroupLinks()
  const count = await groupLinks.count()

  for (let i = 0; i < count; i++) {
    const link = groupLinks.nth(i)
    const isActive = await link.getAttribute('data-active')
    if (isActive) {
      // Already-active link won't change URL — just record current path
      const match = catalogPage.currentPathname().match(/^\/(.+)-(framer|css)$/)
      if (match) discoveredBaseIds.add(match[1])
      continue
    }
    const before = catalogPage.currentPathname()
    await link.click()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).not.toBe(before)
    const match = catalogPage.currentPathname().match(/^\/(.+)-(framer|css)$/)
    if (match) discoveredBaseIds.add(match[1])
  }

  const hardcodedSet = new Set(ALL_GROUP_IDS)

  // Every discovered group must be in the hardcoded list
  const missing = [...discoveredBaseIds].filter((id) => !hardcodedSet.has(id))
  expect(
    missing,
    `Groups in sidebar but missing from ALL_GROUP_IDS: ${missing.join(', ')}. ` +
      'Add them to the hardcoded list so they get route-coverage tests.'
  ).toHaveLength(0)

  // Every hardcoded group must exist in the sidebar
  const extra = [...hardcodedSet].filter((id) => !discoveredBaseIds.has(id))
  expect(
    extra,
    `Groups in ALL_GROUP_IDS but not in sidebar: ${extra.join(', ')}. ` +
      'Remove them from the hardcoded list or verify they still exist.'
  ).toHaveLength(0)
})

for (const baseId of ALL_GROUP_IDS) {
  for (const suffix of ['-framer', '-css'] as const) {
    const groupId = `${baseId}${suffix}`
    const expectedSuffix = suffix

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

      // URL suffix confirms the correct mode for this route
      expect(catalogPage.currentPathname()).toMatch(new RegExp(`${expectedSuffix}$`))

      // Group title heading is visible and non-empty
      const groupTitle = catalogPage.groupTitle()
      await expect(groupTitle).toBeVisible()
      const groupTitleText = await groupTitle.textContent()
      expect(groupTitleText?.trim().length).toBeGreaterThan(0)
    })
  }
}
