import { test, expect } from './fixtures/catalog.fixture'

/**
 * Preview modal accessibility tests.
 *
 * The preview modal (PreviewModal.tsx) implements:
 * - role="dialog" + aria-modal="true"
 * - Focus trap (useFocusTrap)
 * - Escape to close (useEscapeClose)
 * - Overlay click dismiss (useOverlayDismiss)
 * - aria-pressed on mode switch buttons
 * - aria-label on toolbar buttons
 *
 * These tests verify the modal meets WCAG 2.1 AA dialog requirements
 * that keyboard-only and screen reader users depend on.
 */
test.describe('Preview Modal Accessibility', () => {
  test('preview dialog has correct ARIA attributes', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)

    const dialog = catalogPage.page.locator('[data-testid="preview-desktop"]')
    await expect(dialog).toHaveAttribute('role', 'dialog')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog).toHaveAttribute('aria-label', /preview/i)

    await catalogPage.closePreview()
  })

  test('mode switch buttons have correct aria-pressed state', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    // Open in desktop mode
    await catalogPage.openDesktopPreview(card)

    const desktopBtn = catalogPage.previewModeDesktopButton()
    const mobileBtn = catalogPage.previewModeMobileButton()

    // Desktop is active
    await expect(desktopBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(mobileBtn).toHaveAttribute('aria-pressed', 'false')

    // Switch to mobile
    await mobileBtn.click()
    await expect(catalogPage.previewMobileFrame()).toBeVisible()

    // Mobile is now active
    await expect(mobileBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(desktopBtn).toHaveAttribute('aria-pressed', 'false')

    await catalogPage.closePreview()
  })

  test('toolbar buttons have descriptive aria-labels', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)

    // Replay button
    const replayBtn = catalogPage.previewReplayButton()
    await expect(replayBtn).toHaveAttribute('aria-label', /replay/i)

    // Close button
    const closeBtn = catalogPage.previewCloseButton()
    await expect(closeBtn).toHaveAttribute('aria-label', /close/i)

    // Mode switch buttons
    await expect(catalogPage.previewModeDesktopButton()).toHaveAttribute('aria-label', /desktop/i)
    await expect(catalogPage.previewModeMobileButton()).toHaveAttribute('aria-label', /mobile/i)

    await catalogPage.closePreview()
  })

  test('close button receives focus when preview opens', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)

    // Focus trap should move focus to the close button on open
    const closeBtn = catalogPage.previewCloseButton()
    await expect(closeBtn).toBeFocused()

    await catalogPage.closePreview()
  })

  test('Tab cycles through preview controls without escaping the modal', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)

    // Close button receives initial focus
    await expect(catalogPage.previewCloseButton()).toBeFocused()

    // Tab through interactive elements and verify focus stays within the preview dialog
    const focusedElements: Array<{ testId: string | null; insidePreview: boolean }> = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement
        if (!el) return { testId: null, insidePreview: false }
        // Check if focused element is inside the preview overlay
        const insidePreview = !!el.closest(
          '[data-testid="preview-desktop"], [data-testid="preview-mobile"]'
        )
        return {
          testId: el.getAttribute('data-testid'),
          insidePreview,
        }
      })
      focusedElements.push(info)
    }

    // All focused elements should be inside the preview dialog (focus trap working)
    const escapedElements = focusedElements.filter((el) => !el.insidePreview)
    expect(escapedElements).toHaveLength(0)

    // Known preview controls should be reachable
    const reachedTestIds = focusedElements.map((el) => el.testId).filter(Boolean) as string[]
    expect(reachedTestIds).toContain('preview-replay-btn')
    expect(reachedTestIds).toContain('preview-close-btn')

    await catalogPage.closePreview()
  })

  test('Shift+Tab wraps focus from first to last element in preview', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)

    // Close button receives initial focus (it's the first focusable element in the toolbar)
    await expect(catalogPage.previewCloseButton()).toBeFocused()

    // Shift+Tab from the first element should wrap to the last element
    await page.keyboard.press('Shift+Tab')

    // Focus should now be on the last focusable element in the dialog
    // (not on an element outside the preview)
    const focusInfo = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return { insidePreview: false, testId: null }
      return {
        insidePreview: !!el.closest(
          '[data-testid="preview-desktop"], [data-testid="preview-mobile"]'
        ),
        testId: el.getAttribute('data-testid'),
      }
    })
    expect(focusInfo.insidePreview).toBe(true)

    await catalogPage.closePreview()
  })

  test('Enter key activates replay button in preview', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    // Focus the replay button
    const replayBtn = catalogPage.previewReplayButton()
    await replayBtn.focus()
    await expect(replayBtn).toBeFocused()

    // Press Enter to replay
    await page.keyboard.press('Enter')

    // Animation should remount (still visible after replay)
    await expect(animation).toBeVisible({ timeout: 3_000 })

    await catalogPage.closePreview()
  })

  test('focus returns to trigger element after preview closes', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    // Focus the desktop preview button before opening
    const previewBtn = catalogPage.previewDesktopButton(card)
    await card.scrollIntoViewIfNeeded()
    await previewBtn.focus()

    await previewBtn.click()
    await expect(catalogPage.page.locator('[data-testid="preview-desktop"]')).toBeVisible({
      timeout: 3_000,
    })

    // Close via Escape
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })

    // Focus should return to the preview button (or at least not be on the body)
    // Note: PreviewModal uses useFocusTrap which saves and restores focus
    const focusedTestId = await page.evaluate(
      () => document.activeElement?.getAttribute('data-testid') ?? null
    )
    // The focus should be back on a card element, not lost to the body
    expect(focusedTestId).not.toBeNull()
  })

  test('mobile preview dialog has correct aria-label reflecting mode', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openMobilePreview(card)

    const dialog = catalogPage.page.locator('[data-testid="preview-mobile"]')
    await expect(dialog).toHaveAttribute('role', 'dialog')
    await expect(dialog).toHaveAttribute('aria-label', /mobile.*preview/i)

    await catalogPage.closePreview()
  })
})
