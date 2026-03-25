import { test, expect } from './fixtures/catalog.fixture'

/**
 * Advanced preview interactions that test compound state transitions.
 *
 * These cover gaps between the basic preview lifecycle tests and the
 * query-params auto-open tests:
 * - Mode switching within auto-opened previews
 * - Preview after code viewer interaction
 * - Preview interaction on mobile after drawer navigation
 * - Preview across code mode switches
 */
test.describe('Preview Advanced Interactions', () => {
  test('auto-opened desktop preview supports switching to mobile mode', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}&preview=desktop`)
    await catalogPage.waitForShell()

    // Preview auto-opens in desktop mode
    await expect(catalogPage.page.locator('[data-testid="preview-desktop"]')).toBeVisible({
      timeout: 10_000,
    })
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)

    // Switch to mobile mode
    await catalogPage.previewModeMobileButton().click()
    await expect(catalogPage.previewMobileFrame()).toBeVisible()

    // Animation content still renders in mobile frame
    await expect(catalogPage.previewAnimation()).toBeVisible()
    await expect
      .poll(async () => catalogPage.previewAnimation().locator('*').count(), { timeout: 3_000 })
      .toBeGreaterThan(0)

    // Switch back to desktop
    await catalogPage.previewModeDesktopButton().click()
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)

    // Close cleanly
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    await catalogPage.expectNoErrorBoundary()
  })

  test('auto-opened mobile preview supports replay', async ({ catalogPage, page }) => {
    const targetId = 'standard-effects__bounce'
    await page.goto(
      `/standard-effects-framer?animation=${encodeURIComponent(targetId)}&preview=mobile`
    )
    await catalogPage.waitForShell()

    // Preview auto-opens in mobile mode
    await expect(catalogPage.previewMobileFrame()).toBeVisible({ timeout: 10_000 })
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    // Replay within auto-opened preview
    await catalogPage.previewReplayButton().click()
    await expect(animation).toBeVisible({ timeout: 3_000 })

    await catalogPage.closePreview()
    await catalogPage.expectNoErrorBoundary()
  })

  test('opening preview on mobile viewport after drawer navigation works', async ({
    catalogPage,
    mobilePage,
  }) => {
    await mobilePage.gotoMobile('standard-effects-framer')

    // Navigate to a different group via drawer
    await mobilePage.openDrawer()
    await mobilePage.clickDrawerGroup(1)
    await mobilePage.expectDrawerOpen()
    await mobilePage.closeDrawer()

    // Wait for cards to load in the new group
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 10_000 })

    // Open desktop preview on a card in the new group
    const card = catalogPage.allCards().first()
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Close and verify no stale state
    await catalogPage.page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })
    await catalogPage.expectNoErrorBoundary()
  })

  test('preview opened after code mode switch shows content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    // Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Get a fresh card reference after transition settles
    const card = catalogPage.allCards().first()
    await expect(card).toBeVisible({ timeout: 5_000 })
    await catalogPage.openDesktopPreview(card)

    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    // Animation should have rendered content (not blank from stale component ref)
    await expect
      .poll(async () => animation.locator(':scope > * > *').count(), { timeout: 3_000 })
      .toBeGreaterThan(0)

    await catalogPage.closePreview()
    await catalogPage.expectNoErrorBoundary()
  })

  test('code viewer then preview then code viewer shows correct source each time', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.card('modal-base__scale-gentle-pop')

    // Step 1: Open code viewer, verify source
    await catalogPage.codeViewerButton(card).click()
    const codeModal = catalogPage.codeViewerModal()
    await expect(codeModal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
    const source1 = await catalogPage.codeBody().textContent()
    expect(source1).toContain('ModalBaseScaleGentlePop')
    await page.keyboard.press('Escape')
    await expect(codeModal).not.toBeVisible()

    // Step 2: Open preview, interact, close
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()
    await catalogPage.previewReplayButton().click()
    await expect(catalogPage.previewAnimation()).toBeVisible({ timeout: 3_000 })
    await catalogPage.closePreview()

    // Step 3: Re-open code viewer — source must still be correct (not corrupted by preview state)
    await catalogPage.codeViewerButton(card).click()
    await expect(codeModal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
    const source2 = await catalogPage.codeBody().textContent()
    expect(source2).toContain('ModalBaseScaleGentlePop')
    expect(source2).toBe(source1)

    await page.keyboard.press('Escape')
    await catalogPage.expectNoErrorBoundary()
  })

  test('preview mode switch then navigate away does not leave stale overlay', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    const card = catalogPage.allCards().first()

    // Open desktop preview, switch to mobile, then navigate away
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Switch to mobile mode within preview
    await catalogPage.previewModeMobileButton().click()
    await expect(catalogPage.previewMobileFrame()).toBeVisible()

    // Close preview then navigate to a different group
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.waitForCards()

    // No stale preview overlay on the new page
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    // No stale mobile frame elements
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)
    await catalogPage.expectNoErrorBoundary()
  })
})
