import AxeBuilder from '@axe-core/playwright'
import { test, expect } from './fixtures/catalog.fixture'

/**
 * Automated WCAG accessibility audit using axe-core.
 * Complements the manual ARIA/keyboard tests in accessibility.spec.ts
 * with full WCAG 2.1 AA conformance checking.
 */
test.describe('axe-core: WCAG Accessibility Audit', () => {
  test('catalog home page has no WCAG violations', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const results = await new AxeBuilder({ page: catalogPage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('animation group page has no WCAG violations', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const results = await new AxeBuilder({ page: catalogPage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('CSS mode page has no WCAG violations', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const results = await new AxeBuilder({ page: catalogPage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('code viewer modal has no WCAG violations', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    const results = await new AxeBuilder({ page: catalogPage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('mobile viewport has no WCAG violations', async ({ mobilePage }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    const results = await new AxeBuilder({ page: mobilePage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('mobile navigation drawer has no WCAG violations', async ({ mobilePage }) => {
    await mobilePage.gotoMobile('text-effects-framer')
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    const results = await new AxeBuilder({ page: mobilePage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
