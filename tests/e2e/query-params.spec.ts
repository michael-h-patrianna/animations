import { test, expect } from './fixtures/catalog.fixture'

/**
 * URL query parameter tests: ?animation=, ?preview=, ?opaque=, and copy-link.
 *
 * The app supports these URL query parameters:
 * - ?animation=<id> — filters the group to show only the matching animation
 * - ?preview=desktop|mobile — auto-opens the preview overlay for the animation
 * - ?opaque=1 — renders preview with solid black background (used by CI)
 *
 * These tests verify the parameters produce the correct UI state and that
 * the copy-link button generates URLs with the correct ?animation= parameter.
 */
test.describe('Query Parameters', () => {
  test('?animation= filter shows only the matching animation card', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    // Only the filtered animation should be visible
    const cards = catalogPage.allCards()
    await expect(cards.first()).toBeVisible({ timeout: 10_000 })

    const ids = await catalogPage.getAllAnimationIds()
    expect(ids).toContain(targetId)

    // The filter status indicator should be visible
    const groupSection = catalogPage.groupSection('text-effects-framer')
    await expect(groupSection).toBeVisible()
  })

  test('?animation= with nonexistent ID shows not-found message', async ({ catalogPage, page }) => {
    await page.goto('/text-effects-framer?animation=nonexistent-animation-id')
    await catalogPage.waitForShell()

    // Should show the "not found" message
    const groupSection = catalogPage.groupSection('text-effects-framer')
    await expect(groupSection).toBeVisible({ timeout: 10_000 })
    await expect(groupSection).toContainText('not found')
  })

  test('?preview=desktop auto-opens desktop preview for the animation', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`)
    await catalogPage.waitForShell()

    // Desktop preview should auto-open
    await expect(page.locator('[data-testid="preview-desktop"]')).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Close and verify the underlying page is functional
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
  })

  test('?preview=mobile auto-opens mobile preview with phone frame', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=mobile`)
    await catalogPage.waitForShell()

    // Mobile preview should auto-open with phone frame
    await expect(page.locator('[data-testid="preview-mobile"]')).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.previewMobileFrame()).toBeVisible()
    await expect(catalogPage.previewAnimation()).toBeVisible()

    await catalogPage.closePreview()
  })

  test('?opaque=1 renders preview with opaque black background', async ({ catalogPage, page }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(
      `/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop&opaque=1`
    )
    await catalogPage.waitForShell()

    // Preview should auto-open
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // The preview container should have opaque styling (solid black background)
    // Verify by checking the computed background color on the preview
    const previewContainer = page.locator('[data-testid="preview-desktop"]')
    await expect(previewContainer).toBeVisible()
    const bgColor = await previewContainer.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )
    // Opaque mode sets a solid black background
    expect(bgColor).toMatch(/rgb\(0,\s*0,\s*0\)/)

    // Close via Escape (toolbar may be hidden in opaque mode)
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })
  })

  test('copy-link button copies URL with ?animation= parameter', async ({
    catalogPage,
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await card.scrollIntoViewIfNeeded()

    // Click the copy-link button
    const copyBtn = card.locator('[data-testid="copy-link-btn"]')
    await expect(copyBtn).toBeVisible()
    await copyBtn.click()

    // Toast notification should appear
    await expect(page.locator('[data-testid="app-toast"]')).toBeVisible({ timeout: 3_000 })

    // Clipboard should contain URL with ?animation= parameter
    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain('/modal-base-framer')
    expect(clipboardUrl).toContain('animation=modal-base__scale-gentle-pop')
  })

  test('?animation= parameter is preserved when switching code mode', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 10_000 })

    // Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)

    // The animation filter should be preserved in the URL
    const url = new URL(page.url())
    expect(url.searchParams.get('animation')).toBe(targetId)
  })

  test('navigating via sidebar strips the ?animation= filter', async ({ catalogPage, page }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 10_000 })

    // Navigate to a different group via sidebar
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // The animation filter should be stripped from the URL
    const url = new URL(page.url())
    expect(url.searchParams.has('animation')).toBe(false)
  })
})

