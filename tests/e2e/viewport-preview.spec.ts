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

  test('backdrop click closes preview', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
    const card = catalogPage.allCards().first()

    await catalogPage.openDesktopPreview(card)
    const overlay = catalogPage.page.locator('[data-testid="preview-desktop"]')
    await expect(overlay).toBeVisible()

    // Click the overlay edge (top-left corner, avoiding toolbar/animation)
    await overlay.click({ position: { x: 5, y: 80 } })
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
    await catalogPage.page.waitForTimeout(100)

    await expect(animation).toBeVisible()
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
    const cards = catalogPage.allCards()
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
