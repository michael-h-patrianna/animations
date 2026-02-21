import { presentBox, presentBoxBalloon, pulseScroll, shakeIcon } from '@/assets'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'

describe('lib • preload-manifest', () => {
  it('exports a non-empty list of critical icon images', () => {
    expect(Array.isArray(CRITICAL_ICON_IMAGES)).toBe(true)
    expect(CRITICAL_ICON_IMAGES.length).toBeGreaterThan(0)
    for (const entry of CRITICAL_ICON_IMAGES) {
      const s = String(entry)
      expect(typeof s).toBe('string')
      expect(s.length).toBeGreaterThan(0)
    }
  })

  it('does not preload heavyweight optional demo assets at startup', () => {
    const preloaded = new Set(CRITICAL_ICON_IMAGES)
    expect(preloaded.has(presentBox)).toBe(false)
    expect(preloaded.has(presentBoxBalloon)).toBe(false)
    expect(preloaded.has(pulseScroll)).toBe(false)
    expect(preloaded.has(shakeIcon)).toBe(false)
  })
})
