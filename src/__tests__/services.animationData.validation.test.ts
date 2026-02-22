import { animationDataService } from '@/services/animationData'
import { describe, expect, it } from 'vitest'

describe('services - animationData validation', () => {
  it('sets group tech to match generated group variant suffix', async () => {
    const catalog = await animationDataService.loadAnimations()

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
})
