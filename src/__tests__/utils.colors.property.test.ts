import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { addTransparency, blendColors, shiftColorTemperature, toHex } from '@/utils/colors'

/** Arbitrary for valid 6-digit hex colors */
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

/** Arbitrary for percentage values 0-100 */
const percentage = fc.integer({ min: 0, max: 100 })

/** Arbitrary for temperature shift values -50 to 50 */
const temperatureShift = fc.integer({ min: -50, max: 50 })

const HEX6_PATTERN = /^#[0-9a-f]{6}$/

describe('toHex — property-based', () => {
  it('always produces a valid 6-digit lowercase hex string', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        const result = toHex(color)
        expect(result).toMatch(HEX6_PATTERN)
      })
    )
  })

  it('is idempotent — toHex(toHex(x)) === toHex(x)', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        expect(toHex(toHex(color))).toBe(toHex(color))
      })
    )
  })

  it('normalizes to lowercase', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        const upper = color.toUpperCase()
        expect(toHex(upper)).toBe(toHex(color))
      })
    )
  })
})

describe('blendColors — property-based', () => {
  it('at 100% returns color1', () => {
    fc.assert(
      fc.property(hexColor, hexColor, (c1, c2) => {
        expect(blendColors(c1, c2, 100)).toBe(toHex(c1))
      })
    )
  })

  it('at 0% returns color2', () => {
    fc.assert(
      fc.property(hexColor, hexColor, (c1, c2) => {
        expect(blendColors(c1, c2, 0)).toBe(toHex(c2))
      })
    )
  })

  it('with identical colors returns that color at any percentage', () => {
    fc.assert(
      fc.property(hexColor, percentage, (color, pct) => {
        expect(blendColors(color, color, pct)).toBe(toHex(color))
      })
    )
  })

  it('always produces a valid hex color', () => {
    fc.assert(
      fc.property(hexColor, hexColor, percentage, (c1, c2, pct) => {
        expect(blendColors(c1, c2, pct)).toMatch(HEX6_PATTERN)
      })
    )
  })

  it('is bounded — each channel is between the two input channels', () => {
    fc.assert(
      fc.property(hexColor, hexColor, percentage, (c1, c2, pct) => {
        const result = blendColors(c1, c2, pct)
        for (let i = 0; i < 3; i++) {
          const offset = 1 + i * 2
          const ch1 = parseInt(c1.slice(offset, offset + 2), 16)
          const ch2 = parseInt(c2.slice(offset, offset + 2), 16)
          const chR = parseInt(result.slice(offset, offset + 2), 16)
          const lo = Math.min(ch1, ch2)
          const hi = Math.max(ch1, ch2)
          // Allow 1 unit rounding tolerance
          expect(chR).toBeGreaterThanOrEqual(lo - 1)
          expect(chR).toBeLessThanOrEqual(hi + 1)
        }
      })
    )
  })
})

describe('addTransparency — property-based', () => {
  it('always produces a valid rgba() string', () => {
    fc.assert(
      fc.property(hexColor, fc.integer({ min: -100, max: 200 }), (color, alpha) => {
        const result = addTransparency(color, alpha)
        expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/)
      })
    )
  })

  it('alpha is always clamped to [0, 1]', () => {
    fc.assert(
      fc.property(hexColor, fc.integer({ min: -1000, max: 1000 }), (color, alpha) => {
        const result = addTransparency(color, alpha)
        const match = result.match(/,\s*([\d.]+)\)$/)
        const parsedAlpha = parseFloat(match![1]!)
        const expectedAlpha = Math.max(0, Math.min(1, alpha / 100))
        expect(parsedAlpha).toBe(expectedAlpha)
      })
    )
  })

  it('preserves RGB channels from input color', () => {
    fc.assert(
      fc.property(hexColor, percentage, (color, alpha) => {
        const result = addTransparency(color, alpha)
        const match = result.match(/^rgba\((\d+), (\d+), (\d+)/)!
        const r = parseInt(match[1]!)
        const g = parseInt(match[2]!)
        const b = parseInt(match[3]!)
        const expectedR = parseInt(color.slice(1, 3), 16)
        const expectedG = parseInt(color.slice(3, 5), 16)
        const expectedB = parseInt(color.slice(5, 7), 16)
        expect(r).toBe(expectedR)
        expect(g).toBe(expectedG)
        expect(b).toBe(expectedB)
      })
    )
  })
})

describe('shiftColorTemperature — property-based', () => {
  it('at shift 0 is identity', () => {
    fc.assert(
      fc.property(hexColor, (color) => {
        expect(shiftColorTemperature(color, 0)).toBe(toHex(color))
      })
    )
  })

  it('always produces a valid hex color', () => {
    fc.assert(
      fc.property(hexColor, temperatureShift, (color, shift) => {
        expect(shiftColorTemperature(color, shift)).toMatch(HEX6_PATTERN)
      })
    )
  })

  it('channels are always clamped to 0-255', () => {
    fc.assert(
      fc.property(hexColor, fc.integer({ min: -500, max: 500 }), (color, shift) => {
        const result = shiftColorTemperature(color, shift)
        // Valid hex6 format guarantees channels are in 00-ff (0-255)
        expect(result).toMatch(HEX6_PATTERN)
        // Verify the output is a valid re-parseable color (roundtrip)
        expect(toHex(result)).toBe(result)
      })
    )
  })

  it('clamps shift values beyond [-50, 50] to the same result as the boundary', () => {
    fc.assert(
      fc.property(hexColor, fc.integer({ min: 51, max: 1000 }), (color, shift) => {
        expect(shiftColorTemperature(color, shift)).toBe(shiftColorTemperature(color, 50))
      })
    )
    fc.assert(
      fc.property(hexColor, fc.integer({ min: -1000, max: -51 }), (color, shift) => {
        expect(shiftColorTemperature(color, shift)).toBe(shiftColorTemperature(color, -50))
      })
    )
  })
})
