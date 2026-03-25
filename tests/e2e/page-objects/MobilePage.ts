import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object for mobile viewport interactions.
 *
 * The current app uses the same responsive left panel on mobile rather than
 * a dedicated drawer component. We keep the legacy method names for test
 * ergonomics, but they now operate on the `left-panel`.
 */
export class MobilePage {
  /** The top bar (shared across desktop and mobile). */
  readonly topBar: Locator
  readonly drawer: Locator
  readonly overlay: Locator
  readonly drawerPanel: Locator

  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.topBar = page.locator('[data-testid="top-bar"]')
    this.drawer = page.locator('[data-testid="left-panel"]')
    this.overlay = page.locator('[data-testid="drawer-overlay"]')
    this.drawerPanel = this.drawer
  }

  /** Set viewport to mobile and navigate to a group. */
  async gotoMobile(groupId: string) {
    await this.page.setViewportSize({ width: 375, height: 667 })
    await this.page.goto(`/${groupId}`)
    await expect(this.topBar).toBeVisible({ timeout: 10_000 })
  }

  /** The panel toggle button in the top bar. */
  private panelToggle(): Locator {
    return this.page.locator('[data-testid="toggle-left-panel"]')
  }

  /** Open the mobile navigation panel via the top-bar toggle. */
  async openDrawer() {
    if ((await this.drawer.count()) === 0) {
      await this.panelToggle().click()
    }
    await expect(this.drawer).toBeVisible()
  }

  /** Close the mobile navigation panel via the same toggle. */
  async closeDrawer() {
    if ((await this.drawer.count()) > 0) {
      await this.panelToggle().click()
    }
    await expect(this.drawer).toHaveCount(0)
  }

  /** Assert the drawer is open. */
  async expectDrawerOpen() {
    await expect(this.drawer).toBeVisible()
  }

  /** Assert the navigation panel is closed. */
  async expectDrawerClosed() {
    await expect(this.drawer).toHaveCount(0)
  }

  /** Get group links inside the mobile navigation panel. */
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

  /** The code mode switch inside the mobile navigation panel. */
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
