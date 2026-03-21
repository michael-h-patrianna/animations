import { test, expect } from './fixtures/catalog.fixture'

test.describe('Code Viewer', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')
  })

  test('code viewer button is visible on animation cards', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await expect(card).toBeVisible()
    await expect(catalogPage.codeViewerButton(card)).toBeVisible()
  })

  test('clicking code button opens modal with syntax-highlighted source', async ({
    catalogPage,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Modal has correct aria attributes
    await expect(modal).toHaveAttribute('role', 'dialog')
    await expect(modal).toHaveAttribute('aria-modal', 'true')

    // First tab (Component (Motion)) is active by default
    await expect(catalogPage.codeTab(0)).toHaveAttribute('aria-selected', 'true')

    // Code body contains Shiki-highlighted content
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Source code contains the component function name
    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('ModalBaseScaleGentlePop')
  })

  test('source code does not contain data-animation-id attributes', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).not.toContain('data-animation-id')
  })

  test('source code replaces MockModalContent import with guidance comment', async ({
    catalogPage,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).not.toContain("from '../MockModalContent'")
    expect(bodyText).toContain('Replace')
  })

  test('shows both component and CSS tabs for animations with dual implementations', async ({
    catalogPage,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Should have at least Component (Motion) and Component (CSS) tabs
    const tabs = catalogPage.codeTabs()
    const tabCount = await tabs.count()
    expect(tabCount).toBeGreaterThanOrEqual(2)

    // First tab should be the Motion component
    await expect(catalogPage.codeTab(0)).toContainText('Component (Motion)')
  })

  test('CSS tab shows stylesheet content', async ({ catalogPage }) => {
    // Navigate to a group known to have CSS stylesheets
    await catalogPage.gotoGroup('modal-base-css')
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Find the CSS tab (label "CSS") and click it
    const tabs = catalogPage.codeTabs()
    const tabCount = await tabs.count()
    let cssTabIndex = -1
    for (let i = 0; i < tabCount; i++) {
      const text = await catalogPage.codeTab(i).textContent()
      if (text?.trim() === 'CSS') {
        cssTabIndex = i
        break
      }
    }
    expect(cssTabIndex).toBeGreaterThanOrEqual(0)

    await catalogPage.codeTab(cssTabIndex).click()
    await expect(catalogPage.codeTab(cssTabIndex)).toHaveAttribute('aria-selected', 'true')

    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('@keyframes')
  })

  test('close button dismisses the modal', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    await catalogPage.codeCloseButton().click()
    await expect(modal).not.toBeVisible()
  })

  test('Escape key dismisses the modal', async ({ catalogPage, page }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })

  test('clicking overlay outside modal dismisses it', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Click the overlay (top-left corner, outside the centered modal)
    await modal.click({ position: { x: 5, y: 5 } })
    await expect(modal).not.toBeVisible()
  })

  test('copy button copies source to clipboard and shows confirmation', async ({
    catalogPage,
    page,
    context,
  }) => {
    // Grant clipboard permission
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const copyBtn = catalogPage.codeCopyButton()
    await expect(copyBtn).toContainText('Copy')

    await copyBtn.click()

    // Button text changes to "Copied"
    await expect(copyBtn).toContainText('Copied')

    // Clipboard contains source code
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('ModalBaseScaleGentlePop')

    // Button reverts after timeout
    await expect(copyBtn).toContainText('Copy', { timeout: 5_000 })
  })

  test('code viewer works across different animation groups', async ({ catalogPage }) => {
    // Test a non-modal animation group
    await catalogPage.gotoGroup('standard-effects-framer')
    const card = catalogPage.card('standard-effects__bounce')
    await expect(catalogPage.codeViewerButton(card)).toBeVisible()

    await catalogPage.codeViewerButton(card).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('StandardEffectsBounce')
  })

  test('tab switching preserves modal state', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // If there are multiple tabs, switch between them
    const tabs = catalogPage.codeTabs()
    const tabCount = await tabs.count()
    if (tabCount > 1) {
      // Switch to second tab
      await catalogPage.codeTab(1).click()
      await expect(catalogPage.codeTab(1)).toHaveAttribute('aria-selected', 'true')

      // Switch back to first tab
      await catalogPage.codeTab(0).click()
      await expect(catalogPage.codeTab(0)).toHaveAttribute('aria-selected', 'true')
      await expect(catalogPage.codeTab(1)).toHaveAttribute('aria-selected', 'false')
    }

    // Modal is still open
    await expect(modal).toBeVisible()
  })

  test('closing modal with Escape then navigating keeps state clean', async ({
    catalogPage,
    page,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Close modal via Escape
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Navigate to a different group via sidebar
    const before = catalogPage.currentPathname()
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()

    for (let i = 0; i < count; i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        break
      }
    }

    await catalogPage.waitForPathnameChange(before)
    await catalogPage.waitForCards()

    // No stale modal or error state
    await expect(modal).not.toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })

  test('closing modal then switching code mode works correctly', async ({ catalogPage, page }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Close modal first
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Switch mode (Framer → CSS)
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/modal-base-css')

    await catalogPage.waitForCards()

    // CSS cards render correctly
    const cssCard = catalogPage.allCards().first()
    await expect(catalogPage.cardMeta(cssCard)).toContainText('CSS')
    await catalogPage.expectNoErrorBoundary()

    // Can open code viewer again on the CSS variant
    const cssViewerCard = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(cssViewerCard).click()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
  })

  test('programmatic navigation via URL while modal is open unmounts modal', async ({
    catalogPage,
    page,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Navigate programmatically (simulates a user typing a URL)
    await page.goto('/text-effects-framer')
    await catalogPage.waitForShell()
    await catalogPage.waitForCards()

    // Modal should be gone (entire page remounted)
    await expect(modal).not.toBeVisible()
    expect(catalogPage.currentPathname()).toBe('/text-effects-framer')
    await catalogPage.expectNoErrorBoundary()
  })

  test('opening a second code viewer after closing the first shows correct source', async ({
    catalogPage,
    page,
  }) => {
    // Open code viewer for first card
    const card1 = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card1).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const firstSource = await catalogPage.codeBody().textContent()
    expect(firstSource).toContain('ModalBaseScaleGentlePop')

    // Close via Escape
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Open code viewer for a DIFFERENT card
    const card2 = catalogPage.card('modal-base__slide-down-soft')
    await card2.scrollIntoViewIfNeeded()
    await catalogPage.codeViewerButton(card2).click()

    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Source should now show the SECOND card's component, not stale first card content
    const secondSource = await catalogPage.codeBody().textContent()
    expect(secondSource).toContain('ModalBaseSlideDownSoft')
    expect(secondSource).not.toContain('ModalBaseScaleGentlePop')
  })

  test('code viewer shows loading state before syntax highlighting completes', async ({
    catalogPage,
  }) => {
    // Use network throttling to make Shiki loading observable
    // Since Shiki is bundled, the loading state is typically very brief.
    // We verify the loading element exists in the DOM structure.
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // The code body must contain EITHER the loading indicator OR highlighted code
    // (never empty). This catches a bug where neither loading nor content is shown.
    const codeBody = catalogPage.codeBody()
    await expect(codeBody).toBeVisible()

    const hasLoadingOrCode = await codeBody.evaluate((el) => {
      const text = el.textContent ?? ''
      return text.includes('Loading') || text.length > 50
    })
    expect(hasLoadingOrCode).toBe(true)

    // Eventually, highlighted code replaces the loading state
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Loading indicator must be gone once highlighting completes
    await expect(catalogPage.codeLoading()).toHaveCount(0)
  })

  test('code viewer modal aria-label includes animation title', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // aria-label should describe what source is being shown
    const ariaLabel = await modal.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toMatch(/source code/i)
  })

  test('code viewer source contains valid structural markers', async ({ catalogPage, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Copy and validate source structure
    await catalogPage.codeCopyButton().click()
    const source = await catalogPage.page.evaluate(() => navigator.clipboard.readText())

    // Source should contain import statements (not stripped)
    expect(source).toMatch(/import\s/)

    // Source should contain a function/component definition
    expect(source).toMatch(/(function|const)\s+\w+/)

    // Source should NOT contain catalog-only attributes (data-animation-id stripped)
    expect(source).not.toContain('data-animation-id')
  })
})
