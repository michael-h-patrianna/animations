import { test, expect } from './fixtures/catalog.fixture'

test.describe('Animation Rendering', () => {
  test('renders Framer animation cards across multiple categories', async ({ catalogPage }) => {
    const scenarios = [
      { groupId: 'text-effects-framer', animationId: 'text-effects__character-reveal' },
      { groupId: 'modal-base-framer', animationId: 'modal-base__scale-gentle-pop' },
      { groupId: 'progress-bars-framer', animationId: 'progress-bars__timeline-progress' },
    ]

    for (const { groupId, animationId } of scenarios) {
      await catalogPage.gotoGroup(groupId)

      const card = catalogPage.card(animationId)
      await expect(card).toBeVisible()

      // cardStage already waits for rendered content (children > 0)
      await catalogPage.cardStage(card)
    }
  })

  test('renders CSS animation cards with correct DOM elements', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('button-effects-css')

    const card = catalogPage.card('button-effects__jitter')
    await expect(card).toBeVisible()

    const stage = await catalogPage.cardStage(card)
    // Button effect should render an actual button
    await expect(stage.locator('button')).toHaveCount(1)
  })

  test('replay remounts animation content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    await expect(card).toBeVisible()

    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()

    const stage = await catalogPage.cardStage(card)
    await replay.click()

    // After replay, stage should still have content (remounted, not empty)
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('interactive button-effects ripple creates ripple elements on click', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('button-effects-framer')

    const card = catalogPage.card('button-effects__ripple')
    const stage = await catalogPage.cardStage(card)

    // Ripple is click-to-trigger — replay is disabled
    await expect(catalogPage.replayButton(card)).toBeDisabled()

    // Click the button inside the animation to trigger a ripple
    const button = stage.locator('button')
    await expect(button).toBeVisible()

    const rippleContainer = stage.locator('.pf-ripple__overlay')
    const rippleCountBefore = await rippleContainer.locator('.pf-ripple__wave').count()

    await button.click()

    // A ripple element should appear after click
    await expect
      .poll(async () => rippleContainer.locator('.pf-ripple__wave').count(), { timeout: 2_000 })
      .toBeGreaterThan(rippleCountBefore)
  })

  test('typewriter renders visible character spans after replay', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__typewriter')
    await expect(card).toBeVisible()
    await catalogPage.cardStage(card)

    const replay = catalogPage.replayButton(card)
    await replay.click()

    // Character spans appear as the typewriter types
    const firstChar = card.locator('[data-testid="demo-stage"] .pf-typewriter__char').first()
    await expect(firstChar).toBeVisible({ timeout: 5_000 })
  })
})
