/**
 * Property-based tests for color utility functions.
 * Uses fast-check to verify mathematical invariants hold for all inputs.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  toHex,
  blendColors,
  addTransparency,
  shiftColorTemperature,
  formatRgb,
  formatRgba,
} from '@/utils/colors'

/** Arbitrary for valid 6-digit hex color strings. */
const hexColor = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map(
    ([r, g, b]) =>
      `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  )

/** Arbitrary for valid 3-digit shorthand hex color strings. */
const shortHexColor = fc
  .tuple(
    fc.integer({ min: 0, max: 15 }),
    fc.integer({ min: 0, max: 15 }),
    fc.integer({ min: 0, max: 15 })
  )
  .map(([r, g, b]) => `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`)

/** Arbitrary for percentage values 0-100. */
const percentage = fc.integer({ min: 0, max: 100 })

/** Arbitrary for alpha values 0-1. */
const alphaValue = fc.double({ min: 0, max: 1, noNaN: true })

/** Arbitrary for color temperature shift values. */
const tempShift = fc.integer({ min: -50, max: 50 })

describe('toHex — property-based', () => {
  it('always returns a 7-character string starting with #', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        const result = toHex(color)
        expect(result).toMatch(/^#[\da-f]{6}$/i)
      })
    )
  })

  it('is idempotent: toHex(toHex(x)) === toHex(x)', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        expect(toHex(toHex(color))).toBe(toHex(color))
      })
    )
  })

  it('normalizes 3-digit hex to 6-digit hex', () => {
    fc.assert(
      fc.property(shortHexColor, (color) => {
        const result = toHex(color)
        expect(result).toMatch(/^#[\da-f]{6}$/i)
      })
    )
  })

  it('roundtrips rgb() format through toHex', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r, g, b) => {
          const rgb = `rgb(${r}, ${g}, ${b})`
          const hex = toHex(rgb)
          expect(hex).toMatch(/^#[\da-f]{6}$/i)
          // Verify the channels roundtrip correctly
          const pr = parseInt(hex.slice(1, 3), 16)
          const pg = parseInt(hex.slice(3, 5), 16)
          const pb = parseInt(hex.slice(5, 7), 16)
          expect(pr).toBe(r)
          expect(pg).toBe(g)
          expect(pb).toBe(b)
        }
      )
    )
  })
})

describe('blendColors — property-based', () => {
  it('at 100% returns the first color', () => {
    fc.assert(
      fc.property(hexColor, hexColor, (c1, c2) => {
        expect(blendColors(c1, c2, 100)).toBe(toHex(c1))
      })
    )
  })

  it('at 0% returns the second color', () => {
    fc.assert(
      fc.property(hexColor, hexColor, (c1, c2) => {
        expect(blendColors(c1, c2, 0)).toBe(toHex(c2))
      })
    )
  })

  it('blending a color with itself returns the same color', () => {
    fc.assert(
      fc.property(hexColor, percentage, (color, pct) => {
        expect(blendColors(color, color, pct)).toBe(toHex(color))
      })
    )
  })

  it('always returns a valid hex color', () => {
    fc.assert(
      fc.property(hexColor, hexColor, percentage, (c1, c2, pct) => {
        const result = blendColors(c1, c2, pct)
        expect(result).toMatch(/^#[\da-f]{6}$/i)
      })
    )
  })

  it('result channels are bounded between the two input channels', () => {
    fc.assert(
      fc.property(hexColor, hexColor, percentage, (c1, c2, pct) => {
        const result = blendColors(c1, c2, pct)
        for (const offset of [1, 3, 5] as const) {
          const ch1 = parseInt(c1.slice(offset, offset + 2), 16)
          const ch2 = parseInt(c2.slice(offset, offset + 2), 16)
          const chR = parseInt(result.slice(offset, offset + 2), 16)
          const lo = Math.min(ch1, ch2)
          const hi = Math.max(ch1, ch2)
          // Allow +-1 for rounding
          expect(chR).toBeGreaterThanOrEqual(lo - 1)
          expect(chR).toBeLessThanOrEqual(hi + 1)
        }
      })
    )
  })
})

describe('addTransparency — property-based', () => {
  it('always returns a valid rgba() string', () => {
    fc.assert(
      fc.property(hexColor, alphaValue, (color, alpha) => {
        const result = addTransparency(color, alpha)
        expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/)
      })
    )
  })

  it('alpha is clamped to [0, 1]', () => {
    fc.assert(
      fc.property(hexColor, fc.double({ min: -2, max: 3, noNaN: true }), (color, alpha) => {
        const result = addTransparency(color, alpha)
        const match = result.match(/rgba\(\d+, \d+, \d+, ([\d.]+)\)/)
        const a = parseFloat(match![1]!)
        expect(a).toBeGreaterThanOrEqual(0)
        expect(a).toBeLessThanOrEqual(1)
      })
    )
  })

  it('at alpha=1 produces alpha=1', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        const result = addTransparency(color, 1)
        expect(result).toMatch(/rgba\(\d+, \d+, \d+, 1\)$/)
      })
    )
  })

  it('at alpha=0 produces alpha=0', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        const result = addTransparency(color, 0)
        expect(result).toMatch(/rgba\(\d+, \d+, \d+, 0\)$/)
      })
    )
  })
})

describe('shiftColorTemperature — property-based', () => {
  it('always returns a valid hex color', () => {
    fc.assert(
      fc.property(hexColor, tempShift, (color, shift) => {
        const result = shiftColorTemperature(color, shift)
        expect(result).toMatch(/^#[\da-f]{6}$/i)
      })
    )
  })

  it('shift of 0 returns the original color', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        expect(shiftColorTemperature(color, 0)).toBe(toHex(color))
      })
    )
  })

  it('channels stay within [0, 255]', () => {
    fc.assert(
      fc.property(hexColor, tempShift, (color, shift) => {
        const result = shiftColorTemperature(color, shift)
        for (const offset of [1, 3, 5] as const) {
          const ch = parseInt(result.slice(offset, offset + 2), 16)
          expect(ch).toBeGreaterThanOrEqual(0)
          expect(ch).toBeLessThanOrEqual(255)
        }
      })
    )
  })
})

/** Arbitrary for RGB channel values. */
const channel = fc.integer({ min: 0, max: 255 })

/** Arbitrary for alpha values 0-1. */
const alpha = fc.double({ min: 0, max: 1, noNaN: true })

describe('formatRgb — property-based', () => {
  it('always returns a valid rgb() string', () => {
    fc.assert(
      fc.property(channel, channel, channel, (r, g, b) => {
        const result = formatRgb(r, g, b)
        expect(result).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
      })
    )
  })

  it('preserves input channel values exactly', () => {
    fc.assert(
      fc.property(channel, channel, channel, (r, g, b) => {
        expect(formatRgb(r, g, b)).toBe(`rgb(${r}, ${g}, ${b})`)
      })
    )
  })
})

describe('formatRgba — property-based', () => {
  it('always returns a valid rgba() string', () => {
    fc.assert(
      fc.property(channel, channel, channel, alpha, (r, g, b, a) => {
        const result = formatRgba(r, g, b, a)
        expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [\d.e+-]+\)$/)
      })
    )
  })

  it('preserves input values exactly', () => {
    fc.assert(
      fc.property(channel, channel, channel, alpha, (r, g, b, a) => {
        expect(formatRgba(r, g, b, a)).toBe(`rgba(${r}, ${g}, ${b}, ${a})`)
      })
    )
  })
})
