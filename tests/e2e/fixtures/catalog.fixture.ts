import { test as base } from '@playwright/test'
import { CatalogPage } from '../page-objects/CatalogPage'
import { MobilePage } from '../page-objects/MobilePage'

type CatalogFixtures = {
  catalogPage: CatalogPage
  mobilePage: MobilePage
}

/**
 * Extended Playwright test with page object fixtures.
 * Use `catalogPage` for desktop and `mobilePage` for mobile interactions.
 */
export const test = base.extend<CatalogFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page))
  },
  mobilePage: async ({ page }, use) => {
    await use(new MobilePage(page))
  },
})

export { expect } from '@playwright/test'
