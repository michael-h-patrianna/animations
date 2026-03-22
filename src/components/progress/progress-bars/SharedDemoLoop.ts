import { useCallback, useEffect, useRef, useState } from 'react'

interface DemoLoopOptions {
  /** Duration of one 0→1 sweep in milliseconds. Default 4000. */
  duration?: number

  /** Pause at 100 % before resetting, in milliseconds. Default 1200. */
  pause?: number
}

const DEFAULT_DURATION = 4000
const DEFAULT_PAUSE = 1200

/**
 * Drives a 0→1 progress loop when no external progress is bound.
 *
 * - When `externalProgress` is a number: returns it unchanged (controlled mode).
 * - When `undefined`: runs an internal requestAnimationFrame loop that sweeps
 *   from 0 → 1, pauses, then resets. The component self-demos in the catalog.
 */
export function useDemoProgress(
  externalProgress: number | undefined,
  options?: DemoLoopOptions
): number {
  const duration = options?.duration ?? DEFAULT_DURATION
  const pause = options?.pause ?? DEFAULT_PAUSE
  const [internal, setInternal] = useState(0)

  useEffect(() => {
    if (externalProgress !== undefined) return

    let rafId = 0
    let startTime = performance.now()
    let pausing = false
    let pauseStart = 0

    const frame = (now: number) => {
      if (pausing) {
        if (now - pauseStart >= pause) {
          pausing = false
          startTime = now
          setInternal(0)
        }
      } else {
        const elapsed = now - startTime
        const p = Math.min(elapsed / duration, 1)
        setInternal(p)

        if (p >= 1) {
          pausing = true
          pauseStart = now
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [externalProgress, duration, pause])

  if (externalProgress !== undefined) return externalProgress
  return internal
}

/**
 * Drives a 0→1→0 ping-pong progress loop when no external progress is bound.
 * Useful for bars that visualise drain/recharge cycles (e.g., stamina).
 *
 * Returns `{ value, direction }` where direction is `'up'` or `'down'`.
 */
export function useDemoPingPong(
  externalProgress: number | undefined,
  options?: DemoLoopOptions
): { value: number; direction: 'up' | 'down' } {
  const duration = options?.duration ?? DEFAULT_DURATION
  const pause = options?.pause ?? DEFAULT_PAUSE
  const [internal, setInternal] = useState(0)
  const directionRef = useRef<'up' | 'down'>('up')
  const [direction, setDirection] = useState<'up' | 'down'>('up')

  const updateDirection = useCallback((d: 'up' | 'down') => {
    directionRef.current = d
    setDirection(d)
  }, [])

  useEffect(() => {
    if (externalProgress !== undefined) return

    let rafId = 0
    let startTime = performance.now()
    let pausing = false
    let pauseStart = 0

    const frame = (now: number) => {
      if (pausing) {
        if (now - pauseStart >= pause) {
          pausing = false
          startTime = now
          updateDirection(directionRef.current === 'up' ? 'down' : 'up')
        }
      } else {
        const elapsed = now - startTime
        const raw = Math.min(elapsed / duration, 1)
        const p = directionRef.current === 'up' ? raw : 1 - raw
        setInternal(p)

        if (raw >= 1) {
          pausing = true
          pauseStart = now
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [externalProgress, duration, pause, updateDirection])

  if (externalProgress !== undefined) return { value: externalProgress, direction: 'up' }
  return { value: internal, direction }
}
