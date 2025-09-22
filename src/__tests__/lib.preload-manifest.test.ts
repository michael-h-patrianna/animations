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
})
