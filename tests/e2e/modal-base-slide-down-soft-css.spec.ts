import { expect, test, type Locator, type Page } from '@playwright/test'

const animationId = 'modal-base__slide-down-soft'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const slideDownSoftCard = (page: Page) =>
  page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const waitForRenderedStage = async (card: Locator) => {
  await card.scrollIntoViewIfNeeded()

  const stage = stageForCard(card)
  await expect(stage).toBeVisible()
  await expect.poll(async () => stage.locator(':scope > *').count(), { timeout: 5000 }).toBeGreaterThan(0)

  return stage
}

test.describe('ModalBaseSlideDownSoft CSS Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modal-base-css')
    await expect.poll(() => currentPathname(page)).toBe('/modal-base-css')
    await page.waitForSelector(`.pf-card[data-animation-id="${animationId}"]`, { timeout: 10000 })
  })

  test('renders CSS slide-down-soft modal structure', async ({ page }) => {
    const card = slideDownSoftCard(page)
    await expect(card).toBeVisible()

    const stage = await waitForRenderedStage(card)
    const overlay = stage.locator('.pf-modal-overlay.modal-base-slide-down-soft-overlay')
    const modal = stage.locator('.pf-modal.modal-base-slide-down-soft-modal')

    await expect(overlay).toBeVisible()
    await expect(modal).toBeVisible()
    await expect(modal.locator('.pf-modal__title')).toContainText('New Creator Quest')
  })

  test('keeps animation-id and CSS class contracts for overlay and modal', async ({ page }) => {
    const card = slideDownSoftCard(page)
    const stage = await waitForRenderedStage(card)

    const overlay = stage.locator('.modal-base-slide-down-soft-overlay')
    const modal = stage.locator('.modal-base-slide-down-soft-modal')

    await expect(overlay).toHaveAttribute('data-animation-id', animationId)
    await expect(modal).toBeVisible()
  })

  test('replay keeps modal content rendered', async ({ page }) => {
    const card = slideDownSoftCard(page)
    const stage = await waitForRenderedStage(card)
    const replayButton = card.locator('[data-role="replay"]')

    await expect(replayButton).toBeEnabled()
    await replayButton.click()

    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
    await expect(stage.locator('.pf-modal')).toBeVisible()
  })

  test('card metadata reflects slide-down-soft CSS metadata', async ({ page }) => {
    const card = slideDownSoftCard(page)

    await expect(card.locator('.pf-card__title')).toContainText('Slide Down Welcome')
    await expect(card.locator('.pf-card__description')).toContainText('Slides in from the top')
    await expect(card.locator('.pf-card__meta')).toContainText('CSS')
  })

  test('CSS animation exposes expected will-change hints', async ({ page }) => {
    const card = slideDownSoftCard(page)
    const stage = await waitForRenderedStage(card)

    const overlay = stage.locator('.modal-base-slide-down-soft-overlay')
    const modal = stage.locator('.modal-base-slide-down-soft-modal')

    const overlayWillChange = await overlay.evaluate((element) => window.getComputedStyle(element).willChange)
    const modalWillChange = await modal.evaluate((element) => window.getComputedStyle(element).willChange)

    expect(overlayWillChange).toContain('opacity')
    expect(modalWillChange).toContain('transform')
    expect(modalWillChange).toContain('opacity')
  })
})
