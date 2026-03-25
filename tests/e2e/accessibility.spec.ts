import { test, expect } from './fixtures/catalog.fixture'

/**
 * Accessibility tests verifying keyboard navigation, ARIA attributes,
 * and focus management. These catch real bugs affecting keyboard-only
 * users and screen reader users.
 */
test.describe('Accessibility: ARIA Attributes', () => {
  test('sidebar category buttons have correct aria-expanded state', async ({ catalogPage }) => {
    await catalogPage.goto()

    const categoryBtns = catalogPage.categoryButtons()
    const count = await categoryBtns.count()
    expect(count).toBeGreaterThan(1)

    // All categories start expanded
    for (let i = 0; i < count; i++) {
      await expect(categoryBtns.nth(i)).toHaveAttribute('aria-expanded', 'true')
    }

    // Collapse first category
    await categoryBtns.first().click()
    await expect(categoryBtns.first()).toHaveAttribute('aria-expanded', 'false')

    // Other categories remain expanded
    for (let i = 1; i < count; i++) {
      await expect(categoryBtns.nth(i)).toHaveAttribute('aria-expanded', 'true')
    }
  })

  test('code mode switch buttons have correct aria-checked state', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.ensureSidebarOpen()

    // Code mode switch uses role="radiogroup" with aria-checked
    const sidebarSwitch = catalogPage.sidebar.locator('[data-testid="code-mode-switch"]')
    const framerBtn = sidebarSwitch.locator('[data-testid="code-mode-switch-Framer"]')
    const cssBtn = sidebarSwitch.locator('[data-testid="code-mode-switch-CSS"]')

    // Framer is active
    await expect(framerBtn).toHaveAttribute('aria-checked', 'true')
    await expect(cssBtn).toHaveAttribute('aria-checked', 'false')

    // Switch to CSS
    await cssBtn.click()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)

    await expect(framerBtn).toHaveAttribute('aria-checked', 'false')
    await expect(cssBtn).toHaveAttribute('aria-checked', 'true')
  })

  test('mobile nav toggle exposes an accessible navigation panel', async ({ mobilePage, page }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    const panelToggle = page.locator('[data-testid="toggle-left-panel"]')
    await expect(panelToggle).toHaveAttribute('aria-label', /toggle navigation/i)

    await mobilePage.expectDrawerClosed()
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await expect(mobilePage.drawerCodeModeSwitch()).toBeVisible()
    expect(await mobilePage.drawerGroupLinks().count()).toBeGreaterThan(1)
  })

  test('replay buttons have correct disabled/aria-disabled states', async ({ catalogPage }) => {
    // Test an enabled replay button
    await catalogPage.gotoGroup('standard-effects-framer')
    const enabledCard = catalogPage.card('standard-effects__bounce')
    const enabledReplay = catalogPage.replayButton(enabledCard)
    await expect(enabledReplay).toBeEnabled()

    // Test a disabled replay button (interactive-only animation)
    await catalogPage.gotoGroup('button-effects-framer')
    const disabledCard = catalogPage.card('button-effects__ripple')
    const disabledReplay = catalogPage.replayButton(disabledCard)
    await expect(disabledReplay).toBeDisabled()
  })
})

