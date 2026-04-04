import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * fontLoader has module-level state (`injected` Set) that persists across calls.
 * We use vi.resetModules() + dynamic import to get a fresh module per test.
 */

async function loadFontLoader() {
  const mod = await import('@/lib/fontLoader')
  return mod.ensureFontLoaded
}

function getInjectedStyles(): HTMLStyleElement[] {
  return Array.from(document.querySelectorAll('style[data-font]'))
}

describe('fontLoader', () => {
  beforeEach(() => {
    vi.resetModules()
    document.head.querySelectorAll('style[data-font]').forEach((el) => el.remove())
  })

  afterEach(() => {
    document.head.querySelectorAll('style[data-font]').forEach((el) => el.remove())
  })

  describe('eager fonts (no-op)', () => {
    it.each(['Inter', 'Lato', 'Comic Sans MS'])(
      'does not inject a style tag for eager font "%s"',
      async (font) => {
        const ensureFontLoaded = await loadFontLoader()
        ensureFontLoaded(font)
        expect(getInjectedStyles()).toHaveLength(0)
      }
    )
  })

  describe('lazy fonts (inject @font-face)', () => {
    it('injects Roboto with variable weight range', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Roboto')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].dataset.font).toBe('Roboto')
      expect(styles[0].textContent).toContain('font-family:Roboto')
      expect(styles[0].textContent).toContain('roboto-latin.woff2')
    })

    it('injects Ubuntu with four weight variants', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Ubuntu')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain('font-family:Ubuntu')
      // Ubuntu has 4 weights: 300, 400, 500, 700
      expect(styles[0].textContent).toContain('font-weight:300')
      expect(styles[0].textContent).toContain('font-weight:700')
    })

    it('injects Poppins with five weight variants', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Poppins')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain('font-family:Poppins')
      expect(styles[0].textContent).toContain('font-weight:300')
      expect(styles[0].textContent).toContain('font-weight:700')
    })

    it('injects Noto Sans with quoted family name', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Noto Sans')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain("font-family:'Noto Sans'")
      expect(styles[0].textContent).toContain('noto-sans-latin.woff2')
    })

    it('injects DM Sans', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('DM Sans')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain("font-family:'DM Sans'")
      expect(styles[0].textContent).toContain('dm-sans-latin.woff2')
    })

    it('injects Outfit', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Outfit')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain('font-family:Outfit')
      expect(styles[0].textContent).toContain('outfit-latin.woff2')
    })

    it('injects Space Grotesk', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Space Grotesk')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain("font-family:'Space Grotesk'")
      expect(styles[0].textContent).toContain('space-grotesk-latin.woff2')
    })

    it('injects Plus Jakarta Sans', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Plus Jakarta Sans')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain("font-family:'Plus Jakarta Sans'")
      expect(styles[0].textContent).toContain('plus-jakarta-sans-latin.woff2')
    })

    it('injects Baloo 2', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Baloo 2')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain("font-family:'Baloo 2'")
      expect(styles[0].textContent).toContain('baloo-2-latin.woff2')
    })

    it('injects IBM Plex Sans', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('IBM Plex Sans')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(1)
      expect(styles[0].textContent).toContain("font-family:'IBM Plex Sans'")
      expect(styles[0].textContent).toContain('ibm-plex-sans-latin.woff2')
    })
  })

  describe('idempotency', () => {
    it('does not inject the same font twice', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Roboto')
      ensureFontLoaded('Roboto')

      expect(getInjectedStyles()).toHaveLength(1)
    })

    it('injects different fonts independently', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Roboto')
      ensureFontLoaded('Outfit')

      const styles = getInjectedStyles()
      expect(styles).toHaveLength(2)
      expect(styles[0].dataset.font).toBe('Roboto')
      expect(styles[1].dataset.font).toBe('Outfit')
    })
  })

  describe('unknown fonts', () => {
    it('does not inject a style tag for an unrecognized font', async () => {
      const ensureFontLoaded = await loadFontLoader()
      ensureFontLoaded('Papyrus')

      expect(getInjectedStyles()).toHaveLength(0)
    })
  })
})
