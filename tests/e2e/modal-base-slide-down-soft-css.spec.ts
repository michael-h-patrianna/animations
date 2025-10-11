import { expect, test } from '@playwright/test'

test.describe('ModalBaseSlideDownSoft CSS Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 })
  })

  test('renders CSS version of slide-down-soft animation', async ({ page }) => {
    // Switch to CSS mode
    await page.click('.pf-code-mode-switch__option:has-text("CSS")')
    await page.waitForTimeout(500)

    // Navigate to Base modals (css) group
    await page
      .locator('.pf-main .pf-sidebar .pf-sidebar__link--group:has-text("Base modals (css)")')
      .first()
      .click()
    await page.waitForTimeout(500)

    // Find Slide Down Soft animation
    const card = page
      .locator('.pf-card[data-animation-id="modal-base-css__slide-down-soft"]')
      .first()
    await expect(card).toBeVisible()

    // Verify the animation component renders
    const stage = card.locator('.pf-demo-stage')
    await expect(stage).toBeVisible()

    // Check that there's actual modal content
    const stageContent = await stage.innerHTML()
    expect(stageContent.trim().length).toBeGreaterThan(0)
    expect(stageContent).not.toContain('pf-card__placeholder')

    // Verify modal overlay is present
    const overlay = stage.locator('.pf-modal-overlay')
    await expect(overlay).toBeVisible()

    // Verify modal content is present
    const modal = stage.locator('.pf-modal')
    await expect(modal).toBeVisible()

    // Verify modal has mock content
    const modalTitle = modal.locator('.pf-modal__title')
    await expect(modalTitle).toContainText('New Creator Quest')
  })

  test('CSS animation has correct CSS classes applied', async ({ page }) => {
    // Switch to CSS mode
    await page.click('.pf-code-mode-switch__option:has-text("CSS")')
    await page.waitForTimeout(500)

    // Navigate to Base modals (css)
    await page
      .locator('.pf-main .pf-sidebar .pf-sidebar__link--group:has-text("Base modals (css)")')
      .first()
      .click()
    await page.waitForTimeout(500)

    const card = page
      .locator('.pf-card[data-animation-id="modal-base-css__slide-down-soft"]')
      .first()
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')

    // Verify animation-specific CSS classes
    const overlay = stage.locator('.modal-base-slide-down-soft-overlay')
    await expect(overlay).toBeVisible()

    const modal = stage.locator('.modal-base-slide-down-soft-modal')
    await expect(modal).toBeVisible()

    // Verify data-animation-id attribute
    await expect(overlay).toHaveAttribute('data-animation-id', 'modal-base__slide-down-soft')
  })

  test('replay button restarts the CSS animation', async ({ page }) => {
    // Switch to CSS mode
    await page.click('.pf-code-mode-switch__option:has-text("CSS")')
    await page.waitForTimeout(500)

    // Navigate to Base modals (css)
    await page
      .locator('.pf-main .pf-sidebar .pf-sidebar__link--group:has-text("Base modals (css)")')
      .first()
      .click()
    await page.waitForTimeout(500)

    const card = page
      .locator('.pf-card[data-animation-id="modal-base-css__slide-down-soft"]')
      .first()
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')
    const replayButton = card.locator('[data-role="replay"]')

    // Wait for initial animation to complete
    await page.waitForTimeout(600)

    // Get initial state
    const initialContent = await stage.innerHTML()
    expect(initialContent.trim().length).toBeGreaterThan(0)

    // Click replay
    await replayButton.click()

    // Wait for animation to restart
    await page.waitForTimeout(300)

    // Stage should still be visible
    await expect(stage).toBeVisible()

    // Modal should still be visible
    const modal = stage.locator('.pf-modal')
    await expect(modal).toBeVisible()

    // Content should be intact
    const afterReplayContent = await stage.innerHTML()
    expect(afterReplayContent.trim().length).toBeGreaterThan(0)
  })

  test('animation runs smoothly without visual glitches', async ({ page }) => {
    // Switch to CSS mode
    await page.click('.pf-code-mode-switch__option:has-text("CSS")')
    await page.waitForTimeout(500)

    // Navigate to Base modals (css)
    await page
      .locator('.pf-main .pf-sidebar .pf-sidebar__link--group:has-text("Base modals (css)")')
      .first()
      .click()
    await page.waitForTimeout(500)

    const card = page
      .locator('.pf-card[data-animation-id="modal-base-css__slide-down-soft"]')
      .first()
    await expect(card).toBeVisible()

    const stage = card.locator('.pf-demo-stage')
    const modal = stage.locator('.pf-modal')

    // Wait for animation to start
    await page.waitForTimeout(100)

    // Check that modal has GPU-accelerated properties
    const hasTransform = await modal.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return computed.transform !== 'none'
    })
    expect(hasTransform).toBe(true)

    // Verify will-change is set for performance
    const hasWillChange = await modal.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return computed.willChange !== 'auto'
    })
    expect(hasWillChange).toBe(true)

    // Wait for animation to complete
    await page.waitForTimeout(500)

    // Modal should be fully visible
    await expect(modal).toBeVisible()
  })

  test('CSS animation matches metadata specifications', async ({ page }) => {
    // Switch to CSS mode
    await page.click('.pf-code-mode-switch__option:has-text("CSS")')
    await page.waitForTimeout(500)

    // Navigate to Base modals (css)
    await page
      .locator('.pf-main .pf-sidebar .pf-sidebar__link--group:has-text("Base modals (css)")')
      .first()
      .click()
    await page.waitForTimeout(500)

    const card = page
      .locator('.pf-card[data-animation-id="modal-base-css__slide-down-soft"]')
      .first()
    await expect(card).toBeVisible()

    // Verify card title matches metadata
    const title = card.locator('.pf-card__title')
    await expect(title).toContainText('Slide Down Welcome')

    // Verify description contains key information
    const description = card.locator('.pf-card__desc')
    await expect(description).toBeVisible()

    // Verify tag shows 'css'
    const badge = card.locator('.pf-badge-tech')
    await expect(badge).toContainText('css')
  })
})
