import { invertSpeedCurve } from '@/components/dialogs/modal-open/FlyInTrajectory'
import {
  containerCenter,
  resolvePoint,
  resolvePointRelative,
  reverseExtended,
  reverseTrajectory,
  type ExtendedTrajectoryArrays,
  type TrajectoryArrays,
} from '@/components/dialogs/modal-open/SharedTypes'
import { describe, expect, it } from 'vitest'

describe('resolvePoint', () => {
  it('returns x,y coordinates directly for a plain object', () => {
    const result = resolvePoint({ x: 100, y: 200 })
    expect(result).toEqual({ x: 100, y: 200 })
  })

  it('returns null when ref.current is null', () => {
    const result = resolvePoint({ current: null })
    expect(result).toBeNull()
  })

  it('returns element center from getBoundingClientRect for a ref', () => {
    const el = document.createElement('div')
    el.getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 50 }) as DOMRect
    const result = resolvePoint({ current: el })
    expect(result).toEqual({ x: 60, y: 45 }) // left + width/2, top + height/2
  })
})

describe('resolvePointRelative', () => {
  it('converts absolute coordinates to container-relative', () => {
    const container = document.createElement('div')
    container.getBoundingClientRect = () => ({ left: 50, top: 100 }) as DOMRect

    const result = resolvePointRelative({ x: 150, y: 250 }, container)
    expect(result).toEqual({ x: 100, y: 150 })
  })

  it('returns null when ref.current is null', () => {
    const container = document.createElement('div')
    container.getBoundingClientRect = () => ({ left: 0, top: 0 }) as DOMRect

    const result = resolvePointRelative({ current: null }, container)
    expect(result).toBeNull()
  })

  it('handles container at origin (0,0)', () => {
    const container = document.createElement('div')
    container.getBoundingClientRect = () => ({ left: 0, top: 0 }) as DOMRect

    const result = resolvePointRelative({ x: 80, y: 120 }, container)
    expect(result).toEqual({ x: 80, y: 120 })
  })
})

describe('containerCenter', () => {
  it('returns center based on offsetWidth and offsetHeight', () => {
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 400 })
    Object.defineProperty(el, 'offsetHeight', { value: 300 })

    const center = containerCenter(el)
    expect(center).toEqual({ x: 200, y: 150 })
  })

  it('returns (0,0) for zero-dimension element', () => {
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 0 })
    Object.defineProperty(el, 'offsetHeight', { value: 0 })

    expect(containerCenter(el)).toEqual({ x: 0, y: 0 })
  })
})

describe('invertSpeedCurve', () => {
  it('returns 0 for target 0', () => {
    expect(invertSpeedCurve(0, 0)).toBe(0)
    expect(invertSpeedCurve(0, 1)).toBe(0)
  })

  it('returns 1 for target 1', () => {
    expect(invertSpeedCurve(1, 0)).toBe(1)
    expect(invertSpeedCurve(1, 1)).toBe(1)
  })

  it('returns ~0.5 for target ~0.5 at force=0 (smootherstep has peak at 0.5)', () => {
    // Smootherstep at t=0.5: 6(0.5)^5 - 15(0.5)^4 + 10(0.5)^3 = 0.5
    const result = invertSpeedCurve(0.5, 0)
    expect(result).toBeCloseTo(0.5, 1)
  })

  it('converges to a precise result (16 iterations of binary search)', () => {
    // For force=0.5, the result should be deterministic and precise to ~1e-5
    const r1 = invertSpeedCurve(0.3, 0.5)
    const r2 = invertSpeedCurve(0.3, 0.5)
    expect(r1).toBe(r2)
    // Binary search with 16 iterations converges to ~1e-5 precision.
    // The inverted value for target=0.3 at force=0.5 is ~0.2096.
    expect(r1).toBeCloseTo(0.2096, 3)
  })

  it('is monotonically increasing for any force', () => {
    for (const force of [0, 0.25, 0.5, 0.75, 1]) {
      let prev = -1
      for (let target = 0; target <= 1; target += 0.1) {
        const result = invertSpeedCurve(target, force)
        expect(result).toBeGreaterThanOrEqual(prev)
        prev = result
      }
    }
  })
})

describe('reverseTrajectory', () => {
  it('reverses all arrays and remaps times to 0-1', () => {
    const t: TrajectoryArrays = {
      x: [10, 5, 0],
      y: [20, 10, 0],
      times: [0, 0.5, 1],
      scale: [0.5, 0.8, 1],
      opacity: [0, 0.5, 1],
    }

    const rev = reverseTrajectory(t)

    expect(rev.x).toEqual([0, 5, 10])
    expect(rev.y).toEqual([0, 10, 20])
    expect(rev.scale).toEqual([1, 0.8, 0.5])
    expect(rev.opacity).toEqual([1, 0.5, 0])
    // Times remapped: original [0, 0.5, 1] reversed = [1, 0.5, 0]
    // Then mapped: (maxTime - v) / maxTime = (1-1)/1=0, (1-0.5)/1=0.5, (1-0)/1=1
    expect(rev.times).toEqual([0, 0.5, 1])
  })

  it('does not mutate the original trajectory', () => {
    const t: TrajectoryArrays = {
      x: [1, 2, 3],
      y: [4, 5, 6],
      times: [0, 0.5, 1],
      scale: [0.1, 0.5, 1],
      opacity: [0, 0.5, 1],
    }

    const xBefore = [...t.x]
    reverseTrajectory(t)

    expect(t.x).toEqual(xBefore)
  })

  it('handles single-element trajectory', () => {
    const t: TrajectoryArrays = {
      x: [0],
      y: [0],
      times: [0],
      scale: [1],
      opacity: [1],
    }

    const rev = reverseTrajectory(t)

    expect(rev.x).toEqual([0])
    expect(rev.times).toEqual([NaN]) // (0-0)/0 = NaN — documents behavior for degenerate case
  })
})

describe('reverseExtended', () => {
  it('reverses extended trajectory arrays including scaleX, scaleY, rotate, skewX', () => {
    const t: ExtendedTrajectoryArrays = {
      x: [10, 0],
      y: [20, 0],
      times: [0, 1],
      scale: [0.5, 1],
      opacity: [0, 1],
      scaleX: [0.8, 1],
      scaleY: [1.2, 1],
      rotate: [15, 0],
      skewX: [10, 0],
    }

    const rev = reverseExtended(t)

    expect(rev.x).toEqual([0, 10])
    expect(rev.y).toEqual([0, 20])
    expect(rev.scaleX).toEqual([1, 0.8])
    expect(rev.scaleY).toEqual([1, 1.2])
    expect(rev.rotate).toEqual([0, 15])
    expect(rev.skewX).toEqual([0, 10])
    expect(rev.times).toEqual([0, 1])
  })
})
