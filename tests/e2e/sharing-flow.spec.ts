import { test, expect } from './fixtures/catalog.fixture'

/**
 * End-to-end sharing flow tests: verify the complete user journey of
 * sharing an animation link, including deep-link with preview, and
 * browser history behavior after following a shared link.
 *
 * Bug this catches: shared URLs that include both ?animation= and ?preview=
 * params fail to load the correct animation in the correct preview mode,
 * or browser back from a shared URL leads to a broken state.
 */
test.describe('Sharing Flow: Copy Link + Preview Round Trip', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  })

  test('copy link URL + manual preview param produces working deep link', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const targetId = 'standard-effects__bounce'
    const card = catalogPage.card(targetId)
    await catalogPage.copyLinkButton(card).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain(`animation=${targetId}`)

    // Simulate a user appending ?preview=desktop to the shared URL
    const parsed = new URL(clipboardUrl)
    parsed.searchParams.set('preview', 'desktop')

    // Navigate to the modified URL
    await page.goto(`${parsed.pathname}?${parsed.searchParams.toString()}`)
    await catalogPage.waitForShell()

    // Both filter and preview should be active
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // Animation content renders in preview
    const animation = catalogPage.previewAnimation()
    await expect
      .poll(async () => animation.locator(':scope > * > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)

    // Close preview — filter should remain
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    await expect(catalogPage.filterBanner()).toBeVisible()

    // The filtered card should be visible
    await expect(catalogPage.card(targetId)).toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })

  test('browser back from shared deep link with preview returns to previous page', async ({
    catalogPage,
    page,
  }) => {
    // Start on a known group (creates history entry)
    await catalogPage.gotoGroup('text-effects-framer')
    const firstPath = catalogPage.currentPathname()

    // Navigate to a shared link with filter + preview
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`)
    await catalogPage.waitForShell()
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 10_000 })

    // Close the auto-opened preview
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    // Browser back — should return to the original group
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 10_000 }).toBe(firstPath)

    // Original group should render correctly
    await catalogPage.waitForCards()
    await expect(catalogPage.groupSection('text-effects-framer')).toBeVisible()

    // No filter should be active on the original group
    expect(new URL(page.url()).searchParams.has('animation')).toBe(false)
    await catalogPage.expectNoErrorBoundary()
  })

  test('copy link from CSS mode, navigate to URL, verify CSS mode preserved', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('progress-bars-css')

    const targetId = 'progress-bars__timeline-progress'
    const card = catalogPage.card(targetId)
    await card.scrollIntoViewIfNeeded()
    await catalogPage.copyLinkButton(card).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())

    // Navigate away first
    await catalogPage.gotoGroup('text-effects-framer')

    // Navigate to the copied URL
    const parsed = new URL(clipboardUrl)
    await page.goto(`${parsed.pathname}${parsed.search}`)
    await catalogPage.waitForShell()

    // Should be in CSS mode (URL ends with -css)
    expect(new URL(page.url()).pathname).toMatch(/-css$/)

    // Filter should be active
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.card(targetId)).toBeVisible({ timeout: 10_000 })

    // Code mode switch should reflect CSS
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('CSS')
  })
})
