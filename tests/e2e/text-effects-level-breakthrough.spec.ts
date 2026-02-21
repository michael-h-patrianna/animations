import { expect, test, type Locator, type Page } from '@playwright/test'

const animationId = 'text-effects__level-breakthrough'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const breakthroughCard = (page: Page) =>
  page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const gotoGroup = async (page: Page, groupId: string) => {
  await page.goto(`/${groupId}`)
  await expect.poll(() => currentPathname(page)).toBe(`/${groupId}`)
  await page.waitForSelector(`.pf-card[data-animation-id="${animationId}"]`, { timeout: 10000 })
}

const waitForRenderedStage = async (card: Locator) => {
  await card.scrollIntoViewIfNeeded()

  const stage = stageForCard(card)
  await expect(stage).toBeVisible()
  await expect.poll(async () => stage.locator(':scope > *').count(), { timeout: 5000 }).toBeGreaterThan(0)

  return stage
}

test.describe('TextEffectsLevelBreakthrough - Visual Rendering', () => {
  test('framer variant renders and transitions level text', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    const card = breakthroughCard(page)
    const stage = await waitForRenderedStage(card)

    const container = stage.locator('.pf-breakthrough-container')
    const levelText = container.locator('.pf-level-breakthrough')

    await expect(container).toBeVisible()
    await expect(levelText).toBeVisible()

    await expect
      .poll(async () => ((await levelText.textContent()) ?? '').trim(), { timeout: 2500 })
      .toContain('LEVEL 2')
  })

  test('framer variant renders both surge layers', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    const card = breakthroughCard(page)
    const stage = await waitForRenderedStage(card)

    await expect(stage.locator('.pf-surge-lines')).toHaveCount(2)
  })

  test('css variant renders namespaced breakthrough classes and texts', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = breakthroughCard(page)
    const stage = await waitForRenderedStage(card)

    const container = stage.locator('.tfx-breakthrough-container')
    await expect(container).toBeVisible()

    await expect(container.locator('.tfx-breakthrough-text-start')).toContainText('LEVEL 1')
    await expect(container.locator('.tfx-breakthrough-text-end')).toContainText('LEVEL 2')
    await expect(container.locator('.tfx-breakthrough-surge-outer')).toHaveCount(1)
    await expect(container.locator('.tfx-breakthrough-surge-inner')).toHaveCount(1)
  })

  test('css variant exposes expected will-change style hints', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = breakthroughCard(page)
    const stage = await waitForRenderedStage(card)

    const wrapper = stage.locator('.tfx-breakthrough-text-wrapper')
    const outerSurge = stage.locator('.tfx-breakthrough-surge-outer')

    const wrapperWillChange = await wrapper.evaluate((element) => window.getComputedStyle(element).willChange)
    const surgeWillChange = await outerSurge.evaluate((element) => window.getComputedStyle(element).willChange)

    expect(wrapperWillChange).toContain('transform')
    expect(surgeWillChange).toContain('transform')
    expect(surgeWillChange).toContain('opacity')
  })

  test('replay keeps breakthrough structure mounted in both variants', async ({ page }) => {
    const variants = [
      { groupId: 'text-effects-framer', rootSelector: '.pf-breakthrough-container' },
      { groupId: 'text-effects-css', rootSelector: '.tfx-breakthrough-container' },
    ] as const

    for (const variant of variants) {
      await gotoGroup(page, variant.groupId)

      const card = breakthroughCard(page)
      const stage = await waitForRenderedStage(card)
      const replayButton = card.locator('[data-role="replay"]')

      await expect(replayButton).toBeEnabled()
      await replayButton.click()

      await expect(stage).toBeVisible()
      await expect(stage.locator(variant.rootSelector)).toBeVisible()
    }
  })
})
