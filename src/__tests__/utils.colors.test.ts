import {
  addTransparency,
  blendColors,
  calculateBulbColors,
  shiftColorTemperature,
} from '@/utils/colors'
import { describe, expect, it } from 'vitest'

describe('blendColors', () => {
  it('returns first color at 100% mix', () => {
    expect(blendColors('#ff0000', '#0000ff', 100)).toBe('#ff0000')
  })

  it('returns second color at 0% mix', () => {
    expect(blendColors('#ff0000', '#0000ff', 0)).toBe('#0000ff')
  })

  it('blends two colors at 50%', () => {
    const result = blendColors('#ff0000', '#0000ff', 50)
    // 50% blend: r=128, g=0, b=128 → #800080
    expect(result).toBe('#800080')
  })

  it('clamps percentage below 0 to 0', () => {
    expect(blendColors('#ff0000', '#0000ff', -50)).toBe('#0000ff')
  })

  it('clamps percentage above 100 to 100', () => {
    expect(blendColors('#ff0000', '#0000ff', 200)).toBe('#ff0000')
  })

  it('handles 3-character hex colors', () => {
    const result = blendColors('#f00', '#00f', 50)
    expect(result).toBe('#800080')
  })

  it('handles rgb() color strings', () => {
    const result = blendColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)', 50)
    expect(result).toBe('#800080')
  })

  it('handles rgba() color strings', () => {
    const result = blendColors('rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.8)', 50)
    // Alpha is ignored in blending — only RGB channels
    expect(result).toBe('#800080')
  })

  it('blends identical colors to the same color', () => {
    expect(blendColors('#336699', '#336699', 50)).toBe('#336699')
  })

  it('blends black and white to gray', () => {
    const result = blendColors('#000000', '#ffffff', 50)
    expect(result).toBe('#808080')
  })

  it('falls back to gold for invalid color strings', () => {
    const result = blendColors('not-a-color', '#000000', 100)
    // FALLBACK_COLOR is { r: 255, g: 215, b: 0 } → #ffd700
    expect(result).toBe('#ffd700')
  })
})

describe('addTransparency', () => {
  it('adds full opacity at alpha=100', () => {
    expect(addTransparency('#ff0000', 100)).toBe('rgba(255, 0, 0, 1)')
  })

  it('adds zero opacity at alpha=0', () => {
    expect(addTransparency('#ff0000', 0)).toBe('rgba(255, 0, 0, 0)')
  })

  it('adds 50% opacity', () => {
    expect(addTransparency('#ff0000', 50)).toBe('rgba(255, 0, 0, 0.5)')
  })

  it('clamps alpha above 100', () => {
    expect(addTransparency('#ff0000', 150)).toBe('rgba(255, 0, 0, 1)')
  })

  it('clamps alpha below 0', () => {
    expect(addTransparency('#ff0000', -50)).toBe('rgba(255, 0, 0, 0)')
  })

  it('handles 3-char hex', () => {
    expect(addTransparency('#f00', 75)).toBe('rgba(255, 0, 0, 0.75)')
  })
})

describe('shiftColorTemperature', () => {
  it('warm shift increases red, slightly increases green, decreases blue', () => {
    const result = shiftColorTemperature('#808080', 25)
    // r: 128 + 25*0.8 = 148, g: 128 + 25*0.5 = 141 (rounded), b: 128 - 25*0.3 = 120 (rounded)
    expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    // Parse to verify warm shift direction
    const r = parseInt(result.slice(1, 3), 16)
    const b = parseInt(result.slice(5, 7), 16)
    expect(r).toBeGreaterThan(128) // red increased
    expect(b).toBeLessThan(128) // blue decreased
  })

  it('cool shift increases blue, decreases red', () => {
    const result = shiftColorTemperature('#808080', -25)
    const r = parseInt(result.slice(1, 3), 16)
    const b = parseInt(result.slice(5, 7), 16)
    expect(r).toBeLessThan(128) // red decreased
    expect(b).toBeGreaterThan(128) // blue increased
  })

  it('zero shift returns same color', () => {
    expect(shiftColorTemperature('#808080', 0)).toBe('#808080')
  })

  it('clamps shift to -50 to 50 range', () => {
    const result100 = shiftColorTemperature('#808080', 100)
    const result50 = shiftColorTemperature('#808080', 50)
    expect(result100).toBe(result50) // 100 clamped to 50
  })

  it('does not overflow channel values past 255', () => {
    const result = shiftColorTemperature('#ffffff', 50)
    const r = parseInt(result.slice(1, 3), 16)
    const g = parseInt(result.slice(3, 5), 16)
    const b = parseInt(result.slice(5, 7), 16)
    expect(r).toBeLessThanOrEqual(255)
    expect(g).toBeLessThanOrEqual(255)
    expect(b).toBeLessThanOrEqual(255)
  })

  it('does not underflow channel values below 0', () => {
    const result = shiftColorTemperature('#000000', -50)
    const r = parseInt(result.slice(1, 3), 16)
    const g = parseInt(result.slice(3, 5), 16)
    const b = parseInt(result.slice(5, 7), 16)
    // All channels should be valid: 0x00 floors to 0, no negatives
    expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    expect(r).toBeLessThanOrEqual(255)
    expect(g).toBeLessThanOrEqual(255)
    expect(b).toBeLessThanOrEqual(255)
  })
})

describe('calculateBulbColors', () => {
  it('returns an object with all expected color keys', () => {
    const colors = calculateBulbColors('#ffd700')

    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.off).toMatch(/^rgba\(/)
    expect(colors.blend90).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend80).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend70).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend60).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend40).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend30).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend20).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.blend10).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.onGradient).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.onGlow100).toMatch(/^rgba\(/)
    expect(colors.onGlow50).toMatch(/^rgba\(/)
    expect(colors.offGlow40).toMatch(/^rgba\(/)
    expect(colors.whiteGlow100).toBe('rgba(255, 255, 255, 1)')
  })

  it('produces warm-shifted on color (not the input color)', () => {
    const colors = calculateBulbColors('#808080')
    // Warm shift adds to red channel, so on color should differ from input
    expect(colors.on).not.toBe('#808080')
  })

  it('produces darker off color than on color', () => {
    const colors = calculateBulbColors('#ffd700')
    // Parse off color rgba to get brightness
    const offMatch = colors.off.match(/rgba\((\d+), (\d+), (\d+)/)
    const onR = parseInt(colors.on.slice(1, 3), 16)
    const offR = parseInt(offMatch![1])
    expect(offR).toBeLessThan(onR) // off is darker
  })

  it('blend values form a gradient from on to off', () => {
    const colors = calculateBulbColors('#ff6600')
    // blend90 should be closer to on, blend10 closer to off
    const b90r = parseInt(colors.blend90.slice(1, 3), 16)
    const b10r = parseInt(colors.blend10.slice(1, 3), 16)
    // blend90 (90% on) should have more red than blend10 (10% on)
    expect(b90r).toBeGreaterThan(b10r)
  })

  it('handles pure white input', () => {
    const colors = calculateBulbColors('#ffffff')
    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.off).toMatch(/^rgba\(/)
  })

  it('handles pure black input', () => {
    const colors = calculateBulbColors('#000000')
    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.off).toMatch(/^rgba\(/)
  })

  it('handles invalid color input (falls back to gold)', () => {
    const colors = calculateBulbColors('not-a-color')
    // Should use FALLBACK_COLOR (gold #ffd700) as base
    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
  })
})
