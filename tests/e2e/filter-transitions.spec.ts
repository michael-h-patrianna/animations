import { test, expect } from './fixtures/catalog.fixture'

/**
 * Filter banner state transition tests: verify correct behavior when
 * transitioning between different filter states within a single session.
 *
 * Bug this catches: filter banner shows stale text from a previous filter,
 * or the "not found" state persists after applying a valid filter, or
 * removing the filter doesn't fully clear the query parameter.
 */
test.describe('Filter State Transitions', () => {
  test('transitioning from valid filter to invalid filter updates banner text', async ({
    catalogPage,
    page,
  }) => {
    // Start with a valid filter
    const validId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(validId)}`)
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText(validId)
    // Should NOT contain "not found" for a valid filter
    await expect(banner).not.toContainText('not found')

    // Navigate to an invalid filter on the same group
    await page.goto('/text-effects-framer?animation=nonexistent-invalid-id')
    await catalogPage.waitForShell()

    // Banner should update to show "not found"
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText('not found')
    await expect(banner).toContainText('nonexistent-invalid-id')
  })

  test('transitioning from invalid filter to valid filter shows the correct card', async ({
    catalogPage,
    page,
  }) => {
    // Start with an invalid filter
    await page.goto('/text-effects-framer?animation=does-not-exist')
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText('not found')

    // Navigate to a valid filter
    const validId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(validId)}`)
    await catalogPage.waitForShell()

    // Banner should show the valid filter (not "not found")
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText(validId)
    await expect(banner).not.toContainText('not found')

    // The filtered card should be visible
    await expect(catalogPage.card(validId)).toBeVisible({ timeout: 10_000 })
  })

  test('removing filter then re-applying via URL shows correct state each time', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'text-effects__typewriter'

    // Apply filter
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Remove filter via button
    await catalogPage.removeFilterButton().click()
    await expect
      .poll(() => new URL(page.url()).searchParams.has('animation'), { timeout: 5_000 })
      .toBe(false)
    await expect(catalogPage.filterBanner()).toHaveCount(0)

    // Count all cards (unfiltered)
    await catalogPage.waitForCards()
    const allCardCount = await catalogPage.allCards().count()
    expect(allCardCount).toBeGreaterThan(1)

    // Re-apply the same filter via URL
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    // Banner should reappear with correct text
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.filterBanner()).toContainText(targetId)

    // Only the filtered card should be visible
    await expect(catalogPage.card(targetId)).toBeVisible({ timeout: 10_000 })
    await catalogPage.expectNoErrorBoundary()
  })

  test('filter persists correctly through mode switch then removal', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'standard-effects__bounce'

    // Apply filter in Framer mode
    await page.goto(`/standard-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Switch to CSS mode — filter should persist
    await catalogPage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)
    expect(new URL(page.url()).searchParams.get('animation')).toBe(targetId)
    await expect(catalogPage.filterBanner()).toBeVisible()
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Remove filter in CSS mode
    await catalogPage.removeFilterButton().click()
    await expect
      .poll(() => new URL(page.url()).searchParams.has('animation'), { timeout: 5_000 })
      .toBe(false)

    // All CSS cards should be visible
    await catalogPage.waitForCards()
    expect(await catalogPage.allCards().count()).toBeGreaterThan(1)

    // URL should still be in CSS mode after filter removal
    expect(new URL(page.url()).pathname).toMatch(/-css$/)
    await catalogPage.expectNoErrorBoundary()
  })

  test('code viewer Escape from filtered view does not remove filter', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Open code viewer on the filtered card
    const card = catalogPage.card(targetId)
    await expect(card).toBeVisible({ timeout: 10_000 })
    await catalogPage.codeViewerButton(card).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Press Escape — should close code viewer, NOT remove the filter
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Filter should still be active
    await expect(catalogPage.filterBanner()).toBeVisible()
    expect(new URL(page.url()).searchParams.get('animation')).toBe(targetId)
    await catalogPage.expectNoErrorBoundary()
  })
})
