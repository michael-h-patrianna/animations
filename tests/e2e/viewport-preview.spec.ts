import { test, expect } from './fixtures/catalog.fixture'

/**
 * Viewport Preview: verifies preview lifecycle — open, close, mode switching,
 * replay, and basic geometry checks for desktop and mobile preview modes.
 *
 * Containment and positioning scans live in viewport-containment.spec.ts.
 */

// ── Lifecycle tests ────────────────────────────────────────────────────

test.describe('Viewport Preview', () => {
  test('desktop preview opens and closes via close button', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
  })

  test('mobile preview opens and shows phone frame', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openMobilePreview(card)
    await expect(catalogPage.previewMobileFrame()).toBeVisible()
    await expect(catalogPage.previewAnimation()).toBeVisible()

    await catalogPage.closePreview()
  })

  test('Escape key closes preview', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    await catalogPage.page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
  })

  test('backdrop click replays animation (does not close)', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const overlay = catalogPage.page.locator('[data-testid="preview-desktop"]')
    await expect(overlay).toBeVisible()

    // Click the overlay edge — should replay (not close)
    // PreviewModal uses replayOnSelf: clicks on own background trigger replay
    await overlay.click({ position: { x: 5, y: 80 } })

    // Preview stays open — animation is replayed, not dismissed
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Close via close button
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
  })

  // ── Mode switching ───────────────────────────────────────────────────

  test('mode switch toggles between desktop and mobile', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    // Start in desktop mode
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)

    // Switch to mobile
    await catalogPage.previewModeMobileButton().click()
    await expect(catalogPage.previewMobileFrame()).toBeVisible()

    // Switch back to desktop
    await catalogPage.previewModeDesktopButton().click()
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)

    await catalogPage.closePreview()
  })

  test('opening preview on a different card after closing works correctly', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const cards = catalogPage.scopedCards('modal-base-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThan(1)

    // Open preview on first card
    const firstCard = cards.first()
    await catalogPage.openDesktopPreview(firstCard)
    await expect(catalogPage.previewAnimation()).toBeVisible()
    await catalogPage.closePreview()

    // Open preview on second card — should work without stale state
    const secondCard = cards.nth(1)
    await secondCard.scrollIntoViewIfNeeded()
    await catalogPage.openDesktopPreview(secondCard)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Should render content (not blank from stale component ref)
    await expect
      .poll(async () => catalogPage.previewAnimation().locator(':scope > * > *').count(), {
        timeout: 3_000,
      })
      .toBeGreaterThan(0)

    await catalogPage.closePreview()
  })

  // ── Replay ───────────────────────────────────────────────────────────

  test('replay button remounts animation in preview', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    const childCount = await animation.locator(':scope > * > *').count()
    expect(childCount).toBeGreaterThan(0)

    await catalogPage.previewReplayButton().click()

    // Wait for animation to remount and be visible after replay
    await expect(animation).toBeVisible({ timeout: 3_000 })
    const childCountAfter = await animation.locator(':scope > * > *').count()
    expect(childCountAfter).toBeGreaterThan(0)

    await catalogPage.closePreview()
  })

  // ── Desktop centering ────────────────────────────────────────────────

  test('desktop preview centers animation content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    const animRect = await animation.boundingBox()
    expect(animRect).not.toBeNull()

    const viewport = catalogPage.page.viewportSize()
    expect(viewport).not.toBeNull()

    expect(animRect!.width).toBeGreaterThan(viewport!.width * 0.9)
    expect(animRect!.height).toBeGreaterThan(viewport!.height * 0.9)

    await catalogPage.closePreview()
  })

  // ── Mobile frame fits viewport ───────────────────────────────────────

  test('mobile phone frame fits within the viewport', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openMobilePreview(card)
    const frame = catalogPage.previewMobileFrame()
    await expect(frame).toBeVisible()

    const frameRect = await frame.boundingBox()
    expect(frameRect).not.toBeNull()

    const viewport = catalogPage.page.viewportSize()
    expect(viewport).not.toBeNull()

    expect(frameRect!.x).toBeGreaterThanOrEqual(-1)
    expect(frameRect!.y).toBeGreaterThanOrEqual(-1)
    expect(frameRect!.x + frameRect!.width).toBeLessThanOrEqual(viewport!.width + 1)
    expect(frameRect!.y + frameRect!.height).toBeLessThanOrEqual(viewport!.height + 1)

    await catalogPage.closePreview()
  })

  // ── All-card preview buttons exist ───────────────────────────────────

  test('every card has desktop and mobile preview buttons', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    // Use card-grid scoped selector to avoid matching internal data-animation-id
    // elements rendered by animation components inside cards
    const cards = catalogPage.page.locator('[data-testid="card-grid"] > [data-animation-id]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      await expect(catalogPage.previewDesktopButton(card)).toBeVisible()
      await expect(catalogPage.previewMobileButton(card)).toBeVisible()
    }
  })
})

// ── Preview from mobile viewport ─────────────────────────────────────────

test.describe('Viewport Preview: Mobile Viewport', () => {
  test('preview opens correctly when app is at mobile viewport width', async ({
    catalogPage,
    mobilePage,
  }) => {
    await mobilePage.gotoMobile('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    await expect(card).toBeVisible({ timeout: 10_000 })

    // Open desktop preview from mobile viewport
    await card.scrollIntoViewIfNeeded()
    await catalogPage.previewDesktopButton(card).click()
    await expect(catalogPage.page.locator('[data-testid="preview-desktop"]')).toBeVisible({
      timeout: 3_000,
    })
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Preview should have content
    await expect
      .poll(async () => catalogPage.previewAnimation().locator(':scope > * > *').count(), {
        timeout: 3_000,
      })
      .toBeGreaterThan(0)

    // Close via Escape
    await catalogPage.page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    // App is still functional
    await expect(card).toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })
})

// ── CSS Mode Preview ────────────────────────────────────────────────────

test.describe('Viewport Preview: CSS Mode', () => {
  test('desktop preview opens and renders from CSS-mode card', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-css')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    // Animation should have rendered content
    await expect
      .poll(async () => animation.locator(':scope > * > *').count(), { timeout: 3_000 })
      .toBeGreaterThan(0)

    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)
  })

  test('mobile preview opens and shows phone frame from CSS-mode card', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')
    const card = catalogPage.allCards().first()

    await catalogPage.openMobilePreview(card)
    await expect(catalogPage.previewMobileFrame()).toBeVisible()
    await expect(catalogPage.previewAnimation()).toBeVisible()

    await catalogPage.closePreview()
  })

  test('mode switch works within CSS-mode preview', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-css')
    const card = catalogPage.allCards().first()

    // Start in desktop mode
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)

    // Switch to mobile
    await catalogPage.previewModeMobileButton().click()
    await expect(catalogPage.previewMobileFrame()).toBeVisible()

    // Switch back to desktop
    await catalogPage.previewModeDesktopButton().click()
    await expect(catalogPage.previewMobileFrame()).toHaveCount(0)

    await catalogPage.closePreview()
  })

  test('replay in CSS-mode preview remounts animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-css')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const animation = catalogPage.previewAnimation()
    await expect(animation).toBeVisible()

    await catalogPage.previewReplayButton().click()

    // Animation should remain visible after replay
    await expect(animation).toBeVisible({ timeout: 3_000 })

    await catalogPage.closePreview()
  })
})
