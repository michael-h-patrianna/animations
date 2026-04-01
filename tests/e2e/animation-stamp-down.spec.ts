import { test, expect } from './fixtures/catalog.fixture'

test.describe('Stamp Down Animation', () => {
  test('framer variant renders with visible stage content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__stamp-down')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    await expect(stage.locator(':scope > *')).not.toHaveCount(0)
  })

  test('stamp-down has meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__stamp-down')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(30)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('CSS variant renders with matching animation ID', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-css')

    const card = catalogPage.card('standard-effects__stamp-down')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    await expect(stage.locator(':scope > *')).not.toHaveCount(0)
  })

  test('replay button remounts the animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__stamp-down')
    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()

    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeVisible()
    await replay.click()

    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('stamp-down appears in both framer and css variant lists', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    const framerIds = await catalogPage.getAllAnimationIds()
    expect(framerIds).toContain('standard-effects__stamp-down')

    await catalogPage.gotoGroup('standard-effects-css')
    const cssIds = await catalogPage.getAllAnimationIds()
    expect(cssIds).toContain('standard-effects__stamp-down')
  })

  test('renders correctly in desktop preview', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__stamp-down')
    await catalogPage.cardStage(card)

    await catalogPage.openDesktopPreview(card)
    const previewAnimation = catalogPage.previewAnimation()
    await expect(previewAnimation).toBeVisible()

    const box = await previewAnimation.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(20)
    expect(box!.height).toBeGreaterThan(20)

    await catalogPage.closePreview()
  })

  test('renders correctly in mobile preview', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__stamp-down')
    await catalogPage.cardStage(card)

    await catalogPage.openMobilePreview(card)
    const mobileFrame = catalogPage.previewMobileFrame()
    await expect(mobileFrame).toBeVisible()

    const previewAnimation = catalogPage.previewAnimation()
    await expect(previewAnimation).toBeVisible()

    const box = await previewAnimation.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(20)
    expect(box!.height).toBeGreaterThan(20)

    await catalogPage.closePreview()
  })
})
