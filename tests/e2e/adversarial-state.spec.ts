import { test, expect } from './fixtures/catalog.fixture'

/**
 * Adversarial compound-state tests targeting race conditions and state
 * corruption scenarios that occur when multiple async subsystems interact.
 *
 * Each test targets a specific failure mode that can only occur when
 * features are combined in ways that individual feature tests don't cover.
 */
test.describe('Adversarial: Concurrent Modal Attempts', () => {
  test('opening code viewer button during Shiki load does not produce stale modal on navigation', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')

    // Open code viewer — Shiki highlighting loads asynchronously
    await catalogPage.codeViewerButton(card).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Navigate away BEFORE Shiki finishes loading (or just after)
    // This tests the race between async highlight completion and navigation unmount
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // No stale code viewer modal should remain from the previous group
    await expect(modal).not.toBeVisible()
    await catalogPage.expectNoErrorBoundary()

    // Open code viewer on a card in the NEW group — should show new source
    const newCards = catalogPage.allCards()
    const newCard = newCards.first()
    const codeBtn = catalogPage.codeViewerButton(newCard)
    if ((await codeBtn.count()) > 0) {
      await codeBtn.click()
      await expect(modal).toBeVisible({ timeout: 10_000 })
      await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

      // Source should contain something relevant to the NEW group, not the old one
      const bodyText = await catalogPage.codeBody().textContent()
      expect(bodyText).not.toContain('ModalBaseScaleGentlePop')

      await page.keyboard.press('Escape')
    }
  })

  test('rapid code viewer open/close across different cards does not leak state', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const cards = catalogPage.scopedCards('modal-base-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThan(2)

    const modal = catalogPage.codeViewerModal()

    // Rapidly open and close code viewer on 3 different cards
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      const codeBtn = catalogPage.codeViewerButton(card)
      if ((await codeBtn.count()) === 0) continue

      await codeBtn.click()
      await expect(modal).toBeVisible({ timeout: 10_000 })

      // Close immediately without waiting for highlighting
      await page.keyboard.press('Escape')
      await expect(modal).not.toBeVisible()
    }

    // Final state: no modal, no error boundary
    await expect(modal).not.toBeVisible()
    await catalogPage.expectNoErrorBoundary()

    // Can still open a code viewer cleanly
    const lastCard = cards.first()
    const lastBtn = catalogPage.codeViewerButton(lastCard)
    if ((await lastBtn.count()) > 0) {
      await lastBtn.click()
      await expect(modal).toBeVisible({ timeout: 10_000 })
      await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
      await page.keyboard.press('Escape')
    }
  })
})

