import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'
import { describe, expect, it } from 'vitest'

describe('preload-manifest', () => {
  it('exports at least 2 image URLs', () => {
    expect(CRITICAL_ICON_IMAGES.length).toBeGreaterThanOrEqual(2)
  })

  it('all entries are non-empty Vite-resolved asset paths', () => {
    for (const url of CRITICAL_ICON_IMAGES) {
      // Vite resolves imports to paths like /assets/icon-abc123.svg or data URIs
      expect(url, `Invalid URL in CRITICAL_ICON_IMAGES`).toMatch(/^(\/|data:)/)
    }
  })

  it('contains no duplicate URLs', () => {
    const unique = new Set(CRITICAL_ICON_IMAGES)
    expect(unique.size).toBe(CRITICAL_ICON_IMAGES.length)
  })
})
