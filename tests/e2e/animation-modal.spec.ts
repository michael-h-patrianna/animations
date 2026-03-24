import { test, expect } from './fixtures/catalog.fixture'

test.describe('Modal Base Animations', () => {
  test('CSS slide-down-soft renders animation container with modal content', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)

    // The animation renders a container with the modal placeholder content
    // MockModalContent renders "New Creator Quest" title inside the modal
    await expect(stage).toContainText('New Creator Quest')
  })

  test('CSS slide-down-soft renders visible content (not zero-size)', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    const stage = await catalogPage.cardStage(card)

    // The stage should have non-zero dimensions (animation completed and content is shown)
    const box = await stage.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(50)
    expect(box!.height).toBeGreaterThan(50)
  })

  test('Framer scale-gentle-pop renders modal structure', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await expect(card).toBeVisible()

    // cardStage already waits for rendered content (children > 0)
    await catalogPage.cardStage(card)
  })

  test('CSS modal card metadata shows correct title and description', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__slide-down-soft')
    await expect(catalogPage.cardTitle(card)).toContainText('Slide Down Soft')
    await expect(catalogPage.cardDescription(card)).toContainText('slides down')
    // URL confirms CSS mode
    expect(catalogPage.currentPathname()).toBe('/modal-base-css')
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
  })
})