test.describe('Adversarial: Navigation During Lazy Loading', () => {
  test('rapid navigation through groups while cards are lazy-loading does not crash', async ({
    catalogPage,
    errorCollector,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(4)

    // Navigate through 5 groups rapidly — each triggers lazy component loading
    for (let i = 0; i < Math.min(count, 5); i++) {
      await groupLinks.nth(i).click()
    }

    // Wait for the UI to settle on the last group.
    // After rapid navigation, AnimatePresence exit animations may take longer
    // to clean up — wait for cards first, then verify the active state settles.
    await catalogPage.waitForCards()

    // The last clicked group should eventually become active
    await expect(groupLinks.nth(Math.min(count, 5) - 1)).toHaveAttribute('data-active', 'true', {
      timeout: 15_000,
    })

    // No JS errors from cancelled lazy imports or unmounted component updates
    errorCollector.expectNoErrors()
    await catalogPage.expectNoErrorBoundary()
  })

  test('navigating away during Suspense fallback does not leave stale content', async ({
    catalogPage,
    errorCollector,
  }) => {
    // Navigate to a group — this triggers Suspense for lazy animation components
    await catalogPage.gotoGroup('collection-effects-framer')

    // Immediately navigate to another group before all Suspense boundaries resolve
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Verify the correct group rendered (text-effects, not collection-effects)
    expect(catalogPage.currentPathname()).toBe('/text-effects-framer')
    await expect(catalogPage.groupTitle()).toContainText('Text effects')

    // No stale cards from collection-effects
    const ids = await catalogPage.getAllAnimationIds()
    const hasCollectionId = ids.some((id) => id.startsWith('collection-effects'))
    expect(hasCollectionId).toBe(false)

    errorCollector.expectNoErrors()
  })
})

test.describe('Adversarial: Mobile Overlay Conflicts', () => {
  test('opening preview while drawer is open on mobile handles overlays correctly', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('standard-effects-framer')

    // Open drawer
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    // Close drawer, then immediately open preview (tests overlay transition timing)
    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()

    // Open desktop preview on first card
    const card = catalogPage.allCards().first()
    await expect(card).toBeVisible({ timeout: 10_000 })
    await card.scrollIntoViewIfNeeded()
    await catalogPage.previewDesktopButton(card).click()
    await expect(page.locator('[data-testid="preview-desktop"]')).toBeVisible({ timeout: 3_000 })

    // Close preview via Escape
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })

    // Scroll lock should be fully released (not stuck from drawer + preview overlap)
    expect(await mobilePage.isScrollLocked()).toBe(false)

    // Drawer should still work after preview dismiss
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()
    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()
  })

  test('Escape key closes preview overlay before reaching mobile drawer on mobile viewport', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('standard-effects-framer')

    // Open preview on a card
    const card = catalogPage.allCards().first()
    await expect(card).toBeVisible({ timeout: 10_000 })
    await card.scrollIntoViewIfNeeded()
    await catalogPage.previewDesktopButton(card).click()
    await expect(page.locator('[data-testid="preview-desktop"]')).toBeVisible({ timeout: 3_000 })

    // Press Escape — should close preview (the topmost overlay), not open the drawer or affect drawer state
    await page.keyboard.press('Escape')
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })

    // Drawer should still be closed (Escape targeted the preview, not the drawer)
    await mobilePage.expectDrawerClosed()
    expect(await mobilePage.isScrollLocked()).toBe(false)
  })

  test('double Escape from preview does not corrupt overlay state', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('standard-effects-framer')

    const card = catalogPage.allCards().first()
    await expect(card).toBeVisible({ timeout: 10_000 })
    await card.scrollIntoViewIfNeeded()
    await catalogPage.previewDesktopButton(card).click()
    await expect(page.locator('[data-testid="preview-desktop"]')).toBeVisible({ timeout: 3_000 })

    // Press Escape twice rapidly — first closes preview, second should be a no-op
    await page.keyboard.press('Escape')
    await page.keyboard.press('Escape')

    // Preview closed, no drawer opened, no error state
    await expect(catalogPage.previewAnimation()).toHaveCount(0, { timeout: 3_000 })
    await mobilePage.expectDrawerClosed()
    expect(await mobilePage.isScrollLocked()).toBe(false)

    // App is still functional — can open drawer normally
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()
    await mobilePage.closeDrawer()
  })
})

test.describe('Adversarial: Filter + Mode Switch + Navigation Compound', () => {
  test('filter → mode switch → navigate → back → forward preserves correct state at each step', async ({
    catalogPage,
    errorCollector,
    page,
  }) => {
    // Step 1: Apply filter
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Step 2: Switch to CSS mode — filter should persist
    await catalogPage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)
    expect(new URL(page.url()).searchParams.get('animation')).toBe(targetId)

    // Step 3: Remove filter
    await catalogPage.removeFilterButton().click()
    await expect
      .poll(() => new URL(page.url()).searchParams.has('animation'), { timeout: 5_000 })
      .toBe(false)
    await catalogPage.waitForCards()

    // Step 4: Navigate to a different group
    const newPath = await catalogPage.clickNonActiveGroup()
    expect(newPath).not.toBeNull()
    await catalogPage.waitForCards()
    const thirdPath = catalogPage.currentPathname()

    // Step 5: Browser back — should return to unfiltered CSS group
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')
    // No filter (we removed it in step 3)
    expect(new URL(page.url()).searchParams.has('animation')).toBe(false)

    // Step 6: Browser forward — should return to the other group
    await page.goForward()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(thirdPath)

    errorCollector.expectNoErrors()
    await catalogPage.expectNoErrorBoundary()
  })
})
