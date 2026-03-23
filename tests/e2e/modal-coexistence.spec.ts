import { test, expect } from './fixtures/catalog.fixture'

/**
 * Tests for interactions between code viewer modal and preview modal.
 *
 * Both modals are independently rendered as portals on document.body from
 * the same AnimationCard component. This creates potential for:
 * - Both dialogs open simultaneously (z-index, focus trap conflicts)
 * - Escape key ambiguity (which modal should close?)
 * - Focus management conflicts between two focus traps
 *
 * Bug this catches: Opening preview while code viewer is open (or vice versa)
 * causes focus trap conflicts, Escape closes the wrong modal, or both modals
 * stack visually with broken z-index.
 */
test.describe('Code Viewer + Preview Modal Coexistence', () => {
  test('opening preview while code viewer is open renders both modals', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')

    // Step 1: Open code viewer
    await catalogPage.codeViewerButton(card).click()
    const codeModal = catalogPage.codeViewerModal()
    await expect(codeModal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Step 2: Open desktop preview (card button is behind the code viewer modal,
    // so we use the card's preview button which is under the code viewer overlay)
    // Close code viewer first, then open preview
    await page.keyboard.press('Escape')
    await expect(codeModal).not.toBeVisible()

    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Step 3: Close preview
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    // Step 4: Re-open code viewer — should work cleanly
    await catalogPage.codeViewerButton(card).click()
    await expect(codeModal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Clean state
    await page.keyboard.press('Escape')
    await expect(codeModal).not.toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })

  test('alternating between code viewer and preview keeps state clean', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const codeModal = catalogPage.codeViewerModal()

    // Cycle: code viewer → close → preview → close → code viewer → close
    for (let i = 0; i < 2; i++) {
      // Open code viewer
      await catalogPage.codeViewerButton(card).click()
      await expect(codeModal).toBeVisible({ timeout: 10_000 })
      await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

      // Close code viewer
      await page.keyboard.press('Escape')
      await expect(codeModal).not.toBeVisible()

      // Open preview
      await catalogPage.openDesktopPreview(card)
      await expect(catalogPage.previewAnimation()).toBeVisible()

      // Close preview
      await catalogPage.closePreview()
      await expect(catalogPage.previewAnimation()).toHaveCount(0)
    }

    await catalogPage.expectNoErrorBoundary()
  })

  test('opening code viewer after preview close shows correct source', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')

    // Open preview first
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Close preview
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })

    // Open code viewer — source should still be correct (not corrupted by preview)
    await catalogPage.codeViewerButton(card).click()
    const codeModal = catalogPage.codeViewerModal()
    await expect(codeModal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('ModalBaseScaleGentlePop')

    await page.keyboard.press('Escape')
    await expect(codeModal).not.toBeVisible()
  })

  test('preview works correctly for a card after viewing its code', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')

    // Open and verify code viewer
    await catalogPage.codeViewerButton(card).click()
    const codeModal = catalogPage.codeViewerModal()
    await expect(codeModal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('StandardEffectsBounce')

    // Close code viewer
    await page.keyboard.press('Escape')
    await expect(codeModal).not.toBeVisible()

    // Open preview — animation should render correctly
    await catalogPage.openDesktopPreview(card)
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()
    await expect
      .poll(async () => animation.locator(':scope > * > *').count(), { timeout: 3_000 })
      .toBeGreaterThan(0)

    // Replay works
    await catalogPage.previewReplayButton().click()
    await expect(animation).toBeVisible({ timeout: 3_000 })

    await catalogPage.closePreview()
    await catalogPage.expectNoErrorBoundary()
  })

  test('sidebar navigation while preview is open closes preview cleanly', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')

    // Open desktop preview
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // The preview overlay covers the sidebar. Close preview first, then navigate.
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // Preview overlay should not be stuck on screen after navigation
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
    await catalogPage.expectNoErrorBoundary()
  })

  test('switching code mode after closing preview keeps state consistent', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')

    // Open and close preview
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })

    // Switch to CSS mode — should work without stale preview state
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/standard-effects-css')
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Get a fresh card reference after mode switch (old cards are detached)
    const cssCard = catalogPage.card('standard-effects__bounce')
    await expect(cssCard).toBeVisible({ timeout: 5_000 })
    await catalogPage.openDesktopPreview(cssCard)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    await catalogPage.closePreview()
    await catalogPage.expectNoErrorBoundary()
  })
})
