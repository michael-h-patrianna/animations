import { test, expect } from './fixtures/catalog.fixture'

test.describe('Standard Effects', () => {
  test('all framer variants render with visible stage content', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const cards = catalogPage.scopedCards('standard-effects-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(15)

    // Spot-check: first and last card have rendered stage content
    for (const card of [cards.first(), cards.last()]) {
      const stage = await catalogPage.cardStage(card)
      await expect(stage.locator(':scope > *')).not.toHaveCount(0)
    }
  })

  test('bounce animation has meaningful dimensions', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(30)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('replay button remounts the animation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()

    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeVisible()
    await replay.click()

    // After replay, stage content should still be present (remount succeeded)
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
  })

  test('CSS and Framer variants produce matching animation IDs', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')
    const framerIds = await catalogPage.getAllAnimationIds()

    await catalogPage.gotoGroup('standard-effects-css')
    const cssIds = await catalogPage.getAllAnimationIds()

    expect(framerIds.sort()).toEqual(cssIds.sort())
  })

  test('screen flash renders with visible overlay in framer mode', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__screen-flash')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(30)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('screen flash renders with visible overlay in css mode', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-css')

    const card = catalogPage.card('standard-effects__screen-flash')
    const stage = await catalogPage.cardStage(card)
    const box = await stage.boundingBox()

    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(30)
    expect(box!.height).toBeGreaterThan(30)
  })

  test('screen flash overlay fades to invisible after animation completes', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__screen-flash')
    await catalogPage.cardStage(card)

    await expect
      .poll(
        async () => {
          const overlay = card.locator('[aria-hidden="true"]').first()
          const opacity = await overlay.evaluate((el) => window.getComputedStyle(el).opacity)
          return Number(opacity)
        },
        { timeout: 5_000 }
      )
      .toBeLessThan(0.1)
  })

  test.describe('Starburst animation', () => {
    test('framer variant renders SVG rays with meaningful dimensions', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('standard-effects-framer')

      const card = catalogPage.card('standard-effects__starburst')
      const stage = await catalogPage.cardStage(card)
      const box = await stage.boundingBox()

      expect(box).not.toBeNull()
      expect(box!.width).toBeGreaterThan(50)
      expect(box!.height).toBeGreaterThan(50)

      const rayCount = await card.locator('svg path').count()
      expect(rayCount).toBeGreaterThanOrEqual(4)
    })

    test('CSS variant renders SVG rays with meaningful dimensions', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('standard-effects-css')

      const card = catalogPage.card('standard-effects__starburst')
      const stage = await catalogPage.cardStage(card)
      const box = await stage.boundingBox()

      expect(box).not.toBeNull()
      expect(box!.width).toBeGreaterThan(50)
      expect(box!.height).toBeGreaterThan(50)

      const rayCount = await card.locator('svg path').count()
      expect(rayCount).toBeGreaterThanOrEqual(4)
    })

    test('starburst is visually contained within its card', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('standard-effects-framer')

      const card = catalogPage.card('standard-effects__starburst')
      const stage = await catalogPage.cardStage(card)
      const stageBox = await stage.boundingBox()

      const animRoot = card.locator('[data-animation-id="standard-effects__starburst"]')
      const animBox = await animRoot.boundingBox()

      expect(stageBox).not.toBeNull()
      expect(animBox).not.toBeNull()
      expect(animBox!.x).toBeGreaterThanOrEqual(stageBox!.x - 1)
      expect(animBox!.y).toBeGreaterThanOrEqual(stageBox!.y - 1)
      expect(animBox!.x + animBox!.width).toBeLessThanOrEqual(stageBox!.x + stageBox!.width + 1)
      expect(animBox!.y + animBox!.height).toBeLessThanOrEqual(stageBox!.y + stageBox!.height + 1)
    })

    test('starburst exists in both code modes', async ({ catalogPage }) => {
      await catalogPage.gotoGroup('standard-effects-framer')
      const framerCard = catalogPage.card('standard-effects__starburst')
      await expect(framerCard).toBeVisible()

      await catalogPage.gotoGroup('standard-effects-css')
      const cssCard = catalogPage.card('standard-effects__starburst')
      await expect(cssCard).toBeVisible()
    })
  })

  test.describe('Starburst gradient picker', () => {
    test.beforeEach(async ({ catalogPage, page }) => {
      await catalogPage.gotoGroup('standard-effects-framer')
      await page.locator('[data-testid="toggle-right-panel"]').click()
      const card = catalogPage.card('standard-effects__starburst')
      await expect(card).toBeVisible()
      await card.click()
      await expect(page.locator('[data-testid="right-panel"]')).toBeVisible()
    })

    test('rayColor field renders with gradient mode switcher', async ({ page }) => {
      const field = page.locator('[data-testid="prop-field-rayColor"]')
      await expect(field).toBeVisible()

      // Open the color picker popover
      await field.locator('[data-testid="popover-open-change"]').click()

      // Mode switcher should be visible with both solid and gradient buttons
      const solidBtn = page.locator('[data-testid="color-gradient-mode-solid"]')
      const gradientBtn = page.locator('[data-testid="color-gradient-mode-gradient"]')
      await expect(solidBtn).toBeVisible()
      await expect(gradientBtn).toBeVisible()
    })

    test('switching to gradient mode shows gradient editor', async ({ page }) => {
      const field = page.locator('[data-testid="prop-field-rayColor"]')
      await field.locator('[data-testid="popover-open-change"]').click()

      // Switch to gradient mode
      await page.locator('[data-testid="color-gradient-mode-gradient"]').click()

      // Gradient editor controls should appear
      await expect(page.locator('[data-testid="gradient-angle-slider"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-stop-0"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-stop-1"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-marker-0"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-marker-1"]')).toBeVisible()
    })

    test('clicking a stop opens the inline color picker panel', async ({ page }) => {
      const field = page.locator('[data-testid="prop-field-rayColor"]')
      await field.locator('[data-testid="popover-open-change"]').click()
      await page.locator('[data-testid="color-gradient-mode-gradient"]').click()

      // Click a stop row — should open the side color picker
      await page.locator('[data-testid="gradient-stop-0"]').click()
      await expect(page.locator('[data-testid="color-picker-copy"]')).not.toBeVisible()

      // The panel should have a saturation area (the color picker panel)
      const satArea = page.locator('[role="slider"][aria-label="Saturation and brightness"]')
      await expect(satArea).toBeVisible()
    })

    test('add stop button creates a third stop', async ({ page }) => {
      const field = page.locator('[data-testid="prop-field-rayColor"]')
      await field.locator('[data-testid="popover-open-change"]').click()
      await page.locator('[data-testid="color-gradient-mode-gradient"]').click()

      // Should start with 2 stops
      await expect(page.locator('[data-testid="gradient-stop-0"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-stop-1"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-stop-2"]')).not.toBeVisible()

      // Click add stop
      await page.locator('[data-testid="gradient-add-stop"]').click()

      // Third stop and marker should appear
      await expect(page.locator('[data-testid="gradient-stop-2"]')).toBeVisible()
      await expect(page.locator('[data-testid="gradient-marker-2"]')).toBeVisible()
    })

    test('switching to gradient mode renders SVG linearGradient in starburst', async ({
      catalogPage,
      page,
    }) => {
      const field = page.locator('[data-testid="prop-field-rayColor"]')
      await field.locator('[data-testid="popover-open-change"]').click()
      await page.locator('[data-testid="color-gradient-mode-gradient"]').click()

      // Close the popover
      await page.keyboard.press('Escape')

      // The starburst animation root contains the SVG with rays.
      // Use evaluate to check inner SVG content since the root has role="img".
      const animRoot = catalogPage.card('standard-effects__starburst')

      await expect
        .poll(
          async () => {
            const html = await animRoot.evaluate((el) => el.innerHTML)
            return html.includes('linearGradient')
          },
          { timeout: 5_000 }
        )
        .toBe(true)

      // Verify a path references the gradient
      await expect
        .poll(
          async () => {
            const fills = await animRoot.evaluate((el) =>
              [...el.querySelectorAll('svg path')].map((p) => p.getAttribute('fill') ?? '')
            )
            return fills.some((f) => f.startsWith('url('))
          },
          { timeout: 5_000 }
        )
        .toBe(true)
    })

    test('switching back to solid mode removes SVG linearGradient', async ({
      catalogPage,
      page,
    }) => {
      const field = page.locator('[data-testid="prop-field-rayColor"]')
      await field.locator('[data-testid="popover-open-change"]').click()

      // Switch to gradient
      await page.locator('[data-testid="color-gradient-mode-gradient"]').click()
      await page.keyboard.press('Escape')

      const animRoot = catalogPage.card('standard-effects__starburst')

      await expect
        .poll(
          async () => {
            const html = await animRoot.evaluate((el) => el.innerHTML)
            return html.includes('linearGradient')
          },
          { timeout: 5_000 }
        )
        .toBe(true)

      // Re-open and switch back to solid
      await field.locator('[data-testid="popover-open-change"]').click()
      await page.locator('[data-testid="color-gradient-mode-solid"]').click()
      await page.keyboard.press('Escape')

      // linearGradient should be gone, fill should be a color
      await expect
        .poll(
          async () => {
            const html = await animRoot.evaluate((el) => el.innerHTML)
            return !html.includes('linearGradient')
          },
          { timeout: 5_000 }
        )
        .toBe(true)
    })
  })
})
