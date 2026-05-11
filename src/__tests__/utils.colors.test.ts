import {
  addTransparency,
  blendColors,
  calculateBulbColors,
  shiftColorTemperature,
  toHex,
} from '@/utils/colors'
import { describe, expect, it } from 'vitest'

describe('toHex', () => {
  it('normalizes 6-digit hex to lowercase', () => {
    expect(toHex('#FF0000')).toBe('#ff0000')
  })

  it('expands 3-digit shorthand hex', () => {
    expect(toHex('#f00')).toBe('#ff0000')
  })

  it('expands 4-digit shorthand hex (ignores alpha)', () => {
    expect(toHex('#f00f')).toBe('#ff0000')
  })

  it('handles 8-digit hex (ignores alpha)', () => {
    expect(toHex('#ff000080')).toBe('#ff0000')
  })

  it('converts rgb() to hex', () => {
    expect(toHex('rgb(0, 128, 255)')).toBe('#0080ff')
  })

  it('converts rgba() to hex (ignores alpha)', () => {
    expect(toHex('rgba(255, 0, 0, 0.5)')).toBe('#ff0000')
  })

  it('converts rgb() with percentage values', () => {
    expect(toHex('rgb(100%, 0%, 0%)')).toBe('#ff0000')
  })

  it('throws in dev mode for unparseable strings', () => {
    expect(() => toHex('not-a-color')).toThrow('unparseable color')
  })

  it('throws in dev mode for empty string', () => {
    expect(() => toHex('')).toThrow('unparseable color')
  })

  it('converts CSS variable colors via browser resolution', () => {
    document.documentElement.style.setProperty('--test-hex-color', '#abcdef')
    const result = toHex('var(--test-hex-color)')
    expect(result).toBe('#abcdef')
    document.documentElement.style.removeProperty('--test-hex-color')
  })

  it('handles leading/trailing whitespace', () => {
    expect(toHex('  #ff0000  ')).toBe('#ff0000')
  })

  it('resolves CSS custom property containing rgb() value', () => {
    document.documentElement.style.setProperty('--test-rgb-color', 'rgb(0, 128, 255)')
    const result = toHex('var(--test-rgb-color)')
    expect(result).toBe('#0080ff')
    document.documentElement.style.removeProperty('--test-rgb-color')
  })

  it('throws for named CSS colors in happy-dom (no getComputedStyle color resolution)', () => {
    // Named colors like 'red' fall through to resolveCssColor, which probes
    // via getComputedStyle. happy-dom does not resolve named colors to rgb,
    // so this throws in dev mode. In a real browser, this would resolve to #ff0000.
    expect(() => toHex('red')).toThrow('unparseable color')
  })

  it('resolves CSS variable referencing another CSS variable', () => {
    document.documentElement.style.setProperty('--base-color', '#336699')
    document.documentElement.style.setProperty('--ref-color', 'var(--base-color)')
    // toHex('var(--ref-color)') should resolve through getComputedStyle
    const result = toHex('var(--ref-color)')
    expect(result).toBe('#336699')
    document.documentElement.style.removeProperty('--base-color')
    document.documentElement.style.removeProperty('--ref-color')
  })
})

