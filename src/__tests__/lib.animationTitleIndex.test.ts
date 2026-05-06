import { countMatchingAnimations } from '@/lib/animationTitleIndex'
import { describe, expect, it, vi } from 'vitest'

vi.mock('virtual:animation-title-index', () => ({
  groupTitles: {
    'modal-base': [
      { id: 'modal-base__scale-gentle-pop', title: 'Scale Gentle Pop' },
      { id: 'modal-base__slide-up-soft', title: 'Slide Up Soft' },
      { id: 'modal-base__slide-down-soft', title: 'Slide Down Soft' },
    ],
    lights: [{ id: 'lights__pulse-ring', title: 'Pulse Ring' }],
  },
}))

describe('animationTitleIndex', () => {
  it('counts case-insensitive title matches within the requested base group', () => {
    expect(countMatchingAnimations('modal-base', 'slide')).toBe(2)
    expect(countMatchingAnimations('modal-base', 'SCALE')).toBe(1)
  })

  it('does not leak matches across groups or empty queries', () => {
    expect(countMatchingAnimations('modal-base', 'pulse')).toBe(0)
    expect(countMatchingAnimations('lights', '')).toBe(0)
    expect(countMatchingAnimations('unknown', 'slide')).toBe(0)
  })
})
