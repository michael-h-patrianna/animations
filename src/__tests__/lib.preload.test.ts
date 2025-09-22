import { preloadImages } from '@/lib/preload'

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
})