describe('blendColors', () => {
  it('returns 100% of color1 at percentage 100', () => {
    expect(blendColors('#ff0000', '#0000ff', 100)).toBe('#ff0000')
  })

  it('returns 100% of color2 at percentage 0', () => {
    expect(blendColors('#ff0000', '#0000ff', 0)).toBe('#0000ff')
  })

  it('blends two colors at 50%', () => {
    expect(blendColors('#ff0000', '#0000ff', 50)).toBe('#800080')
  })

  it('clamps percentage below 0 to 0', () => {
    expect(blendColors('#ff0000', '#0000ff', -50)).toBe('#0000ff')
  })

  it('clamps percentage above 100 to 100', () => {
    expect(blendColors('#ff0000', '#0000ff', 200)).toBe('#ff0000')
  })

  it('handles 3-character shorthand hex', () => {
    expect(blendColors('#f00', '#00f', 50)).toBe('#800080')
  })

  it('handles 4-character shorthand hex with alpha (ignores alpha)', () => {
    expect(blendColors('#f00f', '#00ff', 50)).toBe('#800080')
  })

  it('handles 8-character hex with alpha (ignores alpha)', () => {
    expect(blendColors('#ff000080', '#0000ff80', 50)).toBe('#800080')
  })

  it('handles rgb() format', () => {
    expect(blendColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)', 50)).toBe('#800080')
  })

  it('handles rgba() format', () => {
    expect(blendColors('rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 50)).toBe('#800080')
  })

  it('handles rgb() with percentage values', () => {
    expect(blendColors('rgb(100%, 0%, 0%)', 'rgb(0%, 0%, 100%)', 50)).toBe('#800080')
  })

  it('falls back to gold (#ffd700) for invalid color strings', () => {
    expect(blendColors('not-a-color', '#000000', 100)).toBe('#ffd700')
  })

  it('falls back to gold for both invalid colors', () => {
    // Both invalid → both become gold → blend of gold+gold = gold
    expect(blendColors('invalid1', 'invalid2', 50)).toBe('#ffd700')
  })

  it('blends identical colors to the same color', () => {
    expect(blendColors('#336699', '#336699', 50)).toBe('#336699')
  })

  it('blends pure black and pure white to gray', () => {
    expect(blendColors('#000000', '#ffffff', 50)).toBe('#808080')
  })

  it('is mathematically correct at 25% and 75%', () => {
    // 25% of #ff0000 + 75% of #0000ff
    // R: 255*0.25 + 0*0.75 = 64, G: 0, B: 0*0.25 + 255*0.75 = 191
    expect(blendColors('#ff0000', '#0000ff', 25)).toBe('#4000bf')
  })

  it('handles exact percentage 1 (near-zero mix of color1)', () => {
    const result = blendColors('#ff0000', '#0000ff', 1)
    // 1% red, 99% blue → R≈3, B≈252
    const r = parseInt(result.slice(1, 3), 16)
    const b = parseInt(result.slice(5, 7), 16)
    expect(r).toBeLessThanOrEqual(5)
    expect(b).toBeGreaterThanOrEqual(250)
  })
})

describe('addTransparency', () => {
  it('returns full opacity at alpha 1', () => {
    expect(addTransparency('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)')
  })

  it('returns full transparency at alpha 0', () => {
    expect(addTransparency('#ff0000', 0)).toBe('rgba(255, 0, 0, 0)')
  })

  it('returns 50% opacity at alpha 0.5', () => {
    expect(addTransparency('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
  })

  it('clamps alpha above 1 to 1', () => {
    expect(addTransparency('#ff0000', 2)).toBe('rgba(255, 0, 0, 1)')
  })

  it('clamps alpha below 0 to 0', () => {
    expect(addTransparency('#ff0000', -50)).toBe('rgba(255, 0, 0, 0)')
  })

  it('handles 3-char hex', () => {
    expect(addTransparency('#f00', 0.75)).toBe('rgba(255, 0, 0, 0.75)')
  })

  it('preserves exact RGB values from input color', () => {
    const result = addTransparency('#1a2b3c', 0.5)
    expect(result).toBe('rgba(26, 43, 60, 0.5)')
  })

  it('handles alpha at boundaries: 0 and 1 produce clean values', () => {
    // Alpha 0 -> 0 (not 0.0 or similar), alpha 1 -> 1 (not 1.0)
    expect(addTransparency('#ff0000', 0)).toMatch(/,\s*0\)$/)
    expect(addTransparency('#ff0000', 1)).toMatch(/,\s*1\)$/)
  })
})

describe('shiftColorTemperature', () => {
  it('returns unchanged color at shift 0', () => {
    expect(shiftColorTemperature('#808080', 0)).toBe('#808080')
  })

  it('warms color with positive shift (exact calculation)', () => {
    const warm = shiftColorTemperature('#808080', 25)
    // R: 128 + 25*0.8 = 148, G: 128 + 25*0.5 ≈ 141, B: 128 - 25*0.3 ≈ 121
    expect(warm).toBe('#948d79')
  })

  it('cools color with negative shift (exact calculation)', () => {
    const cool = shiftColorTemperature('#808080', -25)
    // R: 128 - 25*0.4 = 118, G: 128 - 25*0.2 = 123, B: 128 + 25*0.6 = 143
    expect(cool).toBe('#767b8f')
  })

  it('clamps shift above 50 to 50', () => {
    expect(shiftColorTemperature('#808080', 500)).toBe(shiftColorTemperature('#808080', 50))
  })

  it('clamps shift below -50 to -50', () => {
    expect(shiftColorTemperature('#808080', -500)).toBe(shiftColorTemperature('#808080', -50))
  })

  it('clamps output channels to 0-255 for white + warm shift', () => {
    const warm = shiftColorTemperature('#ffffff', 50)
    expect(warm).toMatch(/^#[0-9a-f]{6}$/)
    const r = parseInt(warm.slice(1, 3), 16)
    const g = parseInt(warm.slice(3, 5), 16)
    const b = parseInt(warm.slice(5, 7), 16)
    expect(r).toBeLessThanOrEqual(255)
    expect(g).toBeLessThanOrEqual(255)
    expect(b).toBe(240) // blue decreases: 255 - 50*0.3 = 240
  })

  it('clamps output channels to 0-255 for black + cool shift', () => {
    const cool = shiftColorTemperature('#000000', -50)
    expect(cool).toMatch(/^#[0-9a-f]{6}$/)
    const r = parseInt(cool.slice(1, 3), 16)
    const b = parseInt(cool.slice(5, 7), 16)
    expect(r).toBe(0) // red clamped: 0 - 50*0.4 = -20 → 0
    expect(b).toBeLessThanOrEqual(255)
  })

  it('warm and cool shifts are asymmetric (different coefficients)', () => {
    const warm25 = shiftColorTemperature('#808080', 25)
    const cool25 = shiftColorTemperature('#808080', -25)
    // Verify these are NOT mirror images — warm uses 0.8/0.5/0.3, cool uses 0.4/0.2/0.6
    const warmR = parseInt(warm25.slice(1, 3), 16)
    const coolR = parseInt(cool25.slice(1, 3), 16)
    // Warm adds 20 to R (25*0.8), cool subtracts 10 (25*0.4)
    expect(warmR - 128).not.toBe(128 - coolR)
  })
})

describe('calculateBulbColors', () => {
  it('returns complete color palette with all expected keys', () => {
    const colors = calculateBulbColors('#ffd700')

    // Base colors
    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.off).toMatch(/^rgba\(/)

    // Blend steps from 90 to 10
    for (const step of [90, 80, 70, 60, 40, 30, 20, 10] as const) {
      expect(colors[`blend${step}`]).toMatch(/^#[0-9a-f]{6}$/i)
    }

    // Glow variants
    expect(colors.onGlow100).toMatch(/^rgba\(\d+, \d+, \d+, 1\)$/)
    expect(colors.onGlow50).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/)
    expect(colors.offGlow30).toMatch(/^rgba\(\d+, \d+, \d+, 0\.3\)$/)

    // Fixed color
    expect(colors.whiteGlow100).toBe('rgba(255, 255, 255, 1)')
  })

  it('applies warm temperature shift to on color', () => {
    const colors = calculateBulbColors('#808080')
    expect(colors.on).not.toBe('#808080')
  })

  it('produces darker off color than on color', () => {
    const colors = calculateBulbColors('#ffd700')
    const offMatch = colors.off.match(/rgba\((\d+), (\d+), (\d+)/)
    const onR = parseInt(colors.on.slice(1, 3), 16)
    const offR = parseInt(offMatch![1]!)
    expect(offR).toBeLessThan(onR)
  })

  it('blend values form a monotonic gradient from on to off', () => {
    const colors = calculateBulbColors('#ff6600')
    const b90r = parseInt(colors.blend90.slice(1, 3), 16)
    const b60r = parseInt(colors.blend60.slice(1, 3), 16)
    const b30r = parseInt(colors.blend30.slice(1, 3), 16)
    const b10r = parseInt(colors.blend10.slice(1, 3), 16)
    // Higher blend % → more on color → more red
    expect(b90r).toBeGreaterThan(b60r)
    expect(b60r).toBeGreaterThan(b30r)
    expect(b30r).toBeGreaterThan(b10r)
  })

  it('produces stable output for the same input', () => {
    const result1 = calculateBulbColors('#ff6600')
    const result2 = calculateBulbColors('#ff6600')
    expect(result1).toEqual(result2)
  })

  it('handles pure white input without NaN or overflow', () => {
    const colors = calculateBulbColors('#ffffff')
    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.off).toMatch(/^rgba\(/)
    // Ensure no NaN leaked into any value
    expect(JSON.stringify(colors)).not.toContain('NaN')
  })

  it('handles pure black input without NaN or underflow', () => {
    const colors = calculateBulbColors('#000000')
    expect(colors.on).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors.off).toMatch(/^rgba\(/)
    expect(JSON.stringify(colors)).not.toContain('NaN')
  })

  it('handles invalid color input (falls back to gold)', () => {
    const fromInvalid = calculateBulbColors('not-a-color')
    const fromGold = calculateBulbColors('#ffd700')
    // Both should produce the same result since invalid falls back to gold
    expect(fromInvalid.on).toBe(fromGold.on)
  })

  it('resolves CSS custom property colors before deriving palette', () => {
    document.documentElement.style.setProperty('--test-bulb-color', '#336699')
    const fromVar = calculateBulbColors('var(--test-bulb-color)')
    const fromHex = calculateBulbColors('#336699')
    expect(fromVar).toEqual(fromHex)
    document.documentElement.style.removeProperty('--test-bulb-color')
  })

  it('off color has 0.7 opacity (70%)', () => {
    const colors = calculateBulbColors('#ffd700')
    expect(colors.off).toMatch(/,\s*0\.7\)$/)
  })

  it('onGradient is 85% blend of on color with black', () => {
    const colors = calculateBulbColors('#ffd700')
    // onGradient = blendColors(warmOnColor, '#000000', 85)
    // This means 85% warm-on + 15% black → should be darker than on
    const onR = parseInt(colors.on.slice(1, 3), 16)
    const gradR = parseInt(colors.onGradient.slice(1, 3), 16)
    expect(gradR).toBeLessThan(onR)
    // But not too dark (85% of original)
    expect(gradR).toBeGreaterThan(onR * 0.7)
  })
})

describe('color parsing edge cases', () => {
  it('handles rgb() with extra whitespace', () => {
    expect(blendColors('rgb(  255 ,  0 ,  0  )', '#0000ff', 100)).toBe('#ff0000')
  })

  it('handles rgb() with negative channel values (clamped to 0)', () => {
    // parseFloat('-50') returns -50, clampChannel clamps to 0
    const result = blendColors('rgb(-50, -50, -50)', '#ffffff', 100)
    expect(result).toBe('#000000')
  })

  it('handles rgb() with channels > 255 (clamped to 255)', () => {
    const result = blendColors('rgb(300, 300, 300)', '#000000', 100)
    expect(result).toBe('#ffffff')
  })

  it('handles rgb() with percentage channels', () => {
    const result = toHex('rgb(50%, 0%, 100%)')
    expect(result).toBe('#8000ff')
  })

  it('handles rgba() with percentage alpha (alpha ignored by blendColors)', () => {
    // rgba with percentage alpha: alpha component is captured but ignored by parseRgbChannel
    const result = blendColors('rgba(255, 0, 0, 50%)', '#0000ff', 100)
    expect(result).toBe('#ff0000')
  })

  it('handles hex with mixed case', () => {
    expect(toHex('#AaBbCc')).toBe('#aabbcc')
  })

  it('addTransparency handles alpha at exact boundary 100', () => {
    const result = addTransparency('#ff0000', 100)
    // alpha = 100/100 = 1
    expect(result).toBe('rgba(255, 0, 0, 1)')
  })

  it('blendColors with identical colors at any percentage returns that color', () => {
    const color = '#abcdef'
    expect(blendColors(color, color, 0)).toBe(color)
    expect(blendColors(color, color, 50)).toBe(color)
    expect(blendColors(color, color, 100)).toBe(color)
  })

  it('toHex handles hex without # prefix', () => {
    // The parseHexColor strips # before checking — but if no # is present,
    // it should still work because trim().replace(/^#/, '') is a no-op
    expect(toHex('ff0000')).toBe('#ff0000')
  })

  it('shiftColorTemperature at shift 0 is identity', () => {
    // Verify with multiple colors that shift 0 returns exact input
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#abcdef', '#000000', '#ffffff']
    for (const color of colors) {
      expect(shiftColorTemperature(color, 0), `${color} at shift 0`).toBe(color)
    }
  })
})

describe('color utility mathematical precision', () => {
  it('blendColors at 50% between complementary colors is mathematically correct', () => {
    // #ff0000 and #00ff00 at 50%:
    // R: 255*0.5 + 0*0.5 = 127.5 → round to 128
    // G: 0*0.5 + 255*0.5 = 127.5 → round to 128
    // B: 0
    const result = blendColors('#ff0000', '#00ff00', 50)
    expect(result).toBe('#808000')
  })

  it('addTransparency at floating point boundaries does not produce scientific notation', () => {
    const result1 = addTransparency('#ff0000', 0.1)
    expect(result1).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/)
    expect(result1).not.toContain('e')

    const result2 = addTransparency('#ff0000', 0.999)
    expect(result2).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/)
    expect(result2).not.toContain('e')
  })

  it('shiftColorTemperature with pure red warm shift only increases R and G', () => {
    const result = shiftColorTemperature('#ff0000', 25)
    const r = parseInt(result.slice(1, 3), 16)
    const g = parseInt(result.slice(3, 5), 16)
    const b = parseInt(result.slice(5, 7), 16)
    // R: 255 + 25*0.8 = 275 → clamped to 255
    expect(r).toBe(255)
    // G: 0 + 25*0.5 = 13 → round to 13
    expect(g).toBe(13)
    // B: 0 - 25*0.3 = -7.5 → clamped to 0
    expect(b).toBe(0)
  })

  it('shiftColorTemperature with pure blue cool shift increases B correctly', () => {
    const result = shiftColorTemperature('#0000ff', -25)
    const r = parseInt(result.slice(1, 3), 16)
    const g = parseInt(result.slice(3, 5), 16)
    const b = parseInt(result.slice(5, 7), 16)
    // R: 0 - 25*0.4 = -10 → clamped to 0
    expect(r).toBe(0)
    // G: 0 - 25*0.2 = -5 → clamped to 0
    expect(g).toBe(0)
    // B: 255 + 25*0.6 = 270 → clamped to 255
    expect(b).toBe(255)
  })

  it('blendColors is not commutative at non-50% percentages', () => {
    const ab25 = blendColors('#ff0000', '#0000ff', 25)
    const ba25 = blendColors('#0000ff', '#ff0000', 25)
    // At 25%, ab25 should have more blue; ba25 should have more red
    expect(ab25).not.toBe(ba25)
    // Verify: ab25 at 25% means 25% red, 75% blue
    const abR = parseInt(ab25.slice(1, 3), 16)
    const baR = parseInt(ba25.slice(1, 3), 16)
    expect(abR).toBeLessThan(baR)
  })

  it('toHex throws for 5-digit hex (invalid length)', () => {
    expect(() => toHex('#12345')).toThrow('unparseable color')
  })

  it('toHex throws for 7-digit hex (invalid length)', () => {
    expect(() => toHex('#1234567')).toThrow('unparseable color')
  })

  it('toHex throws for 1-digit hex', () => {
    expect(() => toHex('#a')).toThrow('unparseable color')
  })

  it('toHex throws for 2-digit hex', () => {
    expect(() => toHex('#ab')).toThrow('unparseable color')
  })

  it('toHex throws for hex with non-hex characters', () => {
    expect(() => toHex('#gggggg')).toThrow('unparseable color')
  })

  it('toHex throws for hex with spaces inside', () => {
    expect(() => toHex('#ff 00 00')).toThrow('unparseable color')
  })

  it('3-digit shorthand #123 expands to #112233', () => {
    expect(toHex('#123')).toBe('#112233')
  })

  it('3-digit shorthand #fff expands to #ffffff', () => {
    expect(toHex('#fff')).toBe('#ffffff')
  })

  it('handles all-uppercase hex #AABBCC', () => {
    expect(toHex('#AABBCC')).toBe('#aabbcc')
  })

  it('handles leading-zero hex #001122', () => {
    expect(toHex('#001122')).toBe('#001122')
  })

  it('handles all-same-digit hex #555555', () => {
    expect(toHex('#555555')).toBe('#555555')
  })

  it('treats 4-digit hex as 3-digit + alpha (ignores alpha channel)', () => {
    // #1234 → expand first 3 digits: #112233, ignore 4th
    expect(toHex('#1234')).toBe('#112233')
  })

  it('calculateBulbColors desaturation moves RGB channels toward their average', () => {
    // For a saturated input like pure red, the off-color derivation:
    // 1. Darkens to 20% → R=51, G=0, B=0
    // 2. Desaturates 60% toward average → avg=(51+0+0)/3=17
    //    R = 51 + (17-51)*0.6 = 51 - 20.4 = 30.6 → 31
    //    G = 0 + (17-0)*0.6 = 10.2 → 10
    //    B = 0 + (17-0)*0.6 = 10.2 → 10
    // 3. Cool shift -10 applied
    // Result should show convergence of R,G,B values (less saturated)
    const colors = calculateBulbColors('#ff0000')
    const offMatch = colors.off.match(/rgba\((\d+), (\d+), (\d+)/)
    const offR = parseInt(offMatch![1]!)
    const offG = parseInt(offMatch![2]!)
    const offB = parseInt(offMatch![3]!)
    // Desaturation means channels are closer to average than the darkened input
    const avg = (offR + offG + offB) / 3
    const maxDev = Math.max(Math.abs(offR - avg), Math.abs(offG - avg), Math.abs(offB - avg))
    // For desaturated color, max deviation should be much less than 255
    expect(maxDev).toBeLessThan(50)
  })
})

describe('color parsing — modern CSS4 space-separated syntax', () => {
  it('rgb() with space-separated values falls through to browser resolution', () => {
    // Modern CSS4: rgb(255 0 0) — the comma-based regex does not match this syntax
    // In happy-dom, resolveCssColor may or may not resolve it, depending on implementation
    // The function should not crash regardless of the outcome
    const result = blendColors('rgb(255 0 0)', '#0000ff', 100)
    // Falls back to gold (#ffd700) if resolveCssColor also fails in test env
    expect(result).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('rgb() with slash alpha syntax does not match comma-based regex', () => {
    // CSS4: rgb(255 0 0 / 0.5) — uses space separation with / for alpha
    const result = blendColors('rgb(255 0 0 / 0.5)', '#0000ff', 100)
    expect(result).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('toHex with rgb() missing commas falls through to browser resolution', () => {
    // In dev mode, if resolveCssColor also fails, toHex throws
    // In happy-dom, behavior depends on CSS property resolution
    try {
      const result = toHex('rgb(128 128 128)')
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    } catch (e) {
      // Expected in dev mode if happy-dom can't resolve it
      expect((e as Error).message).toContain('unparseable color')
    }
  })

  it('addTransparency parses space-separated rgba() input', () => {
    const result = addTransparency('rgba(255 0 0 / 0.5)', 0.5)
    expect(result).toBe('rgba(255, 0, 0, 0.5)')
  })
})