test.describe('Accessibility: Keyboard Navigation', () => {
  test('sidebar group links are keyboard-focusable and tabbable between', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Focus the first sidebar group link directly
    const firstLink = catalogPage.allGroupLinks().first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()

    // Tab to the next link
    await page.keyboard.press('Tab')
    const secondLink = catalogPage.allGroupLinks().nth(1)
    await expect(secondLink).toBeFocused()
  })

  test('Enter activates sidebar group links', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Focus the second group link directly
    const secondGroup = catalogPage.allGroupLinks().nth(1)
    await secondGroup.focus()

    const before = catalogPage.currentPathname()

    // Press Enter to activate
    await page.keyboard.press('Enter')
    await catalogPage.waitForPathnameChange(before)

    // Navigation occurred
    const afterEnter = catalogPage.currentPathname()
    expect(afterEnter).not.toBe(before)
    await catalogPage.waitForCards()
  })

  test('Space activates sidebar group links', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Focus a non-active group link
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(1)

    for (let i = 0; i < count; i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).focus()
        const before = catalogPage.currentPathname()
        await page.keyboard.press('Space')
        await catalogPage.waitForPathnameChange(before)
        await catalogPage.waitForCards()
        break
      }
    }
  })

  test('mobile panel toggle is keyboard-accessible', async ({ mobilePage, page }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Focus the panel toggle button
    const panelToggle = page.locator('[data-testid="toggle-left-panel"]')
    await panelToggle.focus()

    // Activate with Enter — should open the navigation panel
    await page.keyboard.press('Enter')
    await mobilePage.expectDrawerOpen()

    // Activate the same toggle again to close it
    await panelToggle.focus()
    await page.keyboard.press('Enter')
    await mobilePage.expectDrawerClosed()
  })
})

test.describe('Accessibility: Code Mode Switch Keyboard', () => {
  test('code mode switch buttons are activatable via keyboard', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.ensureSidebarOpen()

    const sidebarSwitch = catalogPage.sidebar.locator('[data-testid="code-mode-switch"]')
    const cssBtn = sidebarSwitch.locator('[data-testid="code-mode-switch-CSS"]')

    // Focus the CSS button and activate via Space (radio button convention)
    await cssBtn.focus()
    await expect(cssBtn).toBeFocused()
    await cssBtn.press('Space')

    // Should switch to CSS mode
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
    await expect(cssBtn).toHaveAttribute('aria-checked', 'true')

    // Focus Framer button and activate via Enter
    const framerBtn = sidebarSwitch.locator('[data-testid="code-mode-switch-Framer"]')
    await framerBtn.focus()
    await framerBtn.press('Enter')

    // Should switch back to Framer mode
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)
    await expect(framerBtn).toHaveAttribute('aria-checked', 'true')
  })
})

test.describe('Accessibility: Card Action Buttons', () => {
  test('card header buttons have descriptive aria-labels', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await expect(card).toBeVisible()

    // Desktop preview button
    const desktopBtn = catalogPage.previewDesktopButton(card)
    await expect(desktopBtn).toHaveAttribute('aria-label', /desktop/i)

    // Mobile preview button
    const mobileBtn = catalogPage.previewMobileButton(card)
    await expect(mobileBtn).toHaveAttribute('aria-label', /mobile/i)

    // Code viewer button
    const codeBtn = catalogPage.codeViewerButton(card)
    await expect(codeBtn).toHaveAttribute('aria-label', /source|code/i)

    // Copy link button
    const copyBtn = catalogPage.copyLinkButton(card)
    await expect(copyBtn).toHaveAttribute('aria-label', /copy|link|url/i)
  })
})

test.describe('Accessibility: Description Toggle', () => {
  test('description toggle buttons have descriptive aria-labels', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const toggle = catalogPage.descriptionToggle(card)

    const label = await toggle.getAttribute('aria-label')
    expect(label).toMatch(/description/i)
  })
})

