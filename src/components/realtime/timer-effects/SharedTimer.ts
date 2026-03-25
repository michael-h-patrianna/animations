/**
 * Shared countdown hook for all timer-effect animations.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import type {
  CountdownState,
  TimerEndBehavior,
  TimerMode,
  TimerPhase,
  TimerPhaseThresholds,
} from './SharedTypes'

/** Tick interval in milliseconds. Both modes tick at this rate. */
const TICK_MS = 100

/** Delay (ms) after expiry before setting `isHidden` when `onEndBehavior === 'hide'`. */
const HIDE_DELAY_MS = 600

interface UseCountdownOptions {
  startSeconds: number
  mode: TimerMode
  thresholds: Required<TimerPhaseThresholds>
  onEnd?: () => void
  onEndBehavior: TimerEndBehavior
}

function resolveCountdownSnapshot(startSeconds: number) {
  const alreadyExpired = startSeconds <= 0

  return {
    seconds: alreadyExpired ? 0 : startSeconds,
    progress: alreadyExpired ? 1 : 0,
    isExpired: alreadyExpired,
  }
}

function resolvePhase(
  secondsRemaining: number,
  thresholds: Required<TimerPhaseThresholds>
): TimerPhase {
  if (secondsRemaining <= thresholds.critical) return 'critical'
  if (secondsRemaining <= thresholds.warning) return 'warning'
  return 'normal'
}

/**
 * Countdown hook used by all timer-effect animations.
 *
 * - `'visual'` mode: accumulates elapsed time from interval ticks. Smooth in foreground,
 *   pauses when tab is backgrounded.
 * - `'exact'` mode: reads `Date.now()` each tick. Precise, but may jump after tab resume.
 *
 * The hook fires `onEnd` exactly once when the timer reaches zero.
 * When `onEndBehavior === 'hide'`, `isHidden` becomes `true` after a fade-out delay.
 */
export function useCountdown({
  startSeconds,
  mode,
  thresholds,
  onEnd,
  onEndBehavior,
}: UseCountdownOptions): CountdownState {
  const initialSnapshot = resolveCountdownSnapshot(startSeconds)
  const [seconds, setSeconds] = useState(initialSnapshot.seconds)
  const [progress, setProgress] = useState(initialSnapshot.progress)
  const [isExpired, setIsExpired] = useState(initialSnapshot.isExpired)
  const [isHidden, setIsHidden] = useState(false)

  // Stable reference for onEnd to avoid re-subscribing the interval
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd

  const onEndFiredRef = useRef(false)

  const fireOnEnd = useCallback(() => {
    if (!onEndFiredRef.current) {
      onEndFiredRef.current = true
      onEndRef.current?.()
    }
  }, [])

  useLayoutEffect(() => {
    // Every startSeconds/mode change is a new countdown run.
    onEndFiredRef.current = false
    const nextSnapshot = resolveCountdownSnapshot(startSeconds)

    // Prop-driven restarts must synchronously rebase the visible snapshot before paint.
    setSeconds(nextSnapshot.seconds)
    setProgress(nextSnapshot.progress)
    setIsExpired(nextSnapshot.isExpired)
    setIsHidden(false)

    if (nextSnapshot.isExpired) {
      fireOnEnd()
      return
    }

    const startTime = Date.now()
    let visualAccumulator = 0
    let lastDisplay = nextSnapshot.seconds

    const intervalId = setInterval(() => {
      let elapsedSeconds: number

      if (mode === 'exact') {
        elapsedSeconds = (Date.now() - startTime) / 1000
      } else {
        visualAccumulator += TICK_MS
        elapsedSeconds = visualAccumulator / 1000
      }

      const remaining = Math.max(0, startSeconds - elapsedSeconds)
      const displaySeconds = Math.ceil(remaining)

      // Smooth progress updated every tick (100ms) for continuous visual interpolation
      setProgress(Math.min(1, elapsedSeconds / startSeconds))

      if (displaySeconds !== lastDisplay) {
        setSeconds(displaySeconds)
        lastDisplay = displaySeconds
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
        setSeconds(0)
        setProgress(1)
        setIsExpired(true)
        fireOnEnd()
      }
    }, TICK_MS)

    return () => clearInterval(intervalId)
  }, [startSeconds, mode, fireOnEnd])

  // Hide delay after expiry
  useEffect(() => {
    if (!isExpired || onEndBehavior !== 'hide') return

    const timeoutId = setTimeout(() => {
      setIsHidden(true)
    }, HIDE_DELAY_MS)

    return () => clearTimeout(timeoutId)
  }, [isExpired, onEndBehavior])

  const phase = resolvePhase(seconds, thresholds)

  return { seconds, phase, progress, isExpired, isHidden }
}
