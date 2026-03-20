import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object for mobile viewport interactions: header, hamburger menu, drawer.
 *
 * Selector strategy:
 * - data-testid for containers and interactive elements
 * - aria-label for buttons (hamburger open/close)
 * - id for the drawer dialog (semantic HTML)
 */
export class MobilePage {
  readonly header: Locator
  readonly drawer: Locator
  readonly overlay: Locator
  readonly drawerPanel: Locator

  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('[data-testid="mobile-header"]')
    this.drawer = page.locator('#pf-sidebar-drawer')
    this.overlay = page.locator('[data-testid="drawer-overlay"]')
    this.drawerPanel = page.locator('[data-testid="drawer-panel"]')
  }

  /** Set viewport to mobile and navigate to a group. */
  async gotoMobile(groupId: string) {
    await this.page.setViewportSize({ width: 375, height: 667 })
    await this.page.goto(`/${groupId}`)
    await expect(this.header).toBeVisible({ timeout: 10_000 })
  }

  /** Open the mobile drawer via hamburger button. */
  async openDrawer() {
    await this.page.getByRole('button', { name: 'Open menu' }).click()
    await expect(this.drawer).not.toBeHidden()
    await expect(this.drawer).toHaveClass(/is-open/)
  }

  /** Close the drawer via the close button. */
  async closeDrawer() {
    await this.page.getByRole('button', { name: 'Close menu' }).click()
    await expect(this.drawer).toBeHidden()
  }

  /** Assert the drawer is open. */
  async expectDrawerOpen() {
    await expect(this.drawer).not.toBeHidden()
    await expect(this.drawer).toHaveClass(/is-open/)
  }

  /** Assert the drawer is closed (hidden). */
  async expectDrawerClosed() {
    await expect(this.drawer).toBeHidden()
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
    await this.drawerCodeModeSwitch().locator('[data-testid="code-mode-css"]').click()
  }

  /** Switch to Framer mode in the mobile drawer. */
  async selectFramerMode() {
    await this.drawerCodeModeSwitch().locator('[data-testid="code-mode-framer"]').click()
  }

  /** Get the currently active code mode from the drawer. */
  async activeCodeMode(): Promise<string> {
    const active = this.drawerCodeModeSwitch().locator('button[aria-pressed="true"]')
    return (await active.textContent()) ?? ''
  }
}
