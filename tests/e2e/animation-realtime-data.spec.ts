import { test, expect } from './fixtures/catalog.fixture'

test.describe('Realtime Data', () => {
  test('leaderboard-shift renders ranked rows with player data', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('realtime-data-framer')

    const card = catalogPage.card('realtime-data__leaderboard-shift')
    const stage = await catalogPage.cardStage(card)

    // Leaderboard should render row elements
    const rows = stage.locator('.pf-realtime-data__row')
    await expect.poll(async () => rows.count(), { timeout: 5_000 }).toBeGreaterThanOrEqual(3)

    // Each row has rank, player label, and score
    const firstRow = rows.first()
    await expect(firstRow.locator('.pf-realtime-data__rank')).toBeVisible()
    await expect(firstRow.locator('.pf-realtime-data__player')).toBeVisible()
    await expect(firstRow.locator('.pf-realtime-data__score')).toBeVisible()
  })

  test('leaderboard cycles entries over time', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('realtime-data-framer')

    const card = catalogPage.card('realtime-data__leaderboard-shift')
    const stage = await catalogPage.cardStage(card)

    // Capture initial first row text
    const firstRow = stage.locator('.pf-realtime-data__row').first()
    await expect(firstRow).toBeVisible({ timeout: 5_000 })
    const initialPlayer = await firstRow.locator('.pf-realtime-data__player').textContent()
    expect(initialPlayer).toBeTruthy()

    // Poll until the first row text changes (cycle happened)
    await expect
      .poll(
        async () => {
          const rows = stage.locator('.pf-realtime-data__row')
          const count = await rows.count()
          if (count === 0) return initialPlayer
          return rows.first().locator('.pf-realtime-data__player').textContent()
        },
        { timeout: 10_000 }
      )
      .not.toBe(initialPlayer)
  })

  test('all framer variants render with visible content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('realtime-data-framer')

    const cards = catalogPage.scopedCards('realtime-data-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(3)

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      const stage = card.locator('[data-testid="demo-stage"]')
      await expect(stage).toBeVisible({ timeout: 5_000 })
      await expect
        .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
        .toBeGreaterThan(0)
    }
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('realtime-data-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('realtime-data-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })
})
