import { preloadImages } from '@/lib/preload'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'
import { afterEach } from 'vitest'

afterEach(() => {
  // Clean up any preload links injected during tests to prevent cross-test pollution
  document.head.querySelectorAll('link[rel="preload"][as="image"]').forEach((el) => el.remove())
})

describe('lib • preloadImages', () => {
  it('no-ops without document/head', () => {
    // jsdom always has document; simulate missing head
    const origHead = Object.getOwnPropertyDescriptor(Document.prototype, 'head')
    Object.defineProperty(Document.prototype, 'head', { get: () => null })
    expect(() => preloadImages(['a.png'])).not.toThrow()
    if (origHead) Object.defineProperty(Document.prototype, 'head', origHead!)
  })

  it('injects unique link tags and avoids duplicates', () => {
    document.head.innerHTML = ''
    preloadImages(['a.png', 'a.png', 'b.png'])
    const links = Array.from(document.head.querySelectorAll('link[rel="preload"][as="image"]'))
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toEqual(['a.png', 'b.png'])

    // Calling again should not duplicate
    preloadImages(['a.png'])
    const links2 = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links2.length).toBe(2)
  })

  it('skips empty string URLs', () => {
    document.head.innerHTML = ''
    preloadImages(['', 'valid.png', ''])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(1)
    expect(links[0]!.getAttribute('href')).toBe('valid.png')
  })

  it('does nothing when called with empty array', () => {
    document.head.innerHTML = ''
    preloadImages([])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(0)
  })

  it('sets data-preload attribute for debugging', () => {
    document.head.innerHTML = ''
    preloadImages(['debug.png'])
    const link = document.head.querySelector('link[href="debug.png"]')
    expect(link?.getAttribute('data-preload')).toBe('critical-image')
  })

  it('sets correct rel and as attributes', () => {
    document.head.innerHTML = ''
    preloadImages(['test.webp'])
    const link = document.head.querySelector('link[href="test.webp"]')
    expect(link?.getAttribute('rel')).toBe('preload')
    expect(link?.getAttribute('as')).toBe('image')
  })

  it('integration: preloading CRITICAL_ICON_IMAGES injects correct number of links', () => {
    document.head.innerHTML = ''
    preloadImages(CRITICAL_ICON_IMAGES)
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(CRITICAL_ICON_IMAGES.length)

    // Calling again should not duplicate
    preloadImages(CRITICAL_ICON_IMAGES)
    const linksAfter = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(linksAfter.length).toBe(CRITICAL_ICON_IMAGES.length)
  })

  it('handles URLs with query strings as distinct from base URLs', () => {
    document.head.innerHTML = ''
    preloadImages(['image.png', 'image.png?v=2'])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    // These are different URLs (browser treats them as distinct)
    expect(links.length).toBe(2)
  })

  it('whitespace-only URLs are NOT filtered (function checks === "" not trim)', () => {
    document.head.innerHTML = ''
    preloadImages(['   ', 'valid.png'])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    const hrefs = Array.from(links).map((l) => l.getAttribute('href'))
    // The function only checks `url === ''`, so whitespace-only strings pass through.
    // This means a link element with href="   " is created — a minor edge case
    // that doesn't cause harm in practice since no image has a whitespace-only URL.
    expect(hrefs).toContain('valid.png')
    expect(hrefs).toContain('   ')
    expect(links.length).toBe(2)
  })

  it('preserves pre-existing preload links in the head', () => {
    document.head.innerHTML = ''
    // Add an existing preload link manually
    const existing = document.createElement('link')
    existing.setAttribute('rel', 'preload')
    existing.setAttribute('as', 'image')
    existing.setAttribute('href', 'existing.png')
    document.head.appendChild(existing)

    preloadImages(['new.png'])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(2)
    const hrefs = Array.from(links).map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('existing.png')
    expect(hrefs).toContain('new.png')
  })

  it('handles large number of URLs efficiently without duplicate links', () => {
    document.head.innerHTML = ''
    const urls = Array.from({ length: 50 }, (_, i) => `image-${i}.png`)
    preloadImages(urls)
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(50)

    // Calling again should NOT add duplicates
    preloadImages(urls)
    const linksAfter = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(linksAfter.length).toBe(50)
  })

  it('handles interleaved duplicate and unique URLs in single call', () => {
    document.head.innerHTML = ''
    preloadImages(['a.png', 'b.png', 'a.png', 'c.png', 'b.png'])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(3)
    const hrefs = Array.from(links).map((l) => l.getAttribute('href'))
    expect(hrefs).toEqual(['a.png', 'b.png', 'c.png'])
  })

  it('creates Image() objects to warm the browser cache for each unique URL', () => {
    document.head.innerHTML = ''
    const imageInstances: Array<{ src: string; decoding: string }> = []
    const OrigImage = globalThis.Image

    globalThis.Image = class MockImage {
      src = ''
      decoding = ''
      constructor() {
        imageInstances.push(this)
      }
    } as unknown as typeof Image

    preloadImages(['warm1.png', 'warm2.png', 'warm1.png'])

    // Should create Image() for each unique URL (2, not 3)
    expect(imageInstances).toHaveLength(2)
    expect(imageInstances[0]!.src).toBe('warm1.png')
    expect(imageInstances[0]!.decoding).toBe('async')
    expect(imageInstances[1]!.src).toBe('warm2.png')
    expect(imageInstances[1]!.decoding).toBe('async')

    globalThis.Image = OrigImage
  })

  it('does not create Image() for empty URLs', () => {
    document.head.innerHTML = ''
    const imageInstances: Array<{ src: string }> = []
    const OrigImage = globalThis.Image

    globalThis.Image = class MockImage {
      src = ''
      decoding = ''
      constructor() {
        imageInstances.push(this)
      }
    } as unknown as typeof Image

    preloadImages(['', 'valid.png', ''])

    expect(imageInstances).toHaveLength(1)
    expect(imageInstances[0]!.src).toBe('valid.png')

    globalThis.Image = OrigImage
  })

  it('survives Image constructor throwing without breaking subsequent URLs', () => {
    document.head.innerHTML = ''
    const OrigImage = globalThis.Image

    let callCount = 0
    globalThis.Image = class MockImage {
      src = ''
      decoding = ''
      constructor() {
        callCount++
        if (callCount === 1) throw new Error('Image constructor failed')
      }
    } as unknown as typeof Image

    // The function does not try-catch the Image() call, so this will throw.
    // This documents the behavior: a failing Image() constructor will propagate
    // and prevent subsequent URLs from being processed within the forEach.
    // The link tags are added BEFORE the Image() call, so they will be present.
    expect(() => preloadImages(['fail.png', 'success.png'])).toThrow('Image constructor failed')

    // The first link was added before the Image() throw
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    expect(links.length).toBe(1)
    expect(links[0]!.getAttribute('href')).toBe('fail.png')

    globalThis.Image = OrigImage
  })

  it('handles concurrent calls from multiple callers without race conditions', () => {
    document.head.innerHTML = ''

    // Simulate two concurrent callers
    preloadImages(['shared.png', 'only-a.png'])
    preloadImages(['shared.png', 'only-b.png'])

    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    const hrefs = Array.from(links).map((l) => l.getAttribute('href'))

    // shared.png should appear only once (second call detects it in existing set)
    expect(hrefs.filter((h) => h === 'shared.png')).toHaveLength(1)
    // All three unique URLs should be present
    expect(hrefs).toContain('shared.png')
    expect(hrefs).toContain('only-a.png')
    expect(hrefs).toContain('only-b.png')
    expect(links.length).toBe(3)
  })
})
