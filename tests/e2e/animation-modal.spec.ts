import { test, expect } from './fixtures/catalog.fixture'

test.describe('Modal Base Animations', () => {
  test('CSS slide-down-soft renders overlay, modal, and title', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    const overlay = stage.locator('.pf-modal-overlay.modal-base-slide-down-soft-overlay')
    const modal = stage.locator('.pf-modal.modal-base-slide-down-soft-modal')

    await expect(overlay).toBeVisible()
    await expect(modal).toBeVisible()
    await expect(modal.locator('.pf-modal__title')).toContainText('New Creator Quest')
  })

  test('CSS slide-down-soft exposes GPU-friendly will-change hints', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    const stage = await catalogPage.cardStage(card)

    const overlay = stage.locator('.modal-base-slide-down-soft-overlay')
    const modal = stage.locator('.modal-base-slide-down-soft-modal')

    const overlayWillChange = await overlay.evaluate((el) => window.getComputedStyle(el).willChange)
    const modalWillChange = await modal.evaluate((el) => window.getComputedStyle(el).willChange)

    expect(overlayWillChange).toContain('opacity')
    expect(modalWillChange).toContain('transform')
    expect(modalWillChange).toContain('opacity')
  })

  test('Framer scale-gentle-pop renders modal structure', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    // Framer modal should have rendered content
    await expect(stage.locator('.pf-card__placeholder')).toHaveCount(0)
  })

  test('CSS modal card metadata shows correct title and CSS tag', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    await expect(catalogPage.cardTitle(card)).toContainText('Slide Down Welcome')
    await expect(catalogPage.cardDescription(card)).toContainText('Slides in from the top')
    await expect(catalogPage.cardMeta(card)).toContainText('CSS')
  })

  test('replay keeps modal content mounted after click', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    const stage = await catalogPage.cardStage(card)
    const replay = catalogPage.replayButton(card)

    await expect(replay).toBeEnabled()
    await replay.click()

    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
    await expect(stage.locator('.pf-modal')).toBeVisible()
  })
})
