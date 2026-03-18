import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useAnimations } from '@/hooks/useAnimations'

describe('useAnimations', () => {
  it('returns a non-empty catalog of categories on first render', () => {
    const { result } = renderHook(() => useAnimations())

    const { categories } = result.current
    // Catalog has 5 known categories: base, dialogs, progress, realtime, rewards
    expect(categories.length).toBe(5)
  })

  it('returns stable reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useAnimations())

    const first = result.current.categories
    rerender()
    const second = result.current.categories

    expect(first).toBe(second)
  })

  it('populates each category with groups that contain animations', () => {
    const { result } = renderHook(() => useAnimations())

    for (const category of result.current.categories) {
      expect(category.id).toMatch(/^[a-z]/)
      // Each category must have at least 2 groups (framer + css variant of at least one)
      expect(category.groups.length).toBeGreaterThanOrEqual(2)

      for (const group of category.groups) {
        expect(group.id).toMatch(/-(?:framer|css)$/)
        // Each group must have at least 1 animation
        expect(group.animations.length).toBeGreaterThanOrEqual(1)

        for (const animation of group.animations) {
          expect(animation.id).toContain('__')
          expect(animation.title.length).toBeGreaterThanOrEqual(2)
        }
      }
    }
  })

  it('propagates infinite flag from metadata to Animation objects', () => {
    const { result } = renderHook(() => useAnimations())

    const allAnimations = result.current.categories.flatMap((c) =>
      c.groups.flatMap((g) => g.animations)
    )

    // Loading states + specific animations should have infinite: true
    const infiniteAnimations = allAnimations.filter((a) => a.infinite === true)
    expect(infiniteAnimations.length).toBeGreaterThanOrEqual(10)

    // Spot-check: loading-states dots-portal should be infinite
    const dotsPortal = allAnimations.find((a) => a.id === 'loading-states__dots-portal')
    expect(dotsPortal?.infinite).toBe(true)
  })

  it('propagates controls field from metadata to Animation objects', () => {
    const { result } = renderHook(() => useAnimations())

    const allAnimations = result.current.categories.flatMap((c) =>
      c.groups.flatMap((g) => g.animations)
    )

    // Lights animations should have controls: 'lights'
    const lightsAnimations = allAnimations.filter((a) => a.controls === 'lights')
    // 8 variants × 2 (framer + css) = 16
    expect(lightsAnimations.length).toBe(16)

    // Prize-reveal chest should have controls: 'prizeCount'
    const chest = allAnimations.find((a) => a.id === 'prize-reveal__chest-gc-sc')
    expect(chest?.controls).toBe('prizeCount')

    // Card pack open should have prizeCountMax: 5
    const cardPack = allAnimations.find((a) => a.id === 'prize-reveal__card-pack-open')
    expect(cardPack?.prizeCountMax).toBe(5)
  })
})
