import { animationDataService } from '@/services/animationData'
import type { Category } from '@/types/animation'

const loadCatalog = async (): Promise<Category[]> => {
  const p = animationDataService.loadAnimations()
  jest.advanceTimersByTime(130)
  return p
}

describe('services • animationData validation', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('sets group tech to match generated group variant suffix', async () => {
    const catalog = await loadCatalog()

    catalog.forEach((category) => {
      category.groups.forEach((group) => {
        if (group.id.endsWith('-framer')) {
          expect(group.tech).toBe('framer')
        }
        if (group.id.endsWith('-css')) {
          expect(group.tech).toBe('css')
        }
      })
    })
  })

  it('rejects addAnimation when category or group does not exist', async () => {
    const catalog = await loadCatalog()
    const validCategory = catalog[0]
    const validGroup = validCategory.groups[0]

    await expect(
      animationDataService.addAnimation({
        title: 'Invalid category target',
        description: 'Should fail',
        categoryId: '__missing_category__',
        groupId: validGroup.id,
      })
    ).rejects.toThrow('Category not found')

    await expect(
      animationDataService.addAnimation({
        title: 'Invalid group target',
        description: 'Should fail',
        categoryId: validCategory.id,
        groupId: '__missing_group__',
      })
    ).rejects.toThrow('Group not found')
  })
})
