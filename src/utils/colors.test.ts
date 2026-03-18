import { addTransparency, blendColors, calculateBulbColors, shiftColorTemperature } from './colors'

describe('blendColors', () => {
  it('returns 100% of color1 at percentage 100', () => {
    expect(blendColors('#ff0000', '#0000ff', 100)).toBe('#ff0000')
  })

  it('returns 100% of color2 at percentage 0', () => {
    expect(blendColors('#ff0000', '#0000ff', 0)).toBe('#0000ff')
  })

  it('blends two colors at 50%', () => {
    const result = blendColors('#ff0000', '#0000ff', 50)
    // 50% blend: R = 128, G = 0, B = 128
    expect(result).toBe('#800080')
  })

  it('clamps percentage above 100 to 100', () => {
    expect(blendColors('#ff0000', '#0000ff', 150)).toBe('#ff0000')
  })

  it('clamps percentage below 0 to 0', () => {
    expect(blendColors('#ff0000', '#0000ff', -50)).toBe('#0000ff')
  })

  it('handles 3-character shorthand hex', () => {
    // #f00 → #ff0000, #00f → #0000ff
    const result = blendColors('#f00', '#00f', 50)
    expect(result).toBe('#800080')
  })

  it('handles 4-character shorthand hex with alpha (ignores alpha)', () => {
    // #f00f → #ff0000 (alpha ignored)
    const result = blendColors('#f00f', '#00ff', 50)
    expect(result).toBe('#800080')
  })

  it('handles 8-character hex with alpha (ignores alpha)', () => {
    const result = blendColors('#ff000080', '#0000ff80', 50)
    expect(result).toBe('#800080')
  })

  it('handles rgb() format', () => {
    const result = blendColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)', 50)
    expect(result).toBe('#800080')
  })

  it('handles rgba() format', () => {
    const result = blendColors('rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 50)
    expect(result).toBe('#800080')
  })

  it('handles rgb() with percentage values', () => {
    const result = blendColors('rgb(100%, 0%, 0%)', 'rgb(0%, 0%, 100%)', 50)
    expect(result).toBe('#800080')
  })

  it('falls back to gold (#ffd700) for invalid color strings', () => {
    const result = blendColors('not-a-color', '#000000', 100)
    expect(result).toBe('#ffd700')
  })

  it('blends identical colors to the same color', () => {
    expect(blendColors('#336699', '#336699', 50)).toBe('#336699')
  })

  it('handles pure black and pure white', () => {
    expect(blendColors('#000000', '#ffffff', 50)).toBe('#808080')
  })
})

describe('addTransparency', () => {
  it('returns full opacity at alpha 100', () => {
    expect(addTransparency('#ff0000', 100)).toBe('rgba(255, 0, 0, 1)')
  })

  it('returns full transparency at alpha 0', () => {
    expect(addTransparency('#ff0000', 0)).toBe('rgba(255, 0, 0, 0)')
  })

  it('returns 50% opacity at alpha 50', () => {
    expect(addTransparency('#ff0000', 50)).toBe('rgba(255, 0, 0, 0.5)')
  })

  it('clamps alpha above 100 to 1', () => {
    expect(addTransparency('#ff0000', 200)).toBe('rgba(255, 0, 0, 1)')
  })

  it('clamps alpha below 0 to 0', () => {
    expect(addTransparency('#ff0000', -50)).toBe('rgba(255, 0, 0, 0)')
  })
})

describe('shiftColorTemperature', () => {
  it('returns unchanged color at shift 0', () => {
    expect(shiftColorTemperature('#808080', 0)).toBe('#808080')
  })

  it('warms color with positive shift (increases red/green, decreases blue)', () => {
    const warm = shiftColorTemperature('#808080', 25)
    // R += 25*0.8=20 → 148, G += 25*0.5=12.5 → 141, B -= 25*0.3=7.5 → 121
    expect(warm).toBe('#948d79')
  })

  it('cools color with negative shift (decreases red, increases blue)', () => {
    const cool = shiftColorTemperature('#808080', -25)
    // R -= 25*0.4=10 → 118, G -= 25*0.2=5 → 123, B += 25*0.6=15 → 143
    expect(cool).toBe('#767b8f')
  })

  it('clamps shift above 50 to 50', () => {
    expect(shiftColorTemperature('#808080', 500)).toBe(shiftColorTemperature('#808080', 50))
  })

  it('clamps shift below -50 to -50', () => {
    expect(shiftColorTemperature('#808080', -500)).toBe(shiftColorTemperature('#808080', -50))
  })

  it('clamps output channels to 0-255', () => {
    // Pure white with max warm shift shouldn't exceed #ffffff channels
    const warm = shiftColorTemperature('#ffffff', 50)
    expect(warm).toMatch(/^#[0-9a-f]{6}$/)

    // Pure black with max cool shift shouldn't go negative
    const cool = shiftColorTemperature('#000000', -50)
    expect(cool).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('calculateBulbColors', () => {
  it('resolves CSS custom property colors before deriving bulb color steps', () => {
    document.documentElement.style.setProperty('--test-bulb-color', '#336699')

    const fromCssVar = calculateBulbColors('var(--test-bulb-color)')
    const fromHex = calculateBulbColors('#336699')

    expect(fromCssVar).toEqual(fromHex)
  })

  it('returns an object with on/off base colors and blend steps', () => {
    const result = calculateBulbColors('#ffd700')

    // Base colors
    expect(result.on).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.off).toMatch(/^rgba\(/)

    // Blend steps exist and are hex colors
    expect(result.blend90).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend80).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend70).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend60).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend40).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend30).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend20).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.blend10).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('produces glow transparency values as rgba strings', () => {
    const result = calculateBulbColors('#ffd700')

    expect(result.onGlow100).toMatch(/^rgba\(\d+, \d+, \d+, 1\)$/)
    expect(result.onGlow50).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/)
    expect(result.offGlow30).toMatch(/^rgba\(\d+, \d+, \d+, 0\.3\)$/)
  })

  it('applies warm temperature shift to on color', () => {
    const result = calculateBulbColors('#808080')
    // The 'on' color should differ from input due to warm shift
    expect(result.on).not.toBe('#808080')
  })

  it('produces stable output for the same input', () => {
    const result1 = calculateBulbColors('#ff6600')
    const result2 = calculateBulbColors('#ff6600')
    expect(result1).toEqual(result2)
  })

  it('handles edge colors: pure black', () => {
    const result = calculateBulbColors('#000000')
    expect(result.on).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.off).toMatch(/^rgba\(/)
  })

  it('handles edge colors: pure white', () => {
    const result = calculateBulbColors('#ffffff')
    expect(result.on).toMatch(/^#[0-9a-f]{6}$/)
    expect(result.off).toMatch(/^rgba\(/)
  })

  it('white glow is always pure white at full opacity', () => {
    const result = calculateBulbColors('#ffd700')
    expect(result.whiteGlow100).toBe('rgba(255, 255, 255, 1)')
  })
})
