/**
 * Fires a callback when CSS reduced motion is active.
 *
 * Copy-paste files: this file
 * Runtime deps: react
 */

import { useLayoutEffect, useRef, type RefObject } from 'react'

/**
 * Detects reduced motion (OS media query or catalog `data-reduced-motion` attribute)
 * and fires the callback immediately. CSS animations set `animation: none` under
 * reduced motion, preventing `animationend` events — this hook ensures `onAnimationComplete`
 * callbacks always fire.
 *
 * @param containerRef - Ref to an element inside the animation DOM
 * @param onComplete - Callback to fire when reduced motion is detected
 */
export function useCssReducedMotionCallback(
  containerRef: RefObject<HTMLElement | null>,
  onComplete?: () => void
): void {
  const firedRef = useRef(false)

  useLayoutEffect(() => {
    if (firedRef.current || !onComplete) return

    const osReduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const attrReduced = !!containerRef.current?.closest("[data-reduced-motion='reduce']")

    if (osReduced || attrReduced) {
      firedRef.current = true
      onComplete()
    }
  }, [containerRef, onComplete])
}