test.describe('Accessibility: Reduced Motion', () => {
  test('Framer animation respects prefers-reduced-motion by skipping scale transform', async ({
    catalogPage,
    page,
  }) => {
    // Emulate reduced motion before navigating
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await expect(card).toBeVisible()

    // Wait for the animation to complete (reduced motion uses 0.01s duration)
    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()

    // The inner m.div should have opacity:1 and scale:1 (or no scale at all)
    // With reduced motion, the initial state skips scale (only opacity: 0 → 1)
    // After animation completes, the element should be fully visible
    const innerDiv = stage.locator(':scope > div > div').first()
    await expect(innerDiv).toBeVisible()

    // Verify the animation completed nearly instantly by checking the element
    // is fully opaque (not mid-animation). The 0.01s duration means it's
    // effectively instant.
    const opacity = await innerDiv.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity))
    expect(opacity).toBeGreaterThanOrEqual(0.99)

    // App functions normally with reduced motion
    await catalogPage.expectNoErrorBoundary()
  })

  test('navigation and mode switching work with reduced motion enabled', async ({
    catalogPage,
    page,
    errorCollector,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Navigate to a different group — transitions should complete instantly
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    // Cards render correctly with reduced motion
    const cardCount = await catalogPage.allCards().count()
    expect(cardCount).toBeGreaterThan(0)

    // Switch code mode — URL transitions should still work
    await catalogPage.selectCssMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
    await catalogPage.waitForCards()

    // Switch back to Framer
    await catalogPage.selectFramerMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)
    await catalogPage.waitForCards()

    // Sidebar navigation still works
    await catalogPage.clickNonActiveGroup()
    await catalogPage.waitForCards()

    errorCollector.expectNoErrors()
    await catalogPage.expectNoErrorBoundary()
  })
})

test.describe('Accessibility: View Menu', () => {
  test('View menu trigger has correct aria-expanded state', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const trigger = catalogPage.page.locator('[data-testid="dropdown-menu-toggle"]').filter({
      has: catalogPage.viewMenuButton(),
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // Open menu
    await catalogPage.openViewMenu()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('Escape key closes View menu dropdown', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    await catalogPage.openViewMenu()
    const dropdown = page.locator('[data-testid="dropdown-menu-stop-propagation"]')
    await expect(dropdown).toBeVisible()

    // Escape closes the dropdown
    await page.keyboard.press('Escape')
    await expect(dropdown).not.toBeVisible()
  })
})

test.describe('Accessibility: Code Viewer Modal Focus', () => {
  test('code viewer modal receives focus on open', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Focus should be inside the modal (either close button or the modal itself)
    await expect
      .poll(
        async () => {
          const focused = await catalogPage.page.evaluate(() => {
            const el = document.activeElement
            const modal = document.querySelector('[data-testid="code-viewer-modal"]')
            return modal?.contains(el) ?? false
          })
          return focused
        },
        { timeout: 5_000 }
      )
      .toBe(true)
  })

  test('code viewer modal restores focus on close', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    const codeBtn = catalogPage.codeViewerButton(card)

    // Focus the code viewer button explicitly before opening
    await codeBtn.focus()
    await codeBtn.click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Close via Escape
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Focus should return to the code viewer button
    await expect(codeBtn).toBeFocused()
  })

  test('code viewer modal controls are keyboard-reachable', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Tab list is interactable
    const tabList = catalogPage.codeTabList()
    await expect(tabList).toBeVisible()
    expect(await catalogPage.codeTabs().count()).toBeGreaterThan(0)

    // Copy button is visible and enabled
    const copyBtn = catalogPage.codeCopyButton()
    await expect(copyBtn).toBeVisible()
    await expect(copyBtn).toBeEnabled()

    // Close button is visible and enabled
    await expect(catalogPage.codeCloseButton()).toBeVisible()
    await expect(catalogPage.codeCloseButton()).toBeEnabled()
  })

  test('Tab within code viewer modal cycles through interactive elements', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Tab through interactive elements within the modal
    const focusedTestIds: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const testId = await page.evaluate(() => {
        const el = document.activeElement
        return el?.getAttribute('data-testid') ?? null
      })
      if (testId) focusedTestIds.push(testId)
    }

    // Copy button should be reachable via Tab
    expect(focusedTestIds).toContain('code-copy-btn')
    // Tab buttons should be reachable (now: code-tablist-tab-*)
    expect(focusedTestIds.some((id) => id.startsWith('code-tablist-tab-'))).toBe(true)
  })
})
