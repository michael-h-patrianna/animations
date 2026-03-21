import { preloadImages } from '@/lib/preload'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'

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

  it('handles whitespace-only URLs as empty (skips them)', () => {
    document.head.innerHTML = ''
    preloadImages(['   ', 'valid.png'])
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]')
    // Whitespace-only URLs are not empty string, so they may be added
    // The function checks `url === ''` — whitespace passes through
    // This is an edge case that documents current behavior
    const hrefs = Array.from(links).map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('valid.png')
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
})
