import { expect, test, type Locator, type Page } from '@playwright/test'

type RenderingScenario = {
  groupId: string
  animationId: string
}

const currentPathname = (page: Page) => new URL(page.url()).pathname

const cardByAnimationId = (page: Page, animationId: string) =>
  page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const gotoGroup = async (page: Page, groupId: string) => {
  await page.goto(`/${groupId}`)
  await expect.poll(() => currentPathname(page)).toBe(`/${groupId}`)
  await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })
}

async function waitForRenderedStage(card: Locator, minChildren = 1) {
  await card.scrollIntoViewIfNeeded()

  const stage = card.locator('.pf-demo-stage')
  await expect(stage).toBeVisible()

  await expect
    .poll(async () => stage.locator(':scope > *').count(), { timeout: 5000 })
    .toBeGreaterThanOrEqual(minChildren)

  return stage
}

const representativeFramerScenarios: RenderingScenario[] = [
  { groupId: 'text-effects-framer', animationId: 'text-effects__character-reveal' },
  { groupId: 'modal-base-framer', animationId: 'modal-base__scale-gentle-pop' },
  { groupId: 'progress-bars-framer', animationId: 'progress-bars__timeline-progress' },
  { groupId: 'timer-effects-framer', animationId: 'timer-effects__timer-pulse' },
  { groupId: 'icon-animations-framer', animationId: 'icon-animations__shake' },
]

test.describe('Animation Rendering', () => {
  test('renders representative Framer animations across major categories', async ({ page }) => {
    for (const scenario of representativeFramerScenarios) {
      await gotoGroup(page, scenario.groupId)

      const card = cardByAnimationId(page, scenario.animationId)
      await expect(card).toBeVisible()

      const stage = await waitForRenderedStage(card)
      await expect(stage.locator('.pf-card__placeholder')).toHaveCount(0)
    }
  })

  test('renders representative CSS animation content', async ({ page }) => {
    await gotoGroup(page, 'button-effects-css')

    const card = cardByAnimationId(page, 'button-effects__jitter')
    await expect(card).toBeVisible()

    const stage = await waitForRenderedStage(card)
    await expect(stage.locator('button')).toHaveCount(1)
  })

  test('replay keeps rendered content mounted for replay-enabled animations', async ({ page }) => {
    await gotoGroup(page, 'standard-effects-framer')

    const card = cardByAnimationId(page, 'standard-effects__bounce')
    await expect(card).toBeVisible()

    const replayButton = card.locator('[data-role="replay"]')
    await expect(replayButton).toBeEnabled()

    const stage = await waitForRenderedStage(card)
    await replayButton.click()

    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('lights controls update bulb count and preserve rendering', async ({ page }) => {
    await gotoGroup(page, 'lights-framer')

    const card = cardByAnimationId(page, 'lights__circle-static-1')
    await expect(card).toBeVisible()

    const bulbCountInput = card.locator('input[type="number"][aria-label="Number of bulbs"]')
    const increaseButton = card.locator('button[aria-label="Increase bulb count"]')

    const initialValue = Number.parseInt(await bulbCountInput.inputValue(), 10)
    await increaseButton.click()
    const nextValue = Number.parseInt(await bulbCountInput.inputValue(), 10)

    expect(nextValue).toBe(initialValue + 1)

    const stage = await waitForRenderedStage(card)
    await expect(stage.locator('.pf-card__placeholder')).toHaveCount(0)
  })

  test('typewriter animation renders visible character spans', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    const card = cardByAnimationId(page, 'text-effects__typewriter')
    await expect(card).toBeVisible()

    await waitForRenderedStage(card)

    const replayButton = card.locator('[data-role="replay"]')
    await replayButton.click()

    const firstCharacter = card.locator('.pf-demo-stage .typewriter-char').first()
    await expect(firstCharacter).toBeVisible()
  })
})
