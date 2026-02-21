import { buildRegistryFromCategories, categories } from '@/components/animationRegistry'
import { animationDataService } from '@/services/animationData'

describe('Progress Bars • Spark (removed)', () => {
  it('remains absent from category exports, catalog, and flat registry', async () => {
    const progressCategory = categories.progress
    expect(progressCategory).toBeDefined()
    expect(progressCategory.groups.spark).toBeUndefined()

    const refreshedCatalog = await animationDataService.refreshCatalog()
    const progressCatalog = refreshedCatalog.find((category) => category.id === 'progress')
    expect(progressCatalog).toBeDefined()
    expect(progressCatalog!.groups.some((group) => group.id.includes('spark'))).toBe(false)

    const flatRegistry = buildRegistryFromCategories()
    const progressSparkKeys = Object.keys(flatRegistry).filter(
      (animationId) =>
        animationId.startsWith('progress-bars__spark') || animationId.startsWith('progress-spark__')
    )
    expect(progressSparkKeys).toHaveLength(0)
  })
})
