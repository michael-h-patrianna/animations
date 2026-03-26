/**
 * Hook that monitors animation frame timing to detect dropped frames.
 *
 * Uses `requestAnimationFrame` timestamp deltas to identify when the browser
 * fails to maintain 60fps (>20ms between frames indicates a dropped frame).
 *
 * **Dev-mode only** — returns static zero values in production to avoid
 * any runtime overhead from the rAF loop.
 *
 * @param active - Whether to run the monitor. Pass `false` to pause.
 * @returns Current FPS and count of dropped frames since activation
 *
 * @example
 * ```tsx
 * function AnimationDebugOverlay({ animationId }: { animationId: string }) {
 *   const { fps, droppedFrames } = useFrameMonitor(true)
 *   return (
 *     <div>
 *       {fps} FPS | {droppedFrames} dropped
 *     </div>
 *   )
 * }
 * ```
 */

import { useEffect, useRef, useState } from 'react'

interface FrameMonitorState {
  /** Current frames per second (smoothed over ~1 second). */
  fps: number
  /** Total dropped frames since the monitor was activated. */
  droppedFrames: number
}

const IDLE_STATE: FrameMonitorState = { fps: 0, droppedFrames: 0 }

/** Threshold in ms — frames longer than this are considered dropped (60fps = 16.67ms). */
const DROP_THRESHOLD_MS = 20

/** Monitors rAF frame timing to detect dropped frames. Dev-mode only — returns zeros in production. */
export function useFrameMonitor(active: boolean): FrameMonitorState {
  const [state, setState] = useState<FrameMonitorState>(IDLE_STATE)
  const stateRef = useRef(IDLE_STATE)

  useEffect(() => {
    // No-op in production — zero overhead
    if (!import.meta.env.DEV || !active) {
      setState(IDLE_STATE)
      stateRef.current = IDLE_STATE
      return
    }

    let rafId: number
    let lastTime = performance.now()
    let dropped = stateRef.current.droppedFrames
    let fpsAccumulator = 0
    let fpsFrames = 0

    const tick = (now: number) => {
      const delta = now - lastTime
      lastTime = now

      if (delta > DROP_THRESHOLD_MS) {
        // Estimate how many frames were missed
        dropped += Math.floor(delta / 16.67) - 1
      }

      fpsAccumulator += delta
      fpsFrames++

      // Update state approximately once per second
      if (fpsAccumulator >= 1000) {
        const fps = Math.round((fpsFrames / fpsAccumulator) * 1000)
        const next: FrameMonitorState = { fps, droppedFrames: dropped }
        stateRef.current = next
        setState(next)
        fpsAccumulator = 0
        fpsFrames = 0
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [active])

  return state
}
