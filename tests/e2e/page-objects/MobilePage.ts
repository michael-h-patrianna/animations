import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object for mobile viewport interactions: top bar, drawer navigation.
 *
 * After ui-refactor: the old MobileHeader is replaced by EditorTopBar.
 * On mobile, the panel toggle button opens the MobileDrawer instead of
 * toggling the sidebar panel.
 *
 * Selector strategy:
 * - data-testid for containers and interactive elements
 * - aria-label for buttons
 * - aria-checked for toggle state assertions
 */
export class MobilePage {
  /** The top bar (replaces old mobile-header). */
  readonly topBar: Locator
  readonly drawer: Locator
  readonly overlay: Locator
  readonly drawerPanel: Locator

  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.topBar = page.locator('[data-testid="top-bar"]')
    this.drawer = page.locator('[data-testid="mobile-drawer"]')
    this.overlay = page.locator('[data-testid="drawer-overlay"]')
    this.drawerPanel = page.locator('[data-testid="drawer-panel"]')
  }

  /** Set viewport to mobile and navigate to a group. */
  async gotoMobile(groupId: string) {
    await this.page.setViewportSize({ width: 375, height: 667 })
    await this.page.goto(`/${groupId}`)
    await expect(this.topBar).toBeVisible({ timeout: 10_000 })
  }

  /** The panel toggle button in the top bar (opens drawer on mobile). */
  private panelToggle(): Locator {
    return this.page.locator('[data-testid="toggle-left-panel"]')
  }

  /** Open the mobile drawer via the panel toggle button. */
  async openDrawer() {
    await this.panelToggle().click()
    await expect(this.drawer).not.toHaveAttribute('hidden')
  }

  /** Close the drawer via the close button. */
  async closeDrawer() {
    await this.drawer.locator('[data-testid="drawer-close"]').click()
    await expect(this.drawer).toBeHidden()
  }

  /** Assert the drawer is open. */
  async expectDrawerOpen() {
    await expect(this.drawer).not.toHaveAttribute('hidden')
  }

  /** Assert the drawer is closed (hidden). */
  async expectDrawerClosed() {
    await expect(this.drawer).toHaveAttribute('hidden', '')
  }

  /** Get group links inside the drawer. */
  drawerGroupLinks(): Locator {
    return this.drawer.locator('[data-testid^="sidebar-group-"]')
  }

  /** Click a group link in the drawer by index. Returns the label text. */
  async clickDrawerGroup(index: number): Promise<string> {
    const target = this.drawerGroupLinks().nth(index)
    const label = (await target.innerText()).trim()
    await target.click()
    return label
  }

  /** The code mode switch inside the drawer. */
  drawerCodeModeSwitch(): Locator {
    return this.drawer.locator('[data-testid="code-mode-switch"]')
  }

  /** Switch to CSS mode in the mobile drawer. */
  async selectCssMode() {
    await this.drawerCodeModeSwitch().locator('[data-testid="code-mode-switch-CSS"]').click()
  }

  /** Switch to Framer mode in the mobile drawer. */
  async selectFramerMode() {
    await this.drawerCodeModeSwitch().locator('[data-testid="code-mode-switch-Framer"]').click()
  }

  /** Get the currently active code mode from the drawer. */
  async activeCodeMode(): Promise<string> {
    const active = this.drawerCodeModeSwitch().locator('button[aria-checked="true"]')
    return (await active.textContent()) ?? ''
  }

  /** Check if body scroll is locked (overflow: hidden). */
  async isScrollLocked(): Promise<boolean> {
    return this.page.evaluate(() => document.body.style.overflow === 'hidden')
  }
}
