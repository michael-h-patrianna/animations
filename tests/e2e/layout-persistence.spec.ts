import { test, expect } from './fixtures/catalog.fixture'

/**
 * Layout persistence tests: verify that zustand/persist-backed layout state
 * (sidebar panel visibility, theme, accent color) survives page reload.
 *
 * The layout store uses zustand/persist with key 'animation-catalog-layout'.
 * These tests verify:
 * - Toggling the sidebar panel off persists across reload
 * - Theme selection persists across reload
 * - Accent color selection persists across reload
 * - Panel state persists across client-side navigation
 *
 * Bug this catches: zustand persist configuration broken (wrong key, merge
 * function strips values), or the UI reads initial state instead of persisted
 * state on mount.
 */

/**
 * Wait for the app to load WITHOUT forcing the sidebar open.
 * Unlike catalogPage.waitForShell(), this only waits for the top bar
 * and does NOT call ensureSidebarOpen().
 */
async function waitForTopBarOnly(catalogPage: { page: import('@playwright/test').Page }) {
  await expect(catalogPage.page.locator('[data-testid="top-bar"]')).toBeVisible({ timeout: 10_000 })
}

test.describe('Layout Persistence: Panel Toggle', () => {
  test('sidebar panel state persists across page reload', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Sidebar should be open by default on desktop
    await catalogPage.ensureSidebarOpen()
    expect(await catalogPage.isSidebarVisible()).toBe(true)

    // Toggle sidebar closed
    await page.locator('[data-testid="toggle-left-panel"]').click()

    // Wait for sidebar to disappear
    await expect.poll(async () => catalogPage.isSidebarVisible(), { timeout: 3_000 }).toBe(false)

    // Reload the page — do NOT call waitForShell (it re-opens the sidebar)
    await page.reload()
    await waitForTopBarOnly(catalogPage)
    await catalogPage.waitForCards()

    // Sidebar should still be closed after reload (persisted state)
    expect(await catalogPage.isSidebarVisible()).toBe(false)

    // Toggle it back open to clean up
    await page.locator('[data-testid="toggle-left-panel"]').click()
    await expect.poll(async () => catalogPage.isSidebarVisible(), { timeout: 3_000 }).toBe(true)
  })

  test('sidebar panel state persists across client-side navigation', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Ensure sidebar is open, then close it
    await catalogPage.ensureSidebarOpen()
    await page.locator('[data-testid="toggle-left-panel"]').click()
    await expect.poll(async () => catalogPage.isSidebarVisible(), { timeout: 3_000 }).toBe(false)

    // Navigate to a different group via URL — do NOT call waitForShell
    await page.goto('/text-effects-framer')
    await waitForTopBarOnly(catalogPage)
    await catalogPage.waitForCards()

    // Sidebar should remain closed (store persists across navigation)
    expect(await catalogPage.isSidebarVisible()).toBe(false)

    // Clean up: re-open sidebar
    await page.locator('[data-testid="toggle-left-panel"]').click()
    await expect.poll(async () => catalogPage.isSidebarVisible(), { timeout: 3_000 }).toBe(true)
  })
})

test.describe('Layout Persistence: Theme and Accent', () => {
  /**
   * Helper: open the View menu, hover the submenu trigger (Theme or Accent),
   * wait for the portaled submenu to appear, then click the target item.
   * Dropdown submenus are portaled and require hover to expand.
   */
  async function selectFromViewSubmenu(
    catalogPage: Parameters<Parameters<typeof test>[1]>[0]['catalogPage'],
    page: Parameters<Parameters<typeof test>[1]>[0]['page'],
    submenuLabel: string,
    itemTestId: string
  ) {
    await catalogPage.openViewMenu()

    // Click the submenu trigger (e.g. "Theme" or "Accent") to expand the submenu.
    // Submenus are portaled inside the popover container.
    const submenuTrigger = page
      .locator('[data-testid="dropdown-menu-stop-propagation"] button')
      .filter({ hasText: submenuLabel })
    await expect(submenuTrigger).toBeVisible({ timeout: 3_000 })
    await submenuTrigger.click()

    // Wait for the portaled submenu item to appear and click it
    const item = page.locator(`[data-testid="${itemTestId}"]`)
    await expect(item).toBeVisible({ timeout: 5_000 })
    await item.click()
  }

  test('theme selection applies data-mode attribute and persists across reload', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Record default theme
    const defaultTheme = await catalogPage.currentTheme()
    expect(defaultTheme).toBeTruthy()

    // Select a different theme
    const targetTheme = defaultTheme === 'dark-blue' ? 'dark-brown' : 'dark-blue'
    await selectFromViewSubmenu(catalogPage, page, 'Theme', `theme-${targetTheme}`)

    // Verify data-mode attribute changed
    await expect.poll(async () => catalogPage.currentTheme(), { timeout: 3_000 }).toBe(targetTheme)

    // Reload the page
    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Theme should persist after reload
    expect(await catalogPage.currentTheme()).toBe(targetTheme)

    // Clean up: restore default theme
    await selectFromViewSubmenu(catalogPage, page, 'Theme', 'theme-dark-blue')
    await expect
      .poll(async () => catalogPage.currentTheme(), { timeout: 3_000 })
      .toBe('dark-blue')
  })

  test('accent color selection applies data-accent attribute and persists across reload', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Record default accent
    const defaultAccent = await catalogPage.currentAccent()
    expect(defaultAccent).toBeTruthy()

    // Select a different accent
    const targetAccent = defaultAccent === 'magenta' ? 'green' : 'magenta'
    await selectFromViewSubmenu(catalogPage, page, 'Accent', `accent-${targetAccent}`)

    // Verify data-accent attribute changed
    await expect
      .poll(async () => catalogPage.currentAccent(), { timeout: 3_000 })
      .toBe(targetAccent)

    // Reload the page
    await page.reload()
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Accent should persist after reload
    expect(await catalogPage.currentAccent()).toBe(targetAccent)

    // Clean up: restore default accent
    await selectFromViewSubmenu(catalogPage, page, 'Accent', 'accent-blue')
    await expect.poll(async () => catalogPage.currentAccent(), { timeout: 3_000 }).toBe('blue')
  })
})

test.describe('Layout Persistence: View Menu Interaction', () => {
  test('View menu opens and shows Theme and Accent submenus', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    // VIEW button is visible
    await expect(catalogPage.viewMenuButton()).toBeVisible()

    // Open the menu
    await catalogPage.openViewMenu()

    // Theme and Accent headers should be visible in the dropdown
    const dropdownContent = page.locator('[data-testid="dropdown-menu-stop-propagation"]')
    await expect(dropdownContent.locator('text=Theme')).toBeVisible()
    await expect(dropdownContent.locator('text=Accent')).toBeVisible()
  })

  test('current theme has checkmark in submenu', async ({ catalogPage, page }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const currentTheme = await catalogPage.currentTheme()

    // Open View menu and click Theme trigger to expand submenu
    await catalogPage.openViewMenu()
    const themeBtn = page
      .locator('[data-testid="dropdown-menu-stop-propagation"] button')
      .filter({ hasText: 'Theme' })
    await expect(themeBtn).toBeVisible({ timeout: 3_000 })
    await themeBtn.click()

    // The current theme option should have a checkmark prefix
    const currentThemeItem = page.locator(`[data-testid="theme-${currentTheme}"]`)
    await expect(currentThemeItem).toBeVisible({ timeout: 3_000 })
    const text = await currentThemeItem.textContent()
    expect(text?.trim().startsWith('✓')).toBe(true)
  })
})
