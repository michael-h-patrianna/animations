import { test, expect } from './fixtures/catalog.fixture'

test.describe('Edge Cases', () => {
  test('CSS mode persists when navigating between groups via sidebar', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    // Click a different group in the sidebar
    await catalogPage.clickNonActiveGroup()

    // The new route should end with -css (mode persists)
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
  })

  test('rapid group switching does not break the UI', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(2)

    // Click 3 groups rapidly without waiting for transitions
    await groupLinks.nth(0).click()
    await groupLinks.nth(1).click()
    await groupLinks.nth(2).click()

    // After rapid clicks, the UI should settle on the last clicked group
    // with the third group link active
    await expect
      .poll(() => groupLinks.nth(2).getAttribute('data-active'), { timeout: 5_000 })
      .toBe('true')

    // Content should be present (no crash)
    const pathname = catalogPage.currentPathname()
    expect(pathname).not.toBe('/')
    await catalogPage.waitForCards()
  })

  test('multiple replay clicks do not crash the animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()

    // Click replay 3 times rapidly
    await replay.click()
    await replay.click()
    await replay.click()

    // Card should still be functional after rapid replays
    const stage = card.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('page title includes Animation Showcase', async ({ catalogPage }) => {
    await catalogPage.goto()
    await expect(catalogPage.page).toHaveTitle(/Animation Showcase/)
  })

  test('collapsing all categories leaves sidebar navigable', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Collapse all categories
    const categoryBtns = catalogPage.categoryButtons()
    const count = await categoryBtns.count()
    expect(count).toBeGreaterThan(1)

    for (let i = 0; i < count; i++) {
      const btn = categoryBtns.nth(i)
      const isExpanded = await btn.getAttribute('aria-expanded')
      if (isExpanded === 'true') {
        await btn.click()
        await expect(btn).toHaveAttribute('aria-expanded', 'false')
      }
    }

    // All group links should be hidden (wait for collapse animations to complete)
    await expect.poll(async () => catalogPage.allGroupLinks().count(), { timeout: 5_000 }).toBe(0)

    // Expand first category — groups should reappear
    await categoryBtns.first().click()
    await expect(categoryBtns.first()).toHaveAttribute('aria-expanded', 'true')
    expect(await catalogPage.allGroupLinks().count()).toBeGreaterThan(0)

    // Can still navigate to a group by clicking the first visible group link
    const firstLink = catalogPage.allGroupLinks().first()
    await firstLink.click()

    // Verify navigation worked — either URL changed or we stayed on the same group
    // (clicking the already-active group is valid and should not crash)
    await catalogPage.waitForCards()
    const finalPath = catalogPage.currentPathname()
    expect(finalPath).not.toBe('/')
    await catalogPage.expectNoErrorBoundary()
  })

  test('deep linking to multiple group types renders correct content', async ({ catalogPage }) => {
    // Test deep links to diverse categories — catches routing bugs across the catalog
    const groups = [
      { id: 'modal-base-framer', expectedTitle: 'Base modal animations' },
      { id: 'progress-bars-css', expectedTitle: 'Progress bars' },
      { id: 'button-effects-framer', expectedTitle: 'Button effects' },
    ]

    for (const { id, expectedTitle } of groups) {
      await catalogPage.gotoGroup(id)

      await expect(catalogPage.groupSection(id)).toBeVisible()
      await expect(catalogPage.groupTitle()).toContainText(expectedTitle)

      const cards = catalogPage.allCards()
      expect(await cards.count()).toBeGreaterThan(0)

      // No error boundary
      await catalogPage.expectNoErrorBoundary()
    }
  })

  test('viewport resize from mobile to desktop preserves navigation state', async ({
    catalogPage,
    page,
  }) => {
    // Start at mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await catalogPage.gotoGroup('text-effects-framer')

    const pathname = catalogPage.currentPathname()

    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 720 })

    // URL should not change
    expect(catalogPage.currentPathname()).toBe(pathname)

    // Top bar should be visible (sidebar panel may or may not be open depending on store state)
    await expect(catalogPage.page.locator('[data-testid="top-bar"]')).toBeVisible()
    await catalogPage.waitForCards()

    // Resize back to mobile — content still present
    await page.setViewportSize({ width: 375, height: 667 })
    expect(catalogPage.currentPathname()).toBe(pathname)
    await catalogPage.waitForCards()
  })

  test('collapsing a category while navigating to a group in another category', async ({
    catalogPage,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const sections = catalogPage.sidebarSections()
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(1)

    // Find the section containing the active group and another section
    let activeSectionIndex = -1
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i)
      const activeInSection = section.locator('[data-testid^="sidebar-group-"][data-active]')
      if ((await activeInSection.count()) > 0) {
        activeSectionIndex = i
        break
      }
    }
    expect(activeSectionIndex).toBeGreaterThanOrEqual(0)

    const otherIndex = activeSectionIndex === 0 ? 1 : 0
    const otherSection = sections.nth(otherIndex)
    const otherGroupLinks = catalogPage.groupLinksInSection(otherSection)
    expect(await otherGroupLinks.count()).toBeGreaterThan(0)

    // Collapse the active section AND click a group in the other section rapidly
    const activeToggle = sections
      .nth(activeSectionIndex)
      .locator('[data-testid="control-group-toggle"]')
    const before = catalogPage.currentPathname()

    await activeToggle.click() // collapse
    await otherGroupLinks.first().click() // navigate

    // Wait for navigation to settle
    await catalogPage.waitForPathnameChange(before)
    await catalogPage.waitForCards()

    // App should be in a consistent state
    const finalPath = catalogPage.currentPathname()
    expect(finalPath).not.toBe('/')
    expect(finalPath).not.toBe(before)
    await catalogPage.expectNoErrorBoundary()
  })

  test('navigating to a new group renders the group section at the top of the content area', async ({
    catalogPage,
  }) => {
    // Navigate to first group
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    // Navigate to a different group via sidebar
    await catalogPage.ensureSidebarOpen()
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // The new group section should be visible in the viewport
    const groupId = catalogPage.currentPathname().slice(1)
    await expect(catalogPage.groupSection(groupId)).toBeVisible()

    // The group section should be near the top of the viewport
    const sectionTop = await catalogPage
      .groupSection(groupId)
      .evaluate((el) => el.getBoundingClientRect().top)
    // Allow generous threshold (top bar + any padding)
    expect(sectionTop).toBeLessThan(300)
  })

  test('rapid mode switching does not corrupt state', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Toggle mode 4 times rapidly
    await catalogPage.selectCssMode()
    await catalogPage.selectFramerMode()
    await catalogPage.selectCssMode()
    await catalogPage.selectFramerMode()

    // UI should settle on Framer mode
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)

    // Cards should be present and functional
    await catalogPage.waitForCards()
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('Framer')
    await catalogPage.expectNoErrorBoundary()
  })

  // Fixed: App.tsx useEffect syncs codeMode from currentGroupId on every URL change,
  // including browser back. Previously CodeModeContext was only set on explicit mode
  // switch clicks, causing stale state after history navigation.
  test('code mode switch button reflects correct state after browser back', async ({
    catalogPage,
    page,
  }) => {
    // Start in Framer mode
    await catalogPage.gotoGroup('text-effects-framer')
    const framerMode = await catalogPage.activeCodeMode()
    expect(framerMode.trim()).toBe('Framer')

    // Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    // Navigate to a different group (stays in CSS mode)
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // Go back to previous group (CSS mode)
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    // The code mode switch should show CSS as active (not stale Framer state)
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('CSS')

    // Go back again to Framer mode
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-framer')

    // Switch should reflect Framer mode
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('Framer')
  })

  test('active sidebar group highlights correctly after deep link reload', async ({
    catalogPage,
    page,
  }) => {
    // Deep link to a specific group
    await catalogPage.gotoGroup('progress-bars-framer')

    // Reload the page
    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // The active group link should match the current route
    const activeLink = catalogPage.activeGroupLink()
    await expect(activeLink).toBeVisible()
    const activeLinkText = (await activeLink.innerText()).trim()

    // Group title should match the active sidebar link
    const groupTitle = await catalogPage.groupTitle().textContent()
    expect(groupTitle?.trim().toLowerCase()).toContain(activeLinkText.toLowerCase())
  })

  test('navigating while drawer is open on mobile closes drawer properly', async ({
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Open drawer
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()
    expect(await mobilePage.isScrollLocked()).toBe(false)

    // Programmatic navigation (simulates browser back or URL change)
    await page.goto('/standard-effects-framer')
    await expect(mobilePage.topBar).toBeVisible({ timeout: 10_000 })

    // After full navigation, drawer state should be clean
    // (no stale open drawer from previous page)
    await mobilePage.expectDrawerClosed()
    expect(await mobilePage.isScrollLocked()).toBe(false)
  })

  test('opening code viewer on last card of a long group works correctly', async ({
    catalogPage,
  }) => {
    // Navigate to a group with many cards
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    const cards = catalogPage.allCards()
    const count = await cards.count()
    expect(count).toBeGreaterThan(5)

    // Scroll to and interact with the LAST card
    const lastCard = cards.nth(count - 1)
    await lastCard.scrollIntoViewIfNeeded()
    await expect(lastCard).toBeVisible()

    // Verify the last card has content rendered (not lazy-loaded placeholder)
    const stage = lastCard.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible({ timeout: 5_000 })

    // If it has a code viewer button, verify it works
    const codeBtn = catalogPage.codeViewerButton(lastCard)
    if ((await codeBtn.count()) > 0) {
      await codeBtn.click()
      const modal = catalogPage.codeViewerModal()
      await expect(modal).toBeVisible({ timeout: 10_000 })
      await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

      // Source should not be empty
      const bodyText = await catalogPage.codeBody().textContent()
      expect((bodyText ?? '').length).toBeGreaterThan(50)

      await catalogPage.codeCloseButton().click()
      await expect(modal).not.toBeVisible()
    }
  })

  test('clicking the already-active group link is a no-op (does not crash)', async ({
    catalogPage,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Find the active group link
    const activeLink = catalogPage.activeGroupLink()
    await expect(activeLink).toBeVisible()

    const pathBefore = catalogPage.currentPathname()

    // Click it again
    await activeLink.click()

    // URL should not change — no error, no navigation
    expect(catalogPage.currentPathname()).toBe(pathBefore)
    await catalogPage.waitForCards()

    // Active link should still be active
    await expect(activeLink).toHaveAttribute('data-active', 'true')
    await catalogPage.expectNoErrorBoundary()
  })

  test('description toggle still works after browser back navigation', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const description = catalogPage.cardDescription(card)
    const toggle = catalogPage.descriptionToggle(card)

    // Expand description
    await toggle.click()
    await expect(description).toHaveAttribute('data-expanded', 'true')

    // Navigate to a different group
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Navigate back
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-framer')
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // History navigation should not corrupt the description toggle, regardless
    // of whether the browser restores the expanded UI state.
    const cardAfterBack = catalogPage.card('text-effects__character-reveal')
    const descriptionAfterBack = catalogPage.cardDescription(cardAfterBack)
    const wasExpanded = (await descriptionAfterBack.getAttribute('data-expanded')) === 'true'

    // Can still toggle it
    const toggleAfterBack = catalogPage.descriptionToggle(cardAfterBack)
    await toggleAfterBack.click()
    if (wasExpanded) {
      await expect(descriptionAfterBack).not.toHaveAttribute('data-expanded')
    } else {
      await expect(descriptionAfterBack).toHaveAttribute('data-expanded', 'true')
    }
  })

  test('filter + preview: opening preview on filtered card works correctly', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    // Filter is active
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Open preview on the filtered card
    const card = catalogPage.card(targetId)
    await expect(card).toBeVisible({ timeout: 10_000 })
    await catalogPage.openDesktopPreview(card)
    await expect(catalogPage.previewAnimation()).toBeVisible()

    // Close preview
    await catalogPage.closePreview()
    await expect(catalogPage.previewAnimation()).toHaveCount(0)

    // Filter should still be active after preview close
    await expect(catalogPage.filterBanner()).toBeVisible()
    expect(new URL(page.url()).searchParams.get('animation')).toBe(targetId)
    await catalogPage.expectNoErrorBoundary()
  })

  test('double mode switch + navigate does not leave stale cards', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Switch to CSS, then immediately to Framer, then navigate
    await catalogPage.selectCssMode()
    await catalogPage.selectFramerMode()

    await catalogPage.clickNonActiveGroup()

    // Wait for the UI to settle
    await catalogPage.waitForCards()
    await catalogPage.waitForTransitionSettle()

    // Verify: no duplicate card IDs (catches stale cards from interrupted transitions)
    const ids = await catalogPage.page
      .locator(
        '[data-testid^="group-section-group-"]:visible [data-testid="card-grid"] > [data-animation-id]'
      )
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean))
    expect(ids.length).toBeGreaterThan(0)
    // AnimatePresence should have cleaned up exit animations
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
    await catalogPage.expectNoErrorBoundary()
  })

  test('page reload while code viewer is open results in clean state', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    // Open code viewer
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Reload the page
    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Code viewer should not be open after reload (no state persistence)
    await expect(modal).not.toBeVisible()

    // Page should be functional
    expect(catalogPage.currentPathname()).toBe('/modal-base-framer')
    await catalogPage.expectNoErrorBoundary()
  })

  test('browser back navigation scrolls to top of new group section', async ({
    catalogPage,
    page,
  }) => {
    // Navigate to a group with many cards
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    // Scroll to the last card
    const cards = catalogPage.allCards()
    const totalCards = await cards.count()
    expect(totalCards).toBeGreaterThan(5)
    await cards.nth(totalCards - 1).scrollIntoViewIfNeeded()

    // Navigate to a different group
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.waitForCards()

    // The new group section should be visible near the top
    const groupId = catalogPage.currentPathname().slice(1)
    const sectionTop = await catalogPage
      .groupSection(groupId)
      .evaluate((el) => el.getBoundingClientRect().top)
    expect(sectionTop).toBeLessThan(300)

    // Go back
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/progress-bars-framer')
    await catalogPage.waitForCards()

    // The group section should be visible (not stuck at bottom from previous scroll)
    const backGroupSection = catalogPage.groupSection('progress-bars-framer')
    await expect(backGroupSection).toBeVisible()
  })
})
