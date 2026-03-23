import { test, expect } from './fixtures/catalog.fixture'

test.describe('Level Breakthrough Animation', () => {
  test('framer variant renders and transitions to LEVEL 2', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__level-breakthrough')
    const stage = await catalogPage.cardStage(card)

    const container = stage.locator('.pf-breakthrough-container')
    const levelText = container.locator('.pf-level-breakthrough')

    await expect(container).toBeVisible()
    await expect(levelText).toBeVisible()

    // Animation transitions to show "LEVEL 2"
    await expect
      .poll(async () => ((await levelText.textContent()) ?? '').trim(), { timeout: 3_000 })
      .toContain('LEVEL 2')
  })

  test('framer variant has two surge layers', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__level-breakthrough')
    const stage = await catalogPage.cardStage(card)

    await expect(stage.locator('.pf-surge-lines')).toHaveCount(2)
  })

  test('css variant renders with namespaced classes and transition text', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-css')

    const card = catalogPage.card('text-effects__level-breakthrough')
    const stage = await catalogPage.cardStage(card)

    const container = stage.locator('.tfx-breakthrough-container')
    await expect(container).toBeVisible()

    await expect(container.locator('.tfx-breakthrough-text-start')).toContainText('LEVEL 1')
    await expect(container.locator('.tfx-breakthrough-text-end')).toContainText('LEVEL 2')
    await expect(container.locator('.tfx-breakthrough-surge-outer')).toHaveCount(1)
    await expect(container.locator('.tfx-breakthrough-surge-inner')).toHaveCount(1)
  })

  test('css breakthrough replay restarts the transition animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-css')

    const card = catalogPage.card('text-effects__level-breakthrough')
    const stage = await catalogPage.cardStage(card)

    // Surge elements exist (animation is playing)
    await expect(stage.locator('.tfx-breakthrough-surge-outer')).toBeVisible()

    // Replay restarts the animation
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // After replay, container re-appears with the transition text
    await expect(stage.locator('.tfx-breakthrough-container')).toBeVisible()
    await expect(stage.locator('.tfx-breakthrough-text-start')).toContainText('LEVEL 1')
  })
})

test.describe('XP Number Pop Animation', () => {
  test('framer variant renders expected xp-pop structure', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__xp-number-pop')
    const stage = await catalogPage.cardStage(card)

    await expect(stage.locator('.pf-xp-pop')).toBeVisible()
    await expect(stage.locator('.pf-xp-pop__number-wrapper')).toBeVisible()
    await expect(stage.locator('.pf-xp-pop__number-value')).toBeVisible()
    await expect(stage.locator('.pf-xp-pop__label')).toHaveText('XP')
  })

  test('css variant renders and counts up to target value', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-css')

    const card = catalogPage.card('text-effects__xp-number-pop')
    const stage = await catalogPage.cardStage(card)

    await expect(stage.locator('.tfx-xp-container')).toBeVisible()
    await expect(stage.locator('.tfx-xp-label')).toHaveText('XP')

    const value = stage.locator('.tfx-xp-number-value')
    const parseValue = (text: string | null) =>
      Number.parseInt((text ?? '').replace(/[^\d]/g, ''), 10) || 0

    // Should count up close to final value (235+)
    await expect
      .poll(async () => parseValue(await value.textContent()), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(235)
  })

  test('css variant particles have positional CSS variables', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-css')

    const card = catalogPage.card('text-effects__xp-number-pop')
    const stage = await catalogPage.cardStage(card)
    const particles = stage.locator('.tfx-xp-particle')

    // Wait for particles to appear
    await expect.poll(async () => particles.count(), { timeout: 3_000 }).toBeGreaterThan(0)

    const style = await particles.first().getAttribute('style')
    expect(style).toContain('--particle-x')
    expect(style).toContain('--particle-y')
    expect(style).toContain('animation-delay')
  })
})
