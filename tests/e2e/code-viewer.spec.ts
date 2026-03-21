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
})
