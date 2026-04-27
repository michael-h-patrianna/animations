import { useEffect, useRef, useState } from 'react'

const DEFAULT_TIMEOUT_MS = 3000

/**
 * Preloads an array of image URLs and reports readiness.
 *
 * - Returns `{ ready: true }` immediately when `images` is empty or undefined.
 * - Preloads all images in parallel. Resolves when all succeed or any fail gracefully.
 * - After `timeoutMs`, gives up on remaining images and marks `timedOut: true`.
 *   The animation should fall back to SVG particles when timed out.
 *
 * @param images - URLs to preload (max 10, enforced by caller via clampImages)
 * @param timeoutMs - Maximum wait before falling back (default 3000ms)
 */
export function useImagePreloader(
  images?: string[],
  timeoutMs = DEFAULT_TIMEOUT_MS
): { ready: boolean; timedOut: boolean } {
  // Stabilize the images reference by content. Callers that pass an inline
  // array on every render (or strict-mode double-renders) would otherwise
  // re-trigger the preload effect on every render, even when the URLs are
  // identical. Comparing by joined content ensures the effect only re-runs
  // when the URL set actually changes.
  const imagesKey = (images ?? []).join('\x01')
  const stableImagesRef = useRef<string[] | undefined>(images)
  const prevKeyRef = useRef<string | null>(null)
  if (prevKeyRef.current !== imagesKey) {
    prevKeyRef.current = imagesKey
    stableImagesRef.current = images
  }
  const stableImages = stableImagesRef.current

  const [ready, setReady] = useState(!stableImages || stableImages.length === 0)
  const [timedOut, setTimedOut] = useState(false)

  // Reset gate state when the image set changes (during render, not in effect).
  // Using `prevImages !== stableImages` keeps this a no-op for renders where the
  // content is unchanged, so it never cascades on the timer-fired re-render.
  const [prevImages, setPrevImages] = useState(stableImages)
  if (prevImages !== stableImages) {
    setPrevImages(stableImages)
    setReady(stableImages === undefined || stableImages.length === 0)
    setTimedOut(false)
  }

  useEffect(() => {
    if (stableImages === undefined || stableImages.length === 0) return

    // Per-effect-run flag — captured by the closures below — so a stale
    // promise from a previous image set cannot flip ready=true on the new one.
    let cancelled = false

    const timeout = globalThis.setTimeout(() => {
      if (cancelled) return
      setTimedOut(true)
      setReady(true)
    }, timeoutMs)

    Promise.all(
      stableImages.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve() // graceful — fallback will handle it
            img.src = src
          })
      )
    ).then(() => {
      if (cancelled) return
      globalThis.clearTimeout(timeout)
      setReady(true)
    })

    return () => {
      cancelled = true
      globalThis.clearTimeout(timeout)
    }
  }, [stableImages, timeoutMs])

  return { ready, timedOut }
}
