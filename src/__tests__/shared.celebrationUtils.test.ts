import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  GEM_TYPES,
  GOLDEN_COLORS,
  pickRandom,
  polarToXY,
  randBetween,
  randInt,
} from '@/components/rewards/modal-celebrations/utils'
import { describe, expect, it } from 'vitest'

describe('randBetween', () => {
  it('returns a value within [min, max)', () => {
    for (let i = 0; i < 100; i++) {
      const v = randBetween(5, 10)
      expect(v).toBeGreaterThanOrEqual(5)
      expect(v).toBeLessThan(10)
    }
  })

  it('returns min when min === max (degenerate range)', () => {
    expect(randBetween(7, 7)).toBe(7)
  })

  it('handles negative ranges', () => {
    for (let i = 0; i < 50; i++) {
      const v = randBetween(-10, -5)
      expect(v).toBeGreaterThanOrEqual(-10)
      expect(v).toBeLessThan(-5)
    }
  })

  it('handles range crossing zero', () => {
    for (let i = 0; i < 50; i++) {
      const v = randBetween(-5, 5)
      expect(v).toBeGreaterThanOrEqual(-5)
      expect(v).toBeLessThan(5)
    }
  })
})

describe('randInt', () => {
  it('returns an integer within [min, max] inclusive', () => {
    for (let i = 0; i < 100; i++) {
      const v = randInt(1, 6)
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
    }
  })

  it('returns the same value when min === max', () => {
    expect(randInt(3, 3)).toBe(3)
  })

  it('covers all values in range over many iterations', () => {
    const seen = new Set<number>()
    for (let i = 0; i < 500; i++) {
      seen.add(randInt(1, 5))
    }
    expect(seen).toEqual(new Set([1, 2, 3, 4, 5]))
  })
})

describe('polarToXY', () => {
  it('converts 0 radians to (radius, 0)', () => {
    const { x, y } = polarToXY(0, 10)
    expect(x).toBeCloseTo(10)
    expect(y).toBeCloseTo(0)
  })

  it('converts PI/2 radians to (0, radius)', () => {
    const { x, y } = polarToXY(Math.PI / 2, 10)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(10)
  })

  it('converts PI radians to (-radius, 0)', () => {
    const { x, y } = polarToXY(Math.PI, 10)
    expect(x).toBeCloseTo(-10)
    expect(y).toBeCloseTo(0, 5)
  })

  it('returns (0, 0) when radius is 0', () => {
    const { x, y } = polarToXY(Math.PI / 4, 0)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(0)
  })

  it('handles negative radius (inverts direction)', () => {
    const { x, y } = polarToXY(0, -5)
    expect(x).toBeCloseTo(-5)
    expect(y).toBeCloseTo(0)
  })
})

describe('deg2rad', () => {
  it('converts 0 degrees to 0 radians', () => {
    expect(deg2rad(0)).toBe(0)
  })

  it('converts 180 degrees to PI radians', () => {
    expect(deg2rad(180)).toBeCloseTo(Math.PI)
  })

  it('converts 360 degrees to 2*PI radians', () => {
    expect(deg2rad(360)).toBeCloseTo(Math.PI * 2)
  })

  it('converts 90 degrees to PI/2 radians', () => {
    expect(deg2rad(90)).toBeCloseTo(Math.PI / 2)
  })

  it('converts negative degrees', () => {
    expect(deg2rad(-90)).toBeCloseTo(-Math.PI / 2)
  })
})

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const arr = [1, 2, 3, 4, 5]
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(pickRandom(arr))
    }
  })

  it('returns the only element from a single-element array', () => {
    expect(pickRandom(['only'])).toBe('only')
  })

  it('covers all elements over many iterations', () => {
    const arr = ['a', 'b', 'c']
    const seen = new Set<string>()
    for (let i = 0; i < 200; i++) {
      seen.add(pickRandom(arr))
    }
    expect(seen.size).toBe(3)
  })

  it('works with readonly arrays', () => {
    const readonly = ['x', 'y'] as const
    const result = pickRandom(readonly)
    expect(['x', 'y']).toContain(result)
  })
})

describe('constant exports', () => {
  it('CONFETTI_SHAPES has 4 shape types', () => {
    expect(CONFETTI_SHAPES).toHaveLength(4)
    expect(CONFETTI_SHAPES).toEqual(['rect', 'circle', 'ribbon', 'star'])
  })

  it('CELEBRATION_COLORS has 5 entries with CSS var() syntax and hex fallbacks', () => {
    expect(CELEBRATION_COLORS).toHaveLength(5)
    for (const color of CELEBRATION_COLORS) {
      expect(color).toMatch(/^var\(--pf-[\da-z-]+, #[\da-f]{6}\)$/)
    }
  })

  it('GOLDEN_COLORS has 5 entries with CSS var() syntax and hex fallbacks', () => {
    expect(GOLDEN_COLORS).toHaveLength(5)
    for (const color of GOLDEN_COLORS) {
      expect(color).toMatch(/^var\(--pf-[\da-z-]+, #[\da-f]{6}\)$/)
    }
  })

  it('GEM_TYPES has 4 gem types with name, color1, color2', () => {
    expect(GEM_TYPES).toHaveLength(4)
    const names = GEM_TYPES.map((g) => g.name)
    expect(names).toEqual(['diamond', 'ruby', 'emerald', 'sapphire'])
    for (const gem of GEM_TYPES) {
      expect(gem.color1).toMatch(/^var\(/)
      expect(gem.color2).toMatch(/^var\(/)
    }
  })
})
