import { calculateBulbColors } from './colors'

describe('calculateBulbColors', () => {
  it('resolves CSS custom property colors before deriving bulb color steps', () => {
    document.documentElement.style.setProperty('--test-bulb-color', '#336699')

    const fromCssVar = calculateBulbColors('var(--test-bulb-color)')
    const fromHex = calculateBulbColors('#336699')

    expect(fromCssVar).toEqual(fromHex)
  })
})
