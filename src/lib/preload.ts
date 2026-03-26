// Retained references prevent premature GC of Image objects while their
// network requests are in-flight. Modern engines handle this correctly,
// but explicit retention is belt-and-suspenders defense.
const retainedImages = new Set<HTMLImageElement>()

/**
 * Inject <link rel="preload" as="image"> tags into the document head for provided image URLs.
 * - Idempotent: avoids duplicating links if already present
 * - Safe to call multiple times
 */
export function preloadImages(urls: string[]) {
  if (typeof document === 'undefined') return

  const head = document.head
  const existing = new Set(
    Array.from(head.querySelectorAll('link[rel="preload"][as="image"]'))
      .map((el) => el.getAttribute('href') ?? '')
      .filter((href) => href !== '')
  )

  // Track URLs added during this invocation to avoid duplicates within the provided array
  const added = new Set<string>()

  urls.forEach((url) => {
    if (url === '' || existing.has(url) || added.has(url)) return

    const link = document.createElement('link')
    link.setAttribute('rel', 'preload')
    link.setAttribute('as', 'image')
    link.setAttribute('href', url)

    // Optional: mark for debugging/inspection
    link.setAttribute('data-preload', 'critical-image')

    head.appendChild(link)

    // Mark as added to prevent duplicates within the same call
    added.add(url)

    // Defense-in-depth: <link rel="preload" as="image"> is the primary mechanism,
    // but some browsers (notably older WebKit) don't honor preload for images.
    // The Image() constructor triggers a separate fetch that the browser cache
    // satisfies from the preload response, so no double-download occurs when
    // preload is supported. When preload is NOT supported, this ensures the
    // image is still in cache before first paint.
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    retainedImages.add(img)
    img.onload = img.onerror = () => retainedImages.delete(img)
  })
}
