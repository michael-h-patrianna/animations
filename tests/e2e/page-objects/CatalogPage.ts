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
  readonly page: Page
  readonly sidebar: Locator

  constructor(page: Page) {
    this.page = page
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

  /**
   * Wait for the AnimatePresence group transition to settle.
   * Under load, the exit animation keeps departing group cards in the DOM
   * briefly alongside the new group's cards. This waits until all
   * data-animation-id values are unique.
   */
  async waitForTransitionSettle() {
    await expect
      .poll(
        async () => {
          const ids = await this.allCards().evaluateAll((els) =>
            els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
          )
          if (ids.length === 0) return -1
          return ids.length - new Set(ids).size
        },
        { timeout: 10_000 }
      )
      .toBe(0)
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

  /**
   * All animation cards on the current page.
   *
   * Note: Some animation components (e.g., prize-reveal) also set
   * data-animation-id on their internal root element. This locator
   * matches ALL such elements. For accurate card counts in groups with
   * those components, scope queries to the card-grid's direct children:
   *   `groupSection(id).locator('[data-testid="card-grid"] > [data-animation-id]')`
   */
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

  /** Get the group title shown in the sticky header bar. */
  groupTitle(): Locator {
    return this.page.locator('[data-testid="mobile-title"]')
  }

  /** Get the group section element by ID. */
  groupSection(groupId: string): Locator {
    return this.page.locator(`[data-testid="group-section-group-${groupId}"]`)
  }

  // ── Code Viewer ──────────────────────────────────────────────────────

  /** Get the code viewer button on a card. */
  codeViewerButton(card: Locator): Locator {
    return card.locator('[data-testid="code-viewer-btn"]')
  }

  /** Get the code viewer modal (rendered as portal on document.body). */
  codeViewerModal(): Locator {
    return this.page.locator('[data-testid="code-viewer-modal"]')
  }

  /** Get a code viewer tab by index. */
  codeTab(index: number): Locator {
    return this.page.locator(`[data-testid="code-tab-${index}"]`)
  }

  /** Get all code viewer tabs. */
  codeTabs(): Locator {
    return this.page.locator('[data-testid^="code-tab-"]')
  }

  /** Get the copy button in the code viewer modal. */
  codeCopyButton(): Locator {
    return this.page.locator('[data-testid="code-copy-btn"]')
  }

  /** Get the close button in the code viewer modal. */
  codeCloseButton(): Locator {
    return this.page.locator('[data-testid="code-close-btn"]')
  }

  /** Get the code body area in the code viewer modal. */
  codeBody(): Locator {
    return this.page.locator('[data-testid="code-body"]')
  }

  /** Get the highlighted code container (rendered by Shiki). */
  codeHighlighted(): Locator {
    return this.page.locator('[data-testid="code-highlighted"]')
  }

  /** Get the loading indicator in the code viewer modal. */
  codeLoading(): Locator {
    return this.page.locator('[data-testid="code-loading"]')
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

  /**
   * Discover all group paths from the sidebar (framer + CSS).
   * Switches code mode to collect both tech variants.
   */
  async discoverAllGroupPaths(): Promise<string[]> {
    await this.goto()
    await this.waitForShell()

    const groupPaths: string[] = []

    // Collect paths in both code modes
    for (const selectMode of [() => this.selectFramerMode(), () => this.selectCssMode()]) {
      await selectMode()
      // Wait for sidebar to reflect the mode change
      await this.page.waitForTimeout(300)

      const groupLinks = this.allGroupLinks()
      const groupCount = await groupLinks.count()

      for (let i = 0; i < groupCount; i++) {
        await groupLinks.nth(i).click()
        await expect.poll(() => this.currentPathname(), { timeout: 5_000 }).toMatch(/^\//)
        const path = this.currentPathname().replace(/^\//, '')
        if (path && !groupPaths.includes(path)) {
          groupPaths.push(path)
        }
      }
    }
    return groupPaths
  }

  // ── Viewport Preview ────────────────────────────────────────────────

  /** Desktop preview button on a card. */
  previewDesktopButton(card: Locator): Locator {
    return card.locator('[data-testid="preview-btn-desktop"]')
  }

  /** Mobile preview button on a card. */
  previewMobileButton(card: Locator): Locator {
    return card.locator('[data-testid="preview-btn-mobile"]')
  }

  /** Preview overlay (portal on document.body). */
  previewOverlay(): Locator {
    return this.page
      .locator('[data-testid^="preview-"]')
      .filter({ has: this.page.locator('[data-testid="preview-toolbar"]') })
  }

  /** Preview animation container inside the overlay. */
  previewAnimation(): Locator {
    return this.page.locator('[data-testid="preview-animation"]')
  }

  /** Mobile phone frame in the preview. */
  previewMobileFrame(): Locator {
    return this.page.locator('[data-testid="preview-mobile-frame"]')
  }

  /** Replay button in the preview toolbar. */
  previewReplayButton(): Locator {
    return this.page.locator('[data-testid="preview-replay-btn"]')
  }

  /** Close button in the preview toolbar. */
  previewCloseButton(): Locator {
    return this.page.locator('[data-testid="preview-close-btn"]')
  }

  /** Desktop mode button in the preview mode switcher. */
  previewModeDesktopButton(): Locator {
    return this.page.locator('[data-testid="preview-mode-desktop"]')
  }

  /** Mobile mode button in the preview mode switcher. */
  previewModeMobileButton(): Locator {
    return this.page.locator('[data-testid="preview-mode-mobile"]')
  }

  /** Open desktop preview for a card and wait for overlay. */
  async openDesktopPreview(card: Locator) {
    await card.scrollIntoViewIfNeeded()
    await this.previewDesktopButton(card).click()
    await expect(this.page.locator('[data-testid="preview-desktop"]')).toBeVisible({
      timeout: 3_000,
    })
  }

  /** Open mobile preview for a card and wait for overlay. */
  async openMobilePreview(card: Locator) {
    await card.scrollIntoViewIfNeeded()
    await this.previewMobileButton(card).click()
    await expect(this.page.locator('[data-testid="preview-mobile"]')).toBeVisible({
      timeout: 3_000,
    })
  }

  /** Close the preview via the close button and wait for overlay to disappear. */
  async closePreview() {
    await this.previewCloseButton().click()
    await expect(this.previewAnimation()).toHaveCount(0, { timeout: 3_000 })
  }
}
