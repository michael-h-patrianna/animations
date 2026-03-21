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
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(1)

    // Find a non-active group and click it
    for (let i = 0; i < count; i++) {
      const link = groupLinks.nth(i)
      const isActive = await link.getAttribute('data-active')
      if (!isActive) {
        await link.click()
        break
      }
    }

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
    await expect(groupLinks.nth(2)).toHaveAttribute('data-active', 'true')

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

    // All group links should be hidden
    expect(await catalogPage.allGroupLinks().count()).toBe(0)

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

    // Desktop sidebar should be visible
    await expect(catalogPage.sidebar).toBeVisible()
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

    // Find the active section and a non-active section
    let activeSection: import('@playwright/test').Locator | null = null
    let otherSection: import('@playwright/test').Locator | null = null

    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i)
      const categoryBtn = section.locator('[data-testid^="sidebar-category-"]')
      const isActive = await categoryBtn.getAttribute('data-active')
      if (isActive) {
        activeSection = section
      } else if (!otherSection) {
        otherSection = section
      }
    }

    expect(activeSection).not.toBeNull()
    expect(otherSection).not.toBeNull()
    if (!activeSection || !otherSection) return

    // Get a group link in the other section
    const otherGroupLinks = catalogPage.groupLinksInSection(otherSection)
    const otherGroupCount = await otherGroupLinks.count()
    expect(otherGroupCount).toBeGreaterThan(0)

    // Collapse the active section AND click a group in the other section rapidly
    const activeCategoryBtn = activeSection.locator('[data-testid^="sidebar-category-"]')
    const before = catalogPage.currentPathname()

    await activeCategoryBtn.click() // collapse
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

  test('scroll resets toward top when navigating to a new group', async ({ catalogPage, page }) => {
    // Navigate to a group with many cards
    await catalogPage.gotoGroup('progress-bars-framer')
    await catalogPage.waitForCards()

    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 800))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400)

    // Navigate to a different group
    const before = catalogPage.currentPathname()
    const groupLinks = catalogPage.allGroupLinks()
    for (let i = 0; i < (await groupLinks.count()); i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        break
      }
    }
    await catalogPage.waitForPathnameChange(before)
    await catalogPage.waitForCards()

    // Scroll should move toward the group section (near top, accounting for
    // app bar height and the useScrollToGroup's 360ms retry delay)
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
      .toBeLessThan(200)
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
    const firstCard = catalogPage.allCards().first()
    await expect(catalogPage.cardMeta(firstCard)).toContainText('FRAMER')
    await catalogPage.expectNoErrorBoundary()
  })

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
    const groupLinks = catalogPage.allGroupLinks()
    for (let i = 0; i < (await groupLinks.count()); i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        break
      }
    }
    await catalogPage.waitForCards()

    // Go back to previous group (CSS mode)
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-css')

    // The code mode switch should show CSS as active (not stale Framer state)
    const modeAfterBack = await catalogPage.activeCodeMode()
    expect(modeAfterBack.trim()).toBe('CSS')

    // Go back again to Framer mode
    await page.goBack()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/text-effects-framer')

    // Switch should reflect Framer mode
    const modeAfterSecondBack = await catalogPage.activeCodeMode()
    expect(modeAfterSecondBack.trim()).toBe('Framer')
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
    expect(await mobilePage.isScrollLocked()).toBe(true)

    // Programmatic navigation (simulates browser back or URL change)
    await page.goto('/standard-effects-framer')
    await expect(mobilePage.header).toBeVisible({ timeout: 10_000 })

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
})
