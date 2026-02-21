import { buildRegistryFromCategories, categories } from '@/components/animationRegistry'
import { animationDataService } from '@/services/animationData'

describe('Rewards • Basic (removed)', () => {
  it('remains absent from category exports, catalog, and flat registry', async () => {
    const rewardsCategory = categories.rewards
    expect(rewardsCategory).toBeDefined()
    expect(rewardsCategory.groups.basic).toBeUndefined()

    const refreshedCatalog = await animationDataService.refreshCatalog()
    const rewardsCatalog = refreshedCatalog.find((category) => category.id === 'rewards')
    expect(rewardsCatalog).toBeDefined()
    expect(rewardsCatalog!.groups.some((group) => group.id.includes('basic'))).toBe(false)

    const flatRegistry = buildRegistryFromCategories()
    const rewardsBasicKeys = Object.keys(flatRegistry).filter((animationId) =>
      animationId.startsWith('rewards-basic__')
    )
    expect(rewardsBasicKeys).toHaveLength(0)
  })
})
