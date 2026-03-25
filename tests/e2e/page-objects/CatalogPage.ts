import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object encapsulating the current animation catalog shell.
 * Provides navigation, left-panel navigation, card, and code-mode interactions.
 *
 * Selector strategy:
 * - data-testid for interactive elements and key containers
 * - data-animation-id for cards (domain-specific stable attribute)
 * - aria-* attributes for accessible queries
 * - data-active for state assertions
 */
export class CatalogPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * The current app renders navigation inside the responsive left panel.
   * Older tests used an AppSidebar wrapper that no longer exists.
   */
  get sidebar(): Locator {
    return this.page.locator('[data-testid="left-panel"]')
  }

  /** The top bar (always visible regardless of sidebar state). */
  private topBar(): Locator {
    return this.page.locator('[data-testid="top-bar"]')
  }

  /** The sidebar panel toggle button in the top bar. */
  private panelToggle(): Locator {
    return this.page.locator('[data-testid="toggle-left-panel"]')
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

  /** Wait for the app shell to be ready with navigation available. */
  async waitForShell() {
    await expect(this.topBar()).toBeVisible({ timeout: 10_000 })
    await this.ensureSidebarOpen()
  }

  /**
   * Ensure the left sidebar panel is open.
   * If hidden (toggled off or persisted closed), clicks the panel toggle.
   */
  async ensureSidebarOpen() {
    const visible = await this.page
      .locator('[data-testid="left-panel"]')
      .count()
      .then((c) => c > 0)
      .catch(() => false)

    if (!visible) {
      await this.panelToggle().click()
      await expect(this.page.locator('[data-testid="left-panel"]')).toBeVisible({ timeout: 5_000 })
    }
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
   * Scope to the visible group's direct card-grid children so internal
   * animation roots with duplicate `data-animation-id` values do not
   * masquerade as a still-transitioning page.
   */
  async waitForTransitionSettle() {
    await expect
      .poll(
        async () => {
          const ids = await this.page
            .locator(
              '[data-testid^="group-section-group-"]:visible [data-testid="card-grid"] > [data-animation-id]'
            )
            .evaluateAll((els) =>
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

  /**
   * All category toggle buttons in the left navigation panel.
   * Categories use ControlGroup with `data-testid="control-group-toggle"`.
   */
  categoryButtons(): Locator {
    return this.page.locator(
      '[data-testid="left-panel"] [data-testid^="sidebar-section-"] > [data-testid="control-group-toggle"]'
    )
  }

  /** All sidebar sections. */
  sidebarSections(): Locator {
    return this.page.locator('[data-testid="left-panel"] [data-testid^="sidebar-section-"]')
  }

  /** Group links within a specific sidebar section. */
  groupLinksInSection(section: Locator): Locator {
    return section.locator('[data-testid^="sidebar-group-"]')
  }

  /** All visible group links in the sidebar. */
  allGroupLinks(): Locator {
    return this.page.locator('[data-testid="left-panel"] [data-testid^="sidebar-group-"]')
  }

  /** The active group link in the sidebar. */
  activeGroupLink(): Locator {
    return this.page.locator('[data-testid="left-panel"] [data-testid^="sidebar-group-"][data-active]')
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

  /**
   * Click the first non-active group link in the sidebar.
   * Returns the pathname after navigation, or null if no non-active link was found.
   */
  async clickNonActiveGroup(): Promise<string | null> {
    const groupLinks = this.allGroupLinks()
    const count = await groupLinks.count()
    const before = this.currentPathname()

    for (let i = 0; i < count; i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        await this.waitForPathnameChange(before)
        return this.currentPathname()
      }
    }
    return null
  }

  // ── Code Mode ──────────────────────────────────────────────────────

  /** The code mode switch scoped to the left navigation panel. */
  private codeModeSwitch(): Locator {
    return this.page.locator('[data-testid="left-panel"] [data-testid="code-mode-switch"]')
  }

  private async waitForCodeMode(label: 'Framer' | 'CSS', suffix: '-framer' | '-css') {
    await expect
      .poll(async () => (await this.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe(label)
    await expect.poll(() => this.currentPathname(), { timeout: 5_000 }).toMatch(new RegExp(`${suffix}$`))
    await this.waitForCards()
    await this.waitForTransitionSettle()
  }

  /** Click the Framer mode button in the desktop sidebar. */
  async selectFramerMode() {
    await this.ensureSidebarOpen()
    await this.codeModeSwitch().locator('[data-testid="code-mode-switch-Framer"]').click()
    await this.waitForCodeMode('Framer', '-framer')
  }

  /** Click the CSS mode button in the desktop sidebar. */
  async selectCssMode() {
    await this.ensureSidebarOpen()
    await this.codeModeSwitch().locator('[data-testid="code-mode-switch-CSS"]').click()
    await this.waitForCodeMode('CSS', '-css')
  }

  /** Get the currently active code mode label from the desktop sidebar. */
  async activeCodeMode(): Promise<string> {
    const active = this.codeModeSwitch().locator('button[aria-checked="true"]')
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

  /** Get the group title shown in the top bar. */
  groupTitle(): Locator {
    return this.page.locator('[data-testid="topbar-title"]')
  }

  /** Get the group section element by ID. */
  groupSection(groupId: string): Locator {
    return this.page.locator(`[data-testid="group-section-group-${groupId}"]`)
  }

  /**
   * Cards scoped to the card-grid's direct children within a group section.
   * Avoids double-counting animation components that set data-animation-id
   * on their internal root (e.g., prize-reveal).
   */
  scopedCards(groupId: string): Locator {
    return this.groupSection(groupId).locator('[data-testid="card-grid"] > [data-animation-id]')
  }

  // ── Filter Banner ──────────────────────────────────────────────────

  /** The filter banner element shown when ?animation= is active. */
  filterBanner(): Locator {
    return this.page.locator('[data-testid="filter-banner"]')
  }

  /** The "Show all animations" / remove filter button in the filter banner. */
  removeFilterButton(): Locator {
    return this.page.locator('[data-testid="remove-filter-btn"]')
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

  /** Get the tab list in the code viewer (role="tablist"). */
  codeTabList(): Locator {
    return this.page.locator('[data-testid="code-tablist"]')
  }

  /** Get a specific tab button by index in the code viewer. */
  codeTab(index: number): Locator {
    return this.page.locator('[data-testid^="code-tablist-tab-"]').nth(index)
  }

  /** Get all tab buttons in the code viewer. */
  codeTabs(): Locator {
    return this.page.locator('[data-testid^="code-tablist-tab-"]')
  }

  /** Get the copy button in the code viewer modal. */
  codeCopyButton(): Locator {
    return this.page.locator('[data-testid="code-copy-btn"]')
  }

  /** Get the close button in the code viewer modal. */
  codeCloseButton(): Locator {
    return this.codeViewerModal().locator('[data-testid="demo-modal-close"]')
  }

  /** Get the code body area in the active tab panel of the code viewer modal. */
  codeBody(): Locator {
    // Tabs use keep-alive: inactive panels are hidden. Target the visible one.
    return this.codeViewerModal().locator('[data-testid="code-body"]:visible').first()
  }

  /** Get the highlighted code container (rendered by Shiki) in the active tab. */
  codeHighlighted(): Locator {
    return this.codeViewerModal().locator('[data-testid="code-highlighted"]:visible').first()
  }

  /** Get the loading indicator in the code viewer modal. */
  codeLoading(): Locator {
    return this.codeViewerModal().locator('[data-testid="code-loading"]')
  }

  /** Assert that the ErrorBoundary fallback is NOT shown. */
  async expectNoErrorBoundary() {
    await expect(this.page.locator('[data-testid="error-fallback"]')).toHaveCount(0)
  }

  // ── Toast ─────────────────────────────────────────────────────────────

  /** Toast notification element (portaled to document.body). */
  toast(): Locator {
    return this.page.locator('[data-testid="app-toast"]')
  }

  /** Copy-link button on a card. */
  copyLinkButton(card: Locator): Locator {
    return card.locator('[data-testid="copy-link-btn"]')
  }

  /** Extract all data-animation-id values from visible cards on the current page. */
  async getAllAnimationIds(): Promise<string[]> {
    return this.page
      .locator(
        '[data-testid^="group-section-group-"]:visible [data-testid="card-grid"] > [data-animation-id]'
      )
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-animation-id')).filter((id): id is string => id != null)
      )
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
      // Wait for sidebar group links to reflect the mode change
      await expect(this.allGroupLinks().first()).toBeVisible({ timeout: 5_000 })

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
    const previewButton = this.previewDesktopButton(card)
    await expect(previewButton).toBeVisible({ timeout: 5_000 })
    await previewButton.click()
    await expect(this.page.locator('[data-testid="preview-desktop"]')).toBeVisible({
      timeout: 3_000,
    })
  }

  /** Open mobile preview for a card and wait for overlay. */
  async openMobilePreview(card: Locator) {
    const previewButton = this.previewMobileButton(card)
    await expect(previewButton).toBeVisible({ timeout: 5_000 })
    await previewButton.click()
    await expect(this.page.locator('[data-testid="preview-mobile"]')).toBeVisible({
      timeout: 3_000,
    })
  }

  /** Close the preview via the close button and wait for overlay to disappear. */
  async closePreview() {
    await this.previewCloseButton().click()
    await expect(this.previewAnimation()).toHaveCount(0, { timeout: 3_000 })
  }

  // ── Preview Accessibility ─────────────────────────────────────────────

  /** The preview overlay element (desktop or mobile). */
  previewDialog(): Locator {
    return this.page.locator('[data-testid="preview-desktop"], [data-testid="preview-mobile"]')
  }

  /** Preview mode switch container. */
  previewModeSwitch(): Locator {
    return this.page.locator('[data-testid="preview-mode-switch"]')
  }

  // ── View Menu (Theme + Accent) ─────────────────────────────────────

  /** The VIEW button in the top bar. */
  viewMenuButton(): Locator {
    return this.page.locator('[data-testid="menu-view"]')
  }

  /** The dropdown menu content (popover). */
  private dropdownContent(): Locator {
    return this.page.locator('[data-dropdown-content="true"]')
  }

  /** Open the VIEW dropdown menu and wait for it to be visible. */
  async openViewMenu() {
    await this.viewMenuButton().click()
    await expect(this.page.locator('[data-testid="dropdown-menu-stop-propagation"]')).toBeVisible({
      timeout: 3_000,
    })
  }

  /** Click a theme option inside the VIEW dropdown submenu. */
  async selectTheme(themeId: string) {
    await this.page.locator(`[data-testid="theme-${themeId}"]`).click()
  }

  /** Click an accent option inside the VIEW dropdown submenu. */
  async selectAccent(accentId: string) {
    await this.page.locator(`[data-testid="accent-${accentId}"]`).click()
  }

  /** Get the current theme mode from the [data-demo-ui] root element. */
  async currentTheme(): Promise<string> {
    const root = this.page.locator('[data-demo-ui]')
    return (await root.getAttribute('data-mode')) ?? ''
  }

  /** Get the current accent color from the [data-demo-ui] root element. */
  async currentAccent(): Promise<string> {
    const root = this.page.locator('[data-demo-ui]')
    return (await root.getAttribute('data-accent')) ?? ''
  }

  // ── Layout Store (Panel Toggle Persistence) ────────────────────────

  /** Get the zustand layout store state from localStorage. */
  async getLayoutStoreState(): Promise<Record<string, unknown> | null> {
    return this.page.evaluate(() => {
      const raw = localStorage.getItem('animation-catalog-layout')
      if (!raw) return null
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    })
  }

  /** Check if the sidebar is currently visible (any viewport). */
  async isSidebarVisible(): Promise<boolean> {
    return this.page
      .locator('[data-testid="left-panel"]:visible')
      .count()
      .then((c) => c > 0)
      .catch(() => false)
  }
}
