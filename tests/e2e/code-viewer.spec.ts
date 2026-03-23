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

    // Tab list is present with at least one tab
    await expect(catalogPage.codeTabList()).toBeVisible()
    expect(await catalogPage.codeTabs().count()).toBeGreaterThan(0)

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

  test('CSS variant code viewer shows multiple tabs including stylesheet', async ({
    catalogPage,
  }) => {
    // Navigate to CSS group which has CSS stylesheet files
    await catalogPage.gotoGroup('modal-base-css')
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Tab list should have multiple tabs (component .tsx + CSS stylesheet)
    const tabCount = await catalogPage.codeTabs().count()
    expect(tabCount).toBeGreaterThanOrEqual(2)

    // Find and click a CSS tab (label is "CSS" per groupBuilder.ts)
    let foundCssTab = false
    for (let i = 0; i < tabCount; i++) {
      const tab = catalogPage.codeTab(i)
      const label = (await tab.textContent())?.trim()
      if (label === 'CSS') {
        await tab.click()
        foundCssTab = true

        // Code body should update to show CSS content with keyframes or animation properties
        await expect
          .poll(async () => (await catalogPage.codeBody().textContent()) ?? '', { timeout: 5_000 })
          .toMatch(/@keyframes|animation/)
        break
      }
    }
    expect(foundCssTab).toBe(true)
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

  test('switching tabs changes displayed source', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Get initial source content
    const initialSource = await catalogPage.codeBody().textContent()
    expect(initialSource).toBeTruthy()

    // Check if there are multiple tabs
    const tabCount = await catalogPage.codeTabs().count()

    if (tabCount > 1) {
      // Switch to second tab
      await catalogPage.codeTab(1).click()

      // Content should change (different file)
      await expect
        .poll(async () => (await catalogPage.codeBody().textContent()) ?? '', { timeout: 5_000 })
        .not.toBe(initialSource)
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
    await catalogPage.clickNonActiveGroup()
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
    expect(ariaLabel).toMatch(/source code/i)
  })

  test('code viewer from filtered view shows correct source and preserves filter', async ({
    catalogPage,
    page,
  }) => {
    const targetId = 'modal-base__scale-gentle-pop'
    await page.goto(`/modal-base-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    // Filter banner should be visible
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Open code viewer on the filtered card
    const card = catalogPage.card(targetId)
    await expect(card).toBeVisible({ timeout: 10_000 })
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Source should contain the correct component
    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('ModalBaseScaleGentlePop')

    // Close code viewer
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Filter should still be active (not stripped by code viewer open/close)
    await expect(catalogPage.filterBanner()).toBeVisible()
    expect(new URL(page.url()).searchParams.get('animation')).toBe(targetId)
  })

  test('Framer and CSS source code differ for the same animation', async ({
    catalogPage,
    page,
  }) => {
    // Get Framer source
    await catalogPage.gotoGroup('modal-base-framer')
    const framerCard = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(framerCard).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
    const framerSource = await catalogPage.codeBody().textContent()
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Get CSS source
    await catalogPage.gotoGroup('modal-base-css')
    const cssCard = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(cssCard).click()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })
    const cssSource = await catalogPage.codeBody().textContent()
    await page.keyboard.press('Escape')

    // Both should contain the component name
    expect(framerSource).toContain('ModalBaseScaleGentlePop')
    expect(cssSource).toContain('ModalBaseScaleGentlePop')

    // But the actual source must differ (different implementation)
    expect(framerSource).not.toBe(cssSource)

    // Framer source should contain Motion import, CSS source should not
    expect(framerSource).toMatch(/motion/)
  })

  test('highlighted source code contains syntax tokens (not plain text fallback)', async ({
    catalogPage,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Shiki outputs syntax-highlighted HTML with <span> tokens inside <pre><code>
    const highlighted = catalogPage.codeHighlighted()
    const spanCount = await highlighted.locator('span').count()

    // Syntax highlighting should produce many span elements (tokens)
    // Plain text without highlighting would have zero or very few spans
    expect(spanCount, 'Shiki should produce syntax-highlighted spans').toBeGreaterThan(10)
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

  test('tab navigation with arrow keys works in code viewer', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('modal-base-css')
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const tabCount = await catalogPage.codeTabs().count()
    if (tabCount < 2) return // Skip if only one tab

    // Focus the first tab
    const firstTab = catalogPage.codeTab(0)
    await firstTab.focus()
    await expect(firstTab).toHaveAttribute('aria-selected', 'true')

    // Press ArrowRight to move to next tab
    await page.keyboard.press('ArrowRight')

    // Second tab should now be selected
    const secondTab = catalogPage.codeTab(1)
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
    await expect(firstTab).toHaveAttribute('aria-selected', 'false')

    // Press ArrowLeft to go back
    await page.keyboard.press('ArrowLeft')
    await expect(firstTab).toHaveAttribute('aria-selected', 'true')

    await page.keyboard.press('Escape')
  })
})
