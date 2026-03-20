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

test.describe('Accessibility: Description Toggle', () => {
  test('description toggle buttons have descriptive aria-labels', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const toggle = catalogPage.descriptionToggle(card)

    // Has a meaningful aria-label
    const label = await toggle.getAttribute('aria-label')
    expect(label).toBeTruthy()
    expect(label).toMatch(/description/i)
  })
})
