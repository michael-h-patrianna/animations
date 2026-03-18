import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object for mobile viewport interactions: header, hamburger menu, drawer.
 */
export class MobilePage {
  readonly header: Locator
  readonly drawer: Locator
  readonly overlay: Locator
  readonly drawerPanel: Locator

  constructor(readonly page: Page) {
    this.header = page.locator('.pf-mobile-header')
    this.drawer = page.locator('#pf-sidebar-drawer')
    this.overlay = page.locator('.pf-drawer__overlay')
    this.drawerPanel = page.locator('.pf-drawer__panel')
  }

  /** Set viewport to mobile and navigate to a group. */
  async gotoMobile(groupId: string) {
    await this.page.setViewportSize({ width: 375, height: 667 })
    await this.page.goto(`/${groupId}`)
    await expect(this.header).toBeVisible({ timeout: 10_000 })
  }

  /** Open the mobile drawer via hamburger button. */
  async openDrawer() {
    await this.page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await expect(this.drawer).not.toBeHidden()
    await expect(this.drawer).toHaveClass(/is-open/)
  }

  /** Close the drawer via the close button. */
  async closeDrawer() {
    await this.page.locator('.pf-hamburger[aria-label="Close menu"]').click()
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
    return this.drawer.locator('.pf-sidebar__link--group')
  }

  /** Click a group link in the drawer by index. Returns the label text. */
  async clickDrawerGroup(index: number): Promise<string> {
    const target = this.drawerGroupLinks().nth(index)
    const label = (await target.innerText()).trim()
    await target.click()
    return label
  }
}
