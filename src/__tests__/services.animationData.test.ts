import { animationDataService } from '@/services/animationData'
import type { Category } from '@/types/animation'

describe('services • animationData', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('loads, refreshes, and can add animations', async () => {
    // Initial load
    let catalog: Category[] = []
    await (async () => {
      const p = animationDataService.loadAnimations()
      jest.advanceTimersByTime(130)
      catalog = await p
    })()
    expect(catalog.length).toBeGreaterThan(0)

    // Add animation updates in-memory catalog
    const newAnim = await animationDataService.addAnimation({
      title: 'Extra',
      description: 'Injected',
      categoryId: catalog[0].id,
      groupId: catalog[0].groups[0].id,
    })
    expect(newAnim.id).toMatch(`${catalog[0].groups[0].id}__`)

    // getAnimationsByGroup returns new item after ensureCatalog
    const groupAnims = await animationDataService.getAnimationsByGroup(
      catalog[0].id,
      catalog[0].groups[0].id
    )
    expect(groupAnims.find((a) => a.id === newAnim.id)).toBeTruthy()

    // Refresh rebuilds catalog; still contains extra animation
    await (async () => {
      const p = animationDataService.refreshCatalog()
      jest.advanceTimersByTime(70)
      await p
    })()
    const after = await animationDataService.getAnimationsByGroup(
      catalog[0].id,
      catalog[0].groups[0].id
    )
    expect(after.find((a) => a.id === newAnim.id)).toBeTruthy()
  })
})
