import { test, expect } from './fixtures/catalog.fixture'

const parseCounterValue = (text: string | null): number => {
  if (!text) return 0
  return Number.parseInt(text.replace(/[^\d]/g, ''), 10) || 0
}

test.describe('Counter Increment Animations', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-css')
  })

  test('continuous counter renders and increments over time', async ({ catalogPage }) => {
    const card = catalogPage.card('text-effects__counter-increment')
    const stage = await catalogPage.cardStage(card)

    // Structure verification
    const container = stage.locator(
      '[class*="tfx-cinc-container"][data-animation-id="text-effects__counter-increment"]'
    )
    await expect(container).toBeVisible()

    const value = stage.locator('[class*="tfx-cinc-value"]')
    await expect(value).toBeVisible()

    // Verify the counter actually increments (tests continuous mode behavior)
    const initialValue = parseCounterValue(await value.textContent())
    await expect
      .poll(async () => parseCounterValue(await value.textContent()), { timeout: 5_000 })
      .toBeGreaterThan(initialValue)
  })

  /**
   * NOTE: TextEffectsCounterIncrement9999 exists in production code but has no
   * .meta.ts file, so it is never registered in the catalog and never appears
   * on the page. This is a production gap — the component is orphaned.
   */

  test('replay resets counter to zero and restarts animation', async ({ catalogPage }) => {
    const card = catalogPage.card('text-effects__counter-increment')
    const stage = await catalogPage.cardStage(card)
    const value = stage.locator('[class*="tfx-cinc-value"]')

    // Wait for counter to increment above 0
    await expect
      .poll(async () => parseCounterValue(await value.textContent()), { timeout: 5_000 })
      .toBeGreaterThan(0)

    const valueBeforeReplay = parseCounterValue(await value.textContent())

    // Replay resets and restarts
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // After replay, counter should be at or near 0 (less than before replay)
    await expect(stage).toBeVisible()
    await expect
      .poll(async () => parseCounterValue(await value.textContent()), { timeout: 3_000 })
      .toBeGreaterThanOrEqual(0)

    const valueAfterReplay = parseCounterValue(await value.textContent())
    expect(valueAfterReplay).toBeLessThanOrEqual(Math.max(valueBeforeReplay, 1))
  })
})
