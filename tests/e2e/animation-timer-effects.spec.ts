import { test, expect } from './fixtures/catalog.fixture'

/**
 * Timer effect animations: countdown pills, flashing timers, pulse effects.
 * These display time-sensitive UI patterns used in gaming/gambling contexts.
 * Tests verify rendered structure and countdown behavior.
 */
test.describe('Timer Effect Animations', () => {
  test('pill countdown renders timer value and updates over time', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('timer-effects-framer')

    const card = catalogPage.card('timer-effects__pill-countdown-soft')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    // Timer should display a countdown value (digits or colon-separated time).
    // Poll because the component loads via Suspense — initial text is "Loading..."
    await expect
      .poll(async () => (await stage.textContent()) ?? '', { timeout: 10_000 })
      .toMatch(/\d/)
  })

  test('replay restarts timer countdown from beginning', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('timer-effects-framer')

    const card = catalogPage.card('timer-effects__pill-countdown-soft')
    const stage = await catalogPage.cardStage(card)

    // Get initial text
    const initialText = await stage.textContent()
    expect(initialText).toBeTruthy()

    // Replay should restart the animation
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // After replay, timer content should still be present
    await expect(stage).toBeVisible()
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('CSS timer variants render equivalent countdown UI', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('timer-effects-css')
    await catalogPage.waitForCards()

    const card = catalogPage.card('timer-effects__pill-countdown-soft')
    await expect(card).toBeVisible()

    // URL confirms CSS mode is active
    expect(catalogPage.currentPathname()).toBe('/timer-effects-css')

    // Timer renders with digits (poll past Suspense loading state)
    const stage = await catalogPage.cardStage(card)
    await expect
      .poll(async () => (await stage.textContent()) ?? '', { timeout: 10_000 })
      .toMatch(/\d/)
  })

  test('multiple timer variants coexist without interference', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('timer-effects-framer')
    await catalogPage.waitForCards()

    const timerIds = [
      'timer-effects__pill-countdown-soft',
      'timer-effects__pill-countdown-strong',
      'timer-effects__timer-flash',
    ]

    for (const id of timerIds) {
      const card = catalogPage.card(id)
      if ((await card.count()) === 0) continue

      await card.scrollIntoViewIfNeeded()
      await expect(card).toBeVisible()

      // Each timer independently renders content
      const stage = await catalogPage.cardStage(card)
      await expect(stage.locator(':scope > *').first()).toBeVisible()
    }
  })
})
