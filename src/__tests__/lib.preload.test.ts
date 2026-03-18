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
    expect(links[0].getAttribute('href')).toBe('valid.png')
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
})