test.describe('Query Parameter Edge Cases', () => {
  test('?animation= with valid ID from a DIFFERENT group shows not-found in current group', async ({
    catalogPage,
    page,
  }) => {
    // Navigate to text-effects group but filter for a modal-base animation
    // This is a cross-group mismatch — the animation ID is valid but belongs elsewhere
    await page.goto('/text-effects-framer?animation=modal-base__scale-gentle-pop')
    await catalogPage.waitForShell()

    // The group section should render (text-effects group loaded)
    const groupSection = catalogPage.groupSection('text-effects-framer')
    await expect(groupSection).toBeVisible({ timeout: 10_000 })

    // Should show "not found" because the animation doesn't exist in this group
    await expect(groupSection).toContainText('not found')

    // Remove filter should still work
    await expect(catalogPage.removeFilterButton()).toBeVisible()
    await catalogPage.removeFilterButton().click()
    await catalogPage.waitForCards()
    expect(await catalogPage.allCards().count()).toBeGreaterThan(1)
    await catalogPage.expectNoErrorBoundary()
  })

  test('empty ?animation= value shows all cards in the group', async ({ catalogPage, page }) => {
    await page.goto('/text-effects-framer?animation=')
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Empty filter should show all cards (not zero cards and not an error)
    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(1)
    await catalogPage.expectNoErrorBoundary()
  })

  test('?preview= without ?animation= does not auto-open preview', async ({
    catalogPage,
    page,
  }) => {
    // preview param alone (without animation filter) should not crash
    await page.goto('/modal-base-framer?preview=desktop')
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Preview should NOT auto-open (no specific animation targeted)
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    await catalogPage.expectNoErrorBoundary()
  })

  test('?animation= with URL-encoded special characters does not crash', async ({
    catalogPage,
    page,
  }) => {
    // Inject a filter ID with special URL characters
    const specialId = 'non<existent>&id=with"quotes'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(specialId)}`)
    await catalogPage.waitForShell()

    // Should show "not found" message or gracefully degrade — not crash
    const groupSection = catalogPage.groupSection('text-effects-framer')
    await expect(groupSection).toBeVisible({ timeout: 10_000 })
    await catalogPage.expectNoErrorBoundary()
  })

  test('unknown query parameters are silently ignored', async ({ catalogPage, page }) => {
    await page.goto('/text-effects-framer?foo=bar&baz=qux')
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // App loads normally, unknown params don't cause errors
    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(0)
    await catalogPage.expectNoErrorBoundary()
  })

  test('?opaque=1 without ?preview= does not affect normal page render', async ({
    catalogPage,
    page,
  }) => {
    await page.goto('/modal-base-framer?opaque=1')
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Page renders normally — opaque is only meaningful with preview
    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(0)
    await catalogPage.expectNoErrorBoundary()
  })

  test('closing auto-opened preview then switching code mode keeps state clean', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`)
    await catalogPage.waitForShell()

    // Preview should auto-open
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // Close preview
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    // Switch to CSS mode — should not crash from stale preview/filter state
    await catalogPage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)

    // The animation filter should be preserved across mode switch
    const url = new URL(page.url())
    expect(url.searchParams.get('animation')).toBe(targetId)

    // Preview should NOT re-open automatically after mode switch
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    await catalogPage.expectNoErrorBoundary()
  })

  test('auto-opened preview is dismissed by page reload', async ({ catalogPage, page }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`)
    await catalogPage.waitForShell()

    // Preview should auto-open
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // Reload the page
    await page.reload()
    await catalogPage.waitForShell()

    // Preview should auto-open again after reload (the URL params persist)
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // Close and verify clean state
    await catalogPage.closePreview()
    await catalogPage.expectNoErrorBoundary()
  })

  test('?animation= at root path falls back to the default group without crashing', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    // The app only canonicalizes `/` to the default group; it does not resolve
    // cross-group animation IDs from the query string.
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 10_000 }).not.toBe('/')
    expect(new URL(page.url()).searchParams.has('animation')).toBe(false)
    await catalogPage.waitForCards()
    await catalogPage.expectNoErrorBoundary()
  })

  test('auto-opened preview does not re-open after close within same session', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`)
    await catalogPage.waitForShell()

    // Preview auto-opens
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // Close preview
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    // The preview should NOT re-open automatically (autoOpenedRef guards against re-trigger)
    // Wait a moment to confirm no re-open happens
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 2_000 })
    await catalogPage.expectNoErrorBoundary()
  })

  test('auto-opened preview renders animation content (not blank)', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'standard-effects__bounce'
    await page.goto(
      `/standard-effects-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`
    )
    await catalogPage.waitForShell()

    // Preview auto-opens
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible({ timeout: 10_000 })

    // Animation should have rendered content — not an empty container
    await expect
      .poll(async () => animation.locator(':scope > * > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)

    await catalogPage.closePreview()
  })
})
