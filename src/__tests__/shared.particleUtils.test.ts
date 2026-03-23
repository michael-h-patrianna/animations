import {
  DEFAULT_CONFETTI_COLORS,
  generateFallbackParticle,
  randomColor,
  randomShape,
} from '@/components/rewards/collection-effects/SharedParticleUtils'
import type { ConfettiShape } from '@/components/rewards/collection-effects/SharedParticleUtils'
import { describe, expect, it } from 'vitest'

const ALL_SHAPES: ConfettiShape[] = ['circle', 'square', 'diamond', 'triangle', 'rectangle']

describe('randomShape', () => {
  it('returns a valid confetti shape', () => {
    const shape = randomShape()
    expect(ALL_SHAPES).toContain(shape)
  })

  it('can produce all 5 shape types over many iterations', () => {
    const seen = new Set<ConfettiShape>()
    for (let i = 0; i < 500; i++) {
      seen.add(randomShape())
    }
    expect(seen.size).toBe(5)
  })
})

describe('randomColor', () => {
  it('returns a color from the provided palette', () => {
    const palette = ['#ff0000', '#00ff00', '#0000ff']
    const color = randomColor(palette)
    expect(palette).toContain(color)
  })

  it('returns the only color when palette has one entry', () => {
    expect(randomColor(['#abcdef'])).toBe('#abcdef')
  })

  it('can produce all colors from the palette over many iterations', () => {
    const palette = ['#aaa', '#bbb', '#ccc', '#ddd']
    const seen = new Set<string>()
    for (let i = 0; i < 200; i++) {
      seen.add(randomColor(palette))
    }
    expect(seen.size).toBe(4)
  })
})

describe('generateFallbackParticle', () => {
  it('returns a valid shape and color from defaults when called with no args', () => {
    const particle = generateFallbackParticle()
    expect(ALL_SHAPES).toContain(particle.shape)
    expect(DEFAULT_CONFETTI_COLORS as readonly string[]).toContain(particle.color)
  })

  it('uses DEFAULT_CONFETTI_COLORS when no palette is provided', () => {
    const colors = new Set<string>()
    for (let i = 0; i < 200; i++) {
      colors.add(generateFallbackParticle().color)
    }
    // All generated colors should be from the default palette
    for (const c of colors) {
      expect(DEFAULT_CONFETTI_COLORS as readonly string[]).toContain(c)
    }
    // Should have seen all 3 default colors
    expect(colors.size).toBe(3)
  })

  it('uses DEFAULT_CONFETTI_COLORS when palette is empty array', () => {
    const particle = generateFallbackParticle([])
    expect(DEFAULT_CONFETTI_COLORS as readonly string[]).toContain(particle.color)
  })

  it('uses custom palette when provided', () => {
    const custom = ['#111', '#222']
    const colors = new Set<string>()
    for (let i = 0; i < 100; i++) {
      colors.add(generateFallbackParticle(custom).color)
    }
    for (const c of colors) {
      expect(custom).toContain(c)
    }
  })

  it('uses provided palette when it is non-empty', () => {
    const palette = ['#custom']
    const particle = generateFallbackParticle(palette)
    expect(particle.color).toBe('#custom')
  })
})

describe('DEFAULT_CONFETTI_COLORS', () => {
  it('contains exactly 3 colors', () => {
    expect(DEFAULT_CONFETTI_COLORS).toHaveLength(3)
  })

  it('all entries are valid hex color strings', () => {
    for (const color of DEFAULT_CONFETTI_COLORS) {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})
