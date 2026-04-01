import { test, expect } from './fixtures/catalog.fixture'

test.describe('Floating Combat Text Animation', () => {
  test.describe('Framer variant', () => {
    test('renders combat text element with correct structure', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-framer')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      const combatText = stage.locator('[data-testid="combat-text"]').first()
      await expect(combatText).toBeAttached()

      const textValue = combatText.locator('[data-testid="combat-text-value"]')
      await expect(textValue).toBeAttached()
    })

    test('demo mode spawns multiple instances', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-framer')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      const demoContainer = stage.locator('[data-testid="demo-combat-text"]')
      await expect(demoContainer).toBeVisible()

      await expect
        .poll(
          async () => {
            const combatTexts = demoContainer.locator('[data-testid="combat-text"]')
            return combatTexts.count()
          },
          { timeout: 5_000 }
        )
        .toBeGreaterThan(1)
    })

    test('combat text displays text content', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-framer')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      const demoContainer = stage.locator('[data-testid="demo-combat-text"]')
      await expect(demoContainer).toBeVisible()

      await expect
        .poll(
          async () => {
            const firstText = demoContainer.locator('[data-testid="combat-text-value"]').first()
            const count = await demoContainer.locator('[data-testid="combat-text-value"]').count()
            if (count === 0) return ''
            return (await firstText.textContent()) ?? ''
          },
          { timeout: 5_000 }
        )
        .toMatch(/^[+-]?\d+$/)
    })

    test('replay restarts the animation', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-framer')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      await expect(stage.locator('[data-testid="demo-combat-text"]')).toBeVisible()

      const replay = catalogPage.replayButton(card)
      await expect(replay).toBeEnabled()
      await replay.click()

      await expect(stage.locator('[data-testid="demo-combat-text"]')).toBeVisible()
    })
  })

  test.describe('CSS variant', () => {
    test('renders combat text element with correct structure', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-css')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      const combatText = stage.locator('[data-testid="combat-text"]').first()
      await expect(combatText).toBeAttached()

      const textValue = combatText.locator('[data-testid="combat-text-value"]')
      await expect(textValue).toBeAttached()
    })

    test('demo mode spawns multiple instances', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-css')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      const demoContainer = stage.locator('[data-testid="demo-combat-text"]')
      await expect(demoContainer).toBeVisible()

      await expect
        .poll(
          async () => {
            const combatTexts = demoContainer.locator('[data-testid="combat-text"]')
            return combatTexts.count()
          },
          { timeout: 5_000 }
        )
        .toBeGreaterThan(1)
    })

    test('CSS variant text has animation CSS variables set', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-css')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      const demoContainer = stage.locator('[data-testid="demo-combat-text"]')

      await expect
        .poll(async () => demoContainer.locator('[data-testid="combat-text-value"]').count(), {
          timeout: 5_000,
        })
        .toBeGreaterThan(0)

      const textEl = demoContainer.locator('[data-testid="combat-text-value"]').first()
      const style = await textEl.getAttribute('style')
      expect(style).toContain('--tfx-combattext-drift-x')
      expect(style).toContain('--tfx-combattext-float-distance')
      expect(style).toContain('--tfx-combattext-pop-scale')
    })

    test('replay restarts the animation', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('text-effects-css')

      const card = catalogPage.card('text-effects__floating-combat-text')
      const stage = await catalogPage.cardStage(card)

      await expect(stage.locator('[data-testid="demo-combat-text"]')).toBeVisible()

      const replay = catalogPage.replayButton(card)
      await expect(replay).toBeEnabled()
      await replay.click()

      await expect(stage.locator('[data-testid="demo-combat-text"]')).toBeVisible()
    })
  })
})
