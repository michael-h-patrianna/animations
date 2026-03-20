import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object encapsulating the animation catalog UI.
 * Provides navigation, sidebar, card, and code-mode interactions.
 *
 * Selector strategy:
 * - data-testid for interactive elements and key containers
 * - data-animation-id for cards (domain-specific stable attribute)
 * - aria-* attributes for accessible queries
 * - data-active for state assertions
 */
export class CatalogPage {
  readonly sidebar: Locator

  constructor(readonly page: Page) {
    this.sidebar = page.locator('[data-testid="sidebar"]').first()
  }

  // ── Navigation ─────────────────────────────────────────────────────

  /** Navigate to root and wait for sidebar to appear. */
  async goto() {
    await this.page.goto('/')
    await this.waitForShell()
  }

  /** Navigate directly to a specific group route. */
  async gotoGroup(groupId: string) {
    await this.page.goto(`/${groupId}`)
    await expect.poll(() => this.currentPathname(), { timeout: 10_000 }).toBe(`/${groupId}`)
    await this.waitForCards()
  }

  /** Wait for the app shell (sidebar) to be ready. */
  async waitForShell() {
    await expect(this.sidebar).toBeVisible({ timeout: 10_000 })
  }

  /** Wait for at least one animation card to appear. */
  async waitForCards() {
    await expect(this.page.locator('[data-animation-id]').first()).toBeVisible({
      timeout: 10_000,
    })
  }

  /** Return the current URL pathname. */
  currentPathname(): string {
    return new URL(this.page.url()).pathname
  }

  /** Wait until pathname changes from the given value. */
  async waitForPathnameChange(fromPathname: string) {
    await expect.poll(() => this.currentPathname(), { timeout: 10_000 }).not.toBe(fromPathname)
  }

  // ── Sidebar ────────────────────────────────────────────────────────

  /** All category buttons in the sidebar. */
  categoryButtons(): Locator {
    return this.sidebar.locator('[data-testid^="sidebar-category-"]')
  }

  /** All sidebar sections. */
  sidebarSections(): Locator {
    return this.sidebar.locator('[data-testid^="sidebar-section-"]')
  }

  /** Group links within a specific sidebar section. */
  groupLinksInSection(section: Locator): Locator {
    return section.locator('[data-testid^="sidebar-group-"]')
  }

  /** All visible group links in the sidebar. */
  allGroupLinks(): Locator {
    return this.sidebar.locator('[data-testid^="sidebar-group-"]')
  }

  /** The active group link in the sidebar. */
  activeGroupLink(): Locator {
    return this.sidebar.locator('[data-testid^="sidebar-group-"][data-active]')
  }

  /** Click a category button by index. */
  async clickCategory(index: number) {
    const before = this.currentPathname()
    await this.categoryButtons().nth(index).click()
    await this.waitForPathnameChange(before)
  }

  /** Click a group link by index within the visible group links. */
  async clickGroupLink(index: number) {
    const before = this.currentPathname()
    await this.allGroupLinks().nth(index).click()
    await this.waitForPathnameChange(before)
  }

  // ── Code Mode ──────────────────────────────────────────────────────

  /** The code mode switch scoped to the desktop sidebar (not the mobile drawer). */
  private codeModeSwitch(): Locator {
    return this.sidebar.locator('[data-testid="code-mode-switch"]')
  }

  /** Click the Framer mode button in the desktop sidebar. */
  async selectFramerMode() {
    await this.codeModeSwitch().locator('[data-testid="code-mode-framer"]').click()
  }

  /** Click the CSS mode button in the desktop sidebar. */
  async selectCssMode() {
    await this.codeModeSwitch().locator('[data-testid="code-mode-css"]').click()
  }

  /** Get the currently active code mode label from the desktop sidebar. */
  async activeCodeMode(): Promise<string> {
    const active = this.codeModeSwitch().locator('button[aria-pressed="true"]')
    return (await active.textContent()) ?? ''
  }

  // ── Cards ──────────────────────────────────────────────────────────

  /** Get a card by its animation ID. */
  card(animationId: string): Locator {
    return this.page.locator(`[data-animation-id="${animationId}"]`).first()
  }

  /** All animation cards on the current page. */
  allCards(): Locator {
    return this.page.locator('[data-animation-id]')
  }

  /** Get the demo stage inside a card, waiting for it to have content. */
  async cardStage(card: Locator, minChildren = 1): Promise<Locator> {
    await card.scrollIntoViewIfNeeded()
    const stage = card.locator('[data-testid="demo-stage"]')
    await expect(stage).toBeVisible({ timeout: 5_000 })
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(minChildren)
    return stage
  }

  /** Get the replay button on a card. */
  replayButton(card: Locator): Locator {
    return card.locator('[data-role="replay"]')
  }

  /** Get the meta/tags area of a card. */
  cardMeta(card: Locator): Locator {
    return card.locator('[data-testid="card-meta"]')
  }

  /** Get the card title. */
  cardTitle(card: Locator): Locator {
    return card.locator('[data-testid="card-title"]')
  }

  /** Get the card description. */
  cardDescription(card: Locator): Locator {
    return card.locator('[data-testid="card-description"]')
  }

  /** Get the description toggle button. */
  descriptionToggle(card: Locator): Locator {
    return card.locator('button[aria-label*="description"]')
  }

  /** Get the group title heading in the main content area. */
  groupTitle(): Locator {
    return this.page.locator('[data-testid="group-title"]')
  }

  /** Get the group section element by ID. */
  groupSection(groupId: string): Locator {
    return this.page.locator(`[data-testid="group-section-group-${groupId}"]`)
  }

  /** Assert that the ErrorBoundary fallback is NOT shown. */
  async expectNoErrorBoundary() {
    await expect(this.page.locator('[data-testid="error-fallback"]')).toHaveCount(0)
  }

  /** Extract all data-animation-id values from visible cards on the current page. */
  async getAllAnimationIds(): Promise<string[]> {
    const cards = this.allCards()
    const count = await cards.count()
    const ids: string[] = []
    for (let i = 0; i < count; i++) {
      const id = await cards.nth(i).getAttribute('data-animation-id')
      if (id) ids.push(id)
    }
    return ids
  }
}
