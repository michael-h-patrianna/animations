import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import type { TimerPhaseThresholds } from '@/components/realtime/timer-effects/SharedTypes'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const DEFAULT_THRESHOLDS: Required<TimerPhaseThresholds> = { warning: 10, critical: 5 }

function renderCountdown(overrides?: {
  startSeconds?: number
  mode?: 'visual' | 'exact'
  thresholds?: Required<TimerPhaseThresholds>
  onEnd?: () => void
  onEndBehavior?: 'hide' | 'stay'
  progressMode?: 'smooth' | 'discrete'
}) {
  return renderHook(() =>
    useCountdown({
      startSeconds: overrides?.startSeconds ?? 30,
      mode: overrides?.mode ?? 'visual',
      thresholds: overrides?.thresholds ?? DEFAULT_THRESHOLDS,
      onEnd: overrides?.onEnd,
      onEndBehavior: overrides?.onEndBehavior ?? 'stay',
      progressMode: overrides?.progressMode,
    })
  )
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('useCountdown', () => {
  describe('initial state', () => {
    it('starts with full seconds and zero progress for a positive startSeconds', () => {
      const { result } = renderCountdown({ startSeconds: 30 })

      expect(result.current.seconds).toBe(30)
      expect(result.current.progress).toBe(0)
      expect(result.current.isExpired).toBe(false)
      expect(result.current.isHidden).toBe(false)
    })

    it('starts at phase "normal" when seconds > warning threshold', () => {
      const { result } = renderCountdown({
        startSeconds: 30,
        thresholds: { warning: 10, critical: 5 },
      })

      expect(result.current.phase).toBe('normal')
    })

    it('starts at phase "warning" when startSeconds <= warning but > critical', () => {
      const { result } = renderCountdown({
        startSeconds: 8,
        thresholds: { warning: 10, critical: 5 },
      })

      expect(result.current.phase).toBe('warning')
    })

    it('starts at phase "critical" when startSeconds <= critical', () => {
      const { result } = renderCountdown({
        startSeconds: 3,
        thresholds: { warning: 10, critical: 5 },
      })

      expect(result.current.phase).toBe('critical')
    })
  })

  describe('already-expired timers (startSeconds <= 0)', () => {
    it('starts with seconds=0, progress=1, isExpired=true for startSeconds=0', () => {
      const { result } = renderCountdown({ startSeconds: 0 })

      expect(result.current.seconds).toBe(0)
      expect(result.current.progress).toBe(1)
      expect(result.current.isExpired).toBe(true)
    })

    it('starts expired for negative startSeconds', () => {
      const { result } = renderCountdown({ startSeconds: -5 })

      expect(result.current.seconds).toBe(0)
      expect(result.current.progress).toBe(1)
      expect(result.current.isExpired).toBe(true)
    })

    it('fires onEnd immediately for startSeconds=0', () => {
      const onEnd = vi.fn()
      renderCountdown({ startSeconds: 0, onEnd })

      expect(onEnd).toHaveBeenCalledOnce()
    })

    it('fires onEnd immediately for negative startSeconds', () => {
      const onEnd = vi.fn()
      renderCountdown({ startSeconds: -10, onEnd })

      expect(onEnd).toHaveBeenCalledOnce()
    })

    it('does not create an interval for startSeconds <= 0', () => {
      renderCountdown({ startSeconds: 0 })

      // Advancing timers should not change state (no interval running)
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      // No crash, no extra state changes
    })
  })

  describe('visual mode countdown', () => {
    it('decrements seconds after enough ticks accumulate', () => {
      const { result } = renderCountdown({ startSeconds: 5, mode: 'visual' })

      // Each tick is 100ms. After 1000ms (10 ticks), 1 second has elapsed.
      // remaining = max(0, 5 - 1) = 4, ceil(4) = 4
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.seconds).toBe(4)
    })

    it('reaches zero after startSeconds * 1000ms', () => {
      const onEnd = vi.fn()
      const { result } = renderCountdown({ startSeconds: 3, mode: 'visual', onEnd })

      act(() => {
        vi.advanceTimersByTime(3100) // slightly past 3s to ensure the last tick fires
      })

      expect(result.current.seconds).toBe(0)
      expect(result.current.isExpired).toBe(true)
      expect(result.current.progress).toBe(1)
      expect(onEnd).toHaveBeenCalledOnce()
    })

    it('progress increases smoothly with each tick', () => {
      const { result } = renderCountdown({
        startSeconds: 10,
        mode: 'visual',
        progressMode: 'smooth',
      })

      act(() => {
        vi.advanceTimersByTime(100) // 1 tick = 0.1s elapsed
      })

      // progress = min(1, 0.1/10) = 0.01
      expect(result.current.progress).toBeCloseTo(0.01, 2)

      act(() => {
        vi.advanceTimersByTime(4900) // total 5s = halfway
      })

      expect(result.current.progress).toBeCloseTo(0.5, 1)
    })

    it('uses Math.ceil for display seconds (4.1 remaining shows as 5)', () => {
      const { result } = renderCountdown({ startSeconds: 10, mode: 'visual' })

      // After 5.9s: remaining = 4.1, ceil(4.1) = 5
      act(() => {
        vi.advanceTimersByTime(5900)
      })

      expect(result.current.seconds).toBe(5)
    })
  })

  describe('exact mode countdown', () => {
    it('uses Date.now() for elapsed time calculation', () => {
      const _startTime = Date.now()
      const { result } = renderCountdown({ startSeconds: 10, mode: 'exact' })

      // Advance fake timers 2000ms — Date.now() returns startTime + 2000
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // remaining = max(0, 10 - 2) = 8, ceil(8) = 8
      expect(result.current.seconds).toBe(8)
    })

    it('reaches zero using exact timing', () => {
      const onEnd = vi.fn()
      const { result } = renderCountdown({ startSeconds: 2, mode: 'exact', onEnd })

      act(() => {
        vi.advanceTimersByTime(2100)
      })

      expect(result.current.seconds).toBe(0)
      expect(result.current.isExpired).toBe(true)
      expect(onEnd).toHaveBeenCalledOnce()
    })
  })

  describe('phase transitions at threshold boundaries', () => {
    it('transitions from normal to warning at exactly the warning threshold', () => {
      const thresholds = { warning: 10, critical: 5 }
      const { result } = renderCountdown({ startSeconds: 15, thresholds })

      // Advance 5s: remaining = 10, ceil(10) = 10, phase = warning (10 <= 10)
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.seconds).toBe(10)
      expect(result.current.phase).toBe('warning')
    })

    it('transitions from warning to critical at exactly the critical threshold', () => {
      const thresholds = { warning: 10, critical: 5 }
      const { result } = renderCountdown({ startSeconds: 15, thresholds })

      // Advance 10s: remaining = 5, ceil(5) = 5, phase = critical (5 <= 5)
      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(result.current.seconds).toBe(5)
      expect(result.current.phase).toBe('critical')
    })

    it('stays normal when seconds are 1 above warning threshold', () => {
      const thresholds = { warning: 10, critical: 5 }
      const { result } = renderCountdown({ startSeconds: 15, thresholds })

      // Advance 4s: remaining = 11, ceil(11) = 11, phase = normal (11 > 10)
      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(result.current.seconds).toBe(11)
      expect(result.current.phase).toBe('normal')
    })

    it('goes directly to critical phase when warning > critical and timer starts between them', () => {
      // Timer starts at 3s which is <= critical (5), so it starts in critical
      const thresholds = { warning: 10, critical: 5 }
      const { result } = renderCountdown({ startSeconds: 3, thresholds })

      expect(result.current.phase).toBe('critical')
    })

    it('handles equal warning and critical thresholds (no warning phase)', () => {
      const thresholds = { warning: 5, critical: 5 }
      const { result } = renderCountdown({ startSeconds: 10, thresholds })

      // At seconds=5: both conditions met, critical wins (checked first)
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.seconds).toBe(5)
      expect(result.current.phase).toBe('critical')
    })

    it('handles zero thresholds (always normal until expired)', () => {
      const thresholds = { warning: 0, critical: 0 }
      const { result } = renderCountdown({ startSeconds: 5, thresholds })

      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(result.current.seconds).toBe(1)
      // 1 > 0 so still normal; critical check is <= 0 which is false for 1
      expect(result.current.phase).toBe('normal')
    })
  })

  describe('onEnd fire-once semantics', () => {
    it('fires onEnd exactly once when timer expires', () => {
      const onEnd = vi.fn()
      renderCountdown({ startSeconds: 1, onEnd })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(onEnd).toHaveBeenCalledOnce()
    })

    it('does not fire onEnd if timer has not expired', () => {
      const onEnd = vi.fn()
      renderCountdown({ startSeconds: 10, onEnd })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onEnd).not.toHaveBeenCalled()
    })

    it('fires onEnd when no callback is provided without crashing', () => {
      const { result } = renderCountdown({ startSeconds: 1, onEnd: undefined })

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(result.current.isExpired).toBe(true)
    })

    it('uses latest onEnd callback reference via ref (not stale closure)', () => {
      const onEnd1 = vi.fn()
      const onEnd2 = vi.fn()

      const { rerender } = renderHook(
        ({ onEnd }) =>
          useCountdown({
            startSeconds: 2,
            mode: 'visual',
            thresholds: DEFAULT_THRESHOLDS,
            onEnd,
            onEndBehavior: 'stay',
          }),
        { initialProps: { onEnd: onEnd1 } }
      )

      // Change onEnd callback before timer expires
      rerender({ onEnd: onEnd2 })

      act(() => {
        vi.advanceTimersByTime(2500)
      })

      // Should call the LATEST callback (onEnd2), not the original (onEnd1)
      expect(onEnd1).not.toHaveBeenCalled()
      expect(onEnd2).toHaveBeenCalledOnce()
    })
  })

  describe('onEndBehavior: hide', () => {
    it('sets isHidden=true after 600ms delay once expired', () => {
      const { result } = renderCountdown({
        startSeconds: 1,
        onEndBehavior: 'hide',
      })

      // Timer expires
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      expect(result.current.isExpired).toBe(true)
      expect(result.current.isHidden).toBe(false)

      // Wait for hide delay (600ms)
      act(() => {
        vi.advanceTimersByTime(700)
      })
      expect(result.current.isHidden).toBe(true)
    })

    it('does not set isHidden when onEndBehavior is "stay"', () => {
      const { result } = renderCountdown({
        startSeconds: 1,
        onEndBehavior: 'stay',
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.isExpired).toBe(true)
      expect(result.current.isHidden).toBe(false)
    })

    it('isHidden starts false even for already-expired timers with hide behavior', () => {
      const { result } = renderCountdown({
        startSeconds: 0,
        onEndBehavior: 'hide',
      })

      // isExpired is true immediately, but isHidden still starts false
      expect(result.current.isExpired).toBe(true)
      expect(result.current.isHidden).toBe(false)

      // After the hide delay
      act(() => {
        vi.advanceTimersByTime(700)
      })
      expect(result.current.isHidden).toBe(true)
    })
  })

  describe('cleanup on unmount', () => {
    it('clears interval on unmount during active countdown', () => {
      const onEnd = vi.fn()
      const { unmount } = renderCountdown({ startSeconds: 10, onEnd })

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      unmount()

      // Advancing further should not fire onEnd
      act(() => {
        vi.advanceTimersByTime(20000)
      })

      expect(onEnd).not.toHaveBeenCalled()
    })

    it('clears hide delay timeout on unmount', () => {
      const { result, unmount } = renderCountdown({
        startSeconds: 1,
        onEndBehavior: 'hide',
      })

      // Let timer expire
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      expect(result.current.isExpired).toBe(true)

      // Unmount before hide delay fires
      unmount()

      // No errors when advancing past hide delay
      act(() => {
        vi.advanceTimersByTime(1000)
      })
    })
  })

  describe('remount behavior (replay via key toggle)', () => {
    it('resets onEndFired flag on remount so onEnd fires again', () => {
      const onEnd = vi.fn()

      const { unmount } = renderCountdown({ startSeconds: 1, onEnd })

      // First run: timer expires, onEnd fires
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      expect(onEnd).toHaveBeenCalledOnce()

      unmount()

      // Remount (simulates React key toggle for replay)
      const { result: result2 } = renderCountdown({ startSeconds: 1, onEnd })

      // Second run: timer expires again, onEnd fires again
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      expect(onEnd).toHaveBeenCalledTimes(2)
      expect(result2.current.isExpired).toBe(true)
    })
  })

  describe('prop-driven restarts', () => {
    it('resets visible state immediately when startSeconds changes mid-countdown', () => {
      const { result, rerender } = renderHook(
        ({ startSeconds }) =>
          useCountdown({
            startSeconds,
            mode: 'visual',
            thresholds: DEFAULT_THRESHOLDS,
            onEndBehavior: 'stay',
            progressMode: 'smooth',
          }),
        { initialProps: { startSeconds: 10 } }
      )

      act(() => {
        vi.advanceTimersByTime(3500)
      })

      expect(result.current.seconds).toBe(7)
      expect(result.current.progress).toBeCloseTo(0.35, 1)

      rerender({ startSeconds: 20 })

      expect(result.current.seconds).toBe(20)
      expect(result.current.progress).toBe(0)
      expect(result.current.isExpired).toBe(false)
      expect(result.current.isHidden).toBe(false)
    })

    it('resets visible state immediately when mode changes mid-countdown', () => {
      const { result, rerender } = renderHook(
        ({ mode }) =>
          useCountdown({
            startSeconds: 10,
            mode,
            thresholds: DEFAULT_THRESHOLDS,
            onEndBehavior: 'stay',
            progressMode: 'smooth',
          }),
        { initialProps: { mode: 'visual' as const } }
      )

      act(() => {
        vi.advanceTimersByTime(2500)
      })

      expect(result.current.seconds).toBe(8)
      expect(result.current.progress).toBeCloseTo(0.25, 1)

      rerender({ mode: 'exact' as const })

      expect(result.current.seconds).toBe(10)
      expect(result.current.progress).toBe(0)
      expect(result.current.isExpired).toBe(false)
      expect(result.current.isHidden).toBe(false)
    })

    it('reveals a hidden timer immediately when a new countdown starts', () => {
      const { result, rerender } = renderHook(
        ({ startSeconds }) =>
          useCountdown({
            startSeconds,
            mode: 'visual',
            thresholds: DEFAULT_THRESHOLDS,
            onEndBehavior: 'hide',
          }),
        { initialProps: { startSeconds: 1 } }
      )

      act(() => {
        vi.advanceTimersByTime(1800)
      })

      expect(result.current.isExpired).toBe(true)
      expect(result.current.isHidden).toBe(false)

      act(() => {
        vi.advanceTimersByTime(700)
      })

      expect(result.current.isHidden).toBe(true)

      rerender({ startSeconds: 5 })

      expect(result.current.seconds).toBe(5)
      expect(result.current.progress).toBe(0)
      expect(result.current.isExpired).toBe(false)
      expect(result.current.isHidden).toBe(false)
    })
  })

  describe('progress calculation accuracy', () => {
    it('progress reaches exactly 1 when timer expires', () => {
      const { result } = renderCountdown({ startSeconds: 5 })

      act(() => {
        vi.advanceTimersByTime(5500)
      })

      expect(result.current.progress).toBe(1)
    })

    it('progress is clamped to max 1 (never exceeds)', () => {
      const { result } = renderCountdown({ startSeconds: 1 })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.progress).toBeLessThanOrEqual(1)
    })

    it('progress at halfway point is approximately 0.5 in visual mode', () => {
      const { result } = renderCountdown({
        startSeconds: 20,
        mode: 'visual',
        progressMode: 'smooth',
      })

      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(result.current.progress).toBeCloseTo(0.5, 1)
    })
  })

  describe('fractional startSeconds', () => {
    it('handles non-integer startSeconds correctly', () => {
      const { result } = renderCountdown({ startSeconds: 1.5 })

      // ceil(1.5) = 2 for initial display... but useState initializes with startSeconds directly
      // Actually: useState initializes with startSeconds (1.5), and phase is resolved from 1.5
      expect(result.current.seconds).toBe(1.5)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // remaining = max(0, 1.5 - 1) = 0.5, ceil(0.5) = 1
      expect(result.current.seconds).toBe(1)
    })
  })

  describe('very short timer', () => {
    it('1-second timer expires after ~1s of ticks', () => {
      const onEnd = vi.fn()
      const { result } = renderCountdown({ startSeconds: 1, onEnd })

      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(result.current.seconds).toBe(0)
      expect(result.current.isExpired).toBe(true)
      expect(onEnd).toHaveBeenCalledOnce()
    })
  })

  describe('displaySeconds only updates when ceil changes (avoids excessive re-renders)', () => {
    it('does not update seconds state on every tick when ceil is unchanged', () => {
      const { result } = renderCountdown({ startSeconds: 10 })

      // After 100ms: remaining = 9.9, ceil(9.9) = 10 — same as last display (10)
      act(() => {
        vi.advanceTimersByTime(100)
      })

      // seconds should still be 10 (lastDisplay guard prevents update)
      expect(result.current.seconds).toBe(10)

      // After another 900ms (total 1000ms): remaining = 9.0, ceil(9) = 9 — different from 10
      act(() => {
        vi.advanceTimersByTime(900)
      })

      expect(result.current.seconds).toBe(9)
    })
  })
})
