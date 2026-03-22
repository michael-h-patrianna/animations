import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `target` over `durationMs` with cubic ease-out,
 * starting after `delayMs`. Returns a formatted display string.
 *
 * @param target - Final numeric value
 * @param durationMs - Animation duration in milliseconds
 * @param delayMs - Delay before animation starts in milliseconds
 * @param decimals - Number of decimal places (0 for integer with locale formatting)
 * @returns Formatted string of the current animated value
 */
export function useCountUp(target: number, durationMs: number, delayMs: number, decimals: number) {
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0')
  const rafRef = useRef(0)
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const start = performance.now()
      const tick = () => {
        const elapsed = performance.now() - start
        const t = Math.min(elapsed / durationMs, 1)
        const eased = 1 - (1 - t) ** 3
        const current = target * eased
        if (t < 1) {
          setDisplay(
            decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString()
          )
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(decimals > 0 ? target.toFixed(decimals) : target.toLocaleString())
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delayMs)
    return () => {
      window.clearTimeout(timeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs, delayMs, decimals])
  return display
}
