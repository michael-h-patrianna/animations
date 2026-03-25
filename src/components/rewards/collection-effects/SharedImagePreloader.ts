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
  const [ready, setReady] = useState(!images || images.length === 0)
  const [timedOut, setTimedOut] = useState(false)
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (images === undefined || images.length === 0) return

    cancelledRef.current = false

    const timeout = globalThis.setTimeout(() => {
      if (!cancelledRef.current) {
        setTimedOut(true)
        setReady(true)
      }
    }, timeoutMs)

    Promise.all(
      images.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve() // graceful — fallback will handle it
            img.src = src
          })
      )
    ).then(() => {
      if (!cancelledRef.current) {
        globalThis.clearTimeout(timeout)
        setReady(true)
      }
    })

    return () => {
      cancelledRef.current = true
      globalThis.clearTimeout(timeout)
    }
  }, [images, timeoutMs])

  return { ready, timedOut }
}
