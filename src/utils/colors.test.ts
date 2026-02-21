import { blendColors, calculateBulbColors, shiftColorTemperature } from './colors'

describe('calculateBulbColors', () => {
  it('resolves CSS custom property colors before deriving bulb color steps', () => {
    document.documentElement.style.setProperty('--test-bulb-color', '#336699')

    const fromCssVar = calculateBulbColors('var(--test-bulb-color)')
    const fromHex = calculateBulbColors('#336699')

    expect(fromCssVar).toEqual(fromHex)
  })

  it('clamps blend percentage to documented 0-100 bounds', () => {
    expect(blendColors('#ff0000', '#0000ff', 150)).toBe('#ff0000')
    expect(blendColors('#ff0000', '#0000ff', -50)).toBe('#0000ff')
  })

  it('clamps temperature shift to documented -50 to 50 bounds', () => {
    expect(shiftColorTemperature('#808080', 500)).toBe(shiftColorTemperature('#808080', 50))
    expect(shiftColorTemperature('#808080', -500)).toBe(shiftColorTemperature('#808080', -50))
  })
})
