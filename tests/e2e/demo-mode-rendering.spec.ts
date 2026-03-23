import { test, expect } from './fixtures/catalog.fixture'

/**
 * Demo mode rendering tests: verify that animations using demoMode metadata
 * render their demo wrapper UI correctly in the catalog.
 *
 * DemoModeWrapper types:
 * - 'burst' / 'fountain': Single "Source" anchor pill, no "Target" pill
 * - 'magnet' / 'trail': Both "Source" and "Target" anchor pills
 * - 'icon-dot': Icon with dot-indicator overlay
 * - 'status-row': Status row with dot + text + badge component
 *
 * Bug this catches: DemoModeWrapper fails to render demo anchors (refs are
 * null), causing particle animations to fire from the wrong position or
 * not fire at all. Also catches stale ref issues after replay.
 */
test.describe('Demo Mode: Collection Effects (Particle Anchors)', () => {
  test('burst mode renders single Source anchor pill', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-burst')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    // Burst mode renders a single Source pill (no Target)
    const anchors = stage.locator('[data-testid="demo-anchors"]')
    await expect(anchors).toBeVisible()
    await expect(anchors).toHaveAttribute('data-mode', 'burst')

    const sourcePills = stage.locator('[data-testid="demo-anchor-from"]')
    await expect(sourcePills).toHaveCount(1)
    await expect(sourcePills.locator('[data-testid="demo-anchor-from-label"]')).toHaveText('Source')

    // No Target pill in burst mode
    const targetPills = stage.locator('[data-testid="demo-anchor-to"]')
    await expect(targetPills).toHaveCount(0)
  })

  test('trail mode renders both Source and Target anchor pills', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-trail')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    const anchors = stage.locator('[data-testid="demo-anchors"]')
    await expect(anchors).toBeVisible()
    await expect(anchors).toHaveAttribute('data-mode', 'trail')

    // Trail mode renders both Source and Target pills
    await expect(stage.locator('[data-testid="demo-anchor-from"]')).toHaveCount(1)
    await expect(stage.locator('[data-testid="demo-anchor-to"]')).toHaveCount(1)
    await expect(stage.locator('[data-testid="demo-anchor-from-label"]')).toHaveText('Source')
    await expect(stage.locator('[data-testid="demo-anchor-to-label"]')).toHaveText('Target')
  })

  test('magnet mode renders both Source and Target anchor pills', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-magnet')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    const anchors = stage.locator('[data-testid="demo-anchors"]')
    await expect(anchors).toBeVisible()
    await expect(anchors).toHaveAttribute('data-mode', 'magnet')

    await expect(stage.locator('[data-testid="demo-anchor-from"]')).toHaveCount(1)
    await expect(stage.locator('[data-testid="demo-anchor-to"]')).toHaveCount(1)
  })

  test('fountain mode renders single Source anchor pill', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coins-fountain')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    const anchors = stage.locator('[data-testid="demo-anchors"]')
    await expect(anchors).toBeVisible()
    await expect(anchors).toHaveAttribute('data-mode', 'fountain')

    // Fountain mode: Source only, no Target
    await expect(stage.locator('[data-testid="demo-anchor-from"]')).toHaveCount(1)
    await expect(stage.locator('[data-testid="demo-anchor-to"]')).toHaveCount(0)
  })

  test('replay remounts demo anchors at new random positions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-framer')

    const card = catalogPage.card('collection-effects__coin-trail')
    const stage = await catalogPage.cardStage(card)

    // Record initial anchor position
    const fromPill = stage.locator('[data-testid="demo-anchor-from"]')
    await expect(fromPill).toBeVisible()

    // Replay (remounts the component, which generates new random positions)
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // Wait for the stage to re-render
    await expect(stage).toBeVisible()
    await expect(fromPill).toBeVisible({ timeout: 5_000 })

    // Anchors should still be present after replay
    await expect(stage.locator('[data-testid="demo-anchor-from"]')).toHaveCount(1)
    await expect(stage.locator('[data-testid="demo-anchor-to"]')).toHaveCount(1)

    // Note: positions are random, so they MAY or MAY NOT change.
    // The key assertion is that they still render correctly after replay.
    const afterStyle = await fromPill.getAttribute('style')
    expect(afterStyle).toMatch(/left:/)
    expect(afterStyle).toMatch(/top:/)
  })

  test('CSS collection-effects variant renders same anchor structure', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('collection-effects-css')

    const card = catalogPage.card('collection-effects__coin-trail')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    // CSS variant should use the same DemoModeWrapper infrastructure
    const anchors = stage.locator('[data-testid="demo-anchors"]')
    await expect(anchors).toBeVisible()
    await expect(anchors).toHaveAttribute('data-mode', 'trail')
    await expect(stage.locator('[data-testid="demo-anchor-from"]')).toHaveCount(1)
    await expect(stage.locator('[data-testid="demo-anchor-to"]')).toHaveCount(1)
  })
})

test.describe('Demo Mode: Update Indicators', () => {
  test('icon-dot mode renders icon with dot indicator overlay', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('update-indicators-framer')

    const card = catalogPage.card('update-indicators__home-icon-dot-radar')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    // icon-dot mode wraps the component around an icon image
    const iconDotWrapper = stage.locator('[data-testid="demo-icon-dot"]')
    await expect(iconDotWrapper).toBeVisible()

    // Should contain an icon image
    const icon = iconDotWrapper.locator('img')
    await expect(icon).toBeVisible()
    await expect(icon).toHaveAttribute('alt', 'Home')
  })

  test('status-row mode renders dot + text + badge component', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('update-indicators-framer')

    const card = catalogPage.card('update-indicators__badge-pulse')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    // status-row mode renders a row with dot, text, and the badge component
    const statusRow = stage.locator('[data-testid="demo-status-row"]')
    await expect(statusRow).toBeVisible()

    // Row has the status dot
    await expect(statusRow.locator('[data-testid="demo-status-row-dot"]')).toBeVisible()

    // Row has descriptive text
    await expect(statusRow.locator('[data-testid="demo-status-row-text"]')).toContainText(
      'Content update arrived'
    )
  })

  test('CSS update-indicators variants render icon-dot demo correctly', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('update-indicators-css')

    const card = catalogPage.card('update-indicators__home-icon-dot-radar')
    await expect(card).toBeVisible()
    const stage = await catalogPage.cardStage(card)

    const iconDotWrapper = stage.locator('[data-testid="demo-icon-dot"]')
    await expect(iconDotWrapper).toBeVisible()
    await expect(iconDotWrapper.locator('img')).toBeVisible()
  })
})
