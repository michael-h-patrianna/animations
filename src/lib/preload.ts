/**
 * Inject <link rel="preload" as="image"> tags into the document head for provided image URLs.
 * - Idempotent: avoids duplicating links if already present
 * - Safe to call multiple times
 */
export function preloadImages(urls: string[]) {
  if (typeof document === 'undefined') return

  const head = document.head || document.getElementsByTagName('head')[0]
  if (!head) return

  const existing = new Set(
    Array.from(head.querySelectorAll('link[rel="preload"][as="image"]'))
      .map((el) => el.getAttribute('href') || '')
      .filter(Boolean)
  )

  // Track URLs added during this invocation to avoid duplicates within the provided array
  const added = new Set<string>()

  urls.forEach((url) => {
    if (!url || existing.has(url) || added.has(url)) return

    const link = document.createElement('link')
    link.setAttribute('rel', 'preload')
    link.setAttribute('as', 'image')
    link.setAttribute('href', url)

    // Optional: mark for debugging/inspection
    link.setAttribute('data-preload', 'critical-image')

    head.appendChild(link)

    // Mark as added to prevent duplicates within the same call
    added.add(url)

    // Also kick off an Image() request to warm cache in browsers that don’t strictly use <link> for images
    // This is safe and won’t double-download because the URL will be cached.
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  })
}
