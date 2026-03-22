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

  test('code mode switch buttons have correct aria-pressed state', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Framer is active — scope to the desktop sidebar (first instance)
    const sidebarSwitch = catalogPage.page
      .locator('[data-testid="sidebar"]')
      .first()
      .locator('[data-testid="code-mode-switch"]')
    const framerBtn = sidebarSwitch.locator('[data-testid="code-mode-framer"]')
    const cssBtn = sidebarSwitch.locator('[data-testid="code-mode-css"]')

    await expect(framerBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(cssBtn).toHaveAttribute('aria-pressed', 'false')

    // Switch to CSS
    await cssBtn.click()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)

    await expect(framerBtn).toHaveAttribute('aria-pressed', 'false')
    await expect(cssBtn).toHaveAttribute('aria-pressed', 'true')
  })

  test('mobile drawer has correct dialog role and aria-modal', async ({ mobilePage }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    const drawer = mobilePage.drawer
    await expect(drawer).toHaveAttribute('role', 'dialog')
    await expect(drawer).toHaveAttribute('aria-modal', 'true')

    // When closed, drawer is hidden
    await expect(drawer).toBeHidden()

    // When open, drawer is visible
    await mobilePage.openDrawer()
    await expect(drawer).not.toBeHidden()
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
    await expect(disabledReplay).toHaveAttribute('aria-disabled', 'true')
  })
})

test.describe('Accessibility: Keyboard Navigation', () => {
  test('Tab navigates through sidebar elements in order', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Tab into the sidebar — first interactive element should receive focus
    // We start from the body and tab forward
    await page.keyboard.press('Tab')

    // After some tabs, we should reach a sidebar category button
    let foundCategory = false
    for (let i = 0; i < 20; i++) {
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId && testId.startsWith('sidebar-category-')) {
        foundCategory = true
        break
      }
      await page.keyboard.press('Tab')
    }
    expect(foundCategory).toBe(true)
  })

  test('Enter activates sidebar group links', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Focus the second group link directly
    const secondGroup = catalogPage.allGroupLinks().nth(1)
    await secondGroup.focus()

    const before = catalogPage.currentPathname()

    // Press Enter to activate — standard keyboard activation for buttons
    await page.keyboard.press('Enter')
    await catalogPage.waitForPathnameChange(before)

    // Navigation occurred — URL changed and content updated
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

  test('mobile hamburger button is keyboard-accessible', async ({ mobilePage, page }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Focus the hamburger button
    const hamburger = page.getByRole('button', { name: 'Open menu' })
    await hamburger.focus()

    // Activate with Enter
    await page.keyboard.press('Enter')
    await mobilePage.expectDrawerOpen()

    // Close button is now focusable
    const closeBtn = page.getByRole('button', { name: 'Close menu' })
    await closeBtn.focus()
    await page.keyboard.press('Enter')
    await mobilePage.expectDrawerClosed()
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

    // Has a meaningful aria-label describing the expand/collapse action
    const label = await toggle.getAttribute('aria-label')
    expect(label).toMatch(/description/i)
  })
})

test.describe('Accessibility: Code Viewer Modal Focus', () => {
  test('code viewer modal receives focus on open', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Close button should receive initial focus (standard modal pattern)
    const closeBtn = catalogPage.codeCloseButton()
    await expect(closeBtn).toBeFocused()
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

    // Focus should return to the element that was focused before the modal opened
    // (the code viewer button)
    await expect(codeBtn).toBeFocused()
  })

  test('code viewer modal controls are keyboard-reachable via click focus', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Close button receives initial focus
    await expect(catalogPage.codeCloseButton()).toBeFocused()

    // JS file selector is interactable
    const jsSelect = catalogPage.codeJsSelect()
    if ((await jsSelect.count()) > 0) {
      await expect(jsSelect).toBeVisible()
    }

    // Copy button is clickable
    const copyBtn = catalogPage.codeCopyButton()
    await expect(copyBtn).toBeVisible()
    await expect(copyBtn).toBeEnabled()

    // Close button is keyboard-activatable
    await catalogPage.codeCloseButton().focus()
    await expect(catalogPage.codeCloseButton()).toBeFocused()
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

    // Close button receives initial focus
    await expect(catalogPage.codeCloseButton()).toBeFocused()

    // Tab through interactive elements within the modal.
    // Expected focusable elements: close button, tab buttons, copy button.
    const focusedTestIds: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const testId = await page.evaluate(() => {
        const el = document.activeElement
        return el?.getAttribute('data-testid') ?? null
      })
      if (testId) focusedTestIds.push(testId)
    }

    // Copy button and file selectors should be reachable via Tab
    expect(focusedTestIds).toContain('code-copy-btn')
    // File selector dropdowns should be reachable (code-js-select or code-css-select)
    expect(focusedTestIds.some((id) => id === 'code-js-select' || id === 'code-css-select')).toBe(
      true
    )
  })
})
