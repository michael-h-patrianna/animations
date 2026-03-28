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

describe('useCountdown progressMode', () => {
  it('discrete mode: progress only updates when seconds changes', () => {
    const { result } = renderCountdown({ startSeconds: 10, progressMode: 'discrete' })

    // After 100ms: progress should still be 0 (seconds hasn't changed)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.progress).toBe(0)

    // After 1000ms total: seconds changes 10→9, progress updates
    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(result.current.seconds).toBe(9)
    expect(result.current.progress).toBeCloseTo(0.1, 1)
  })

  it('smooth mode: progress updates every tick', () => {
    const { result } = renderCountdown({ startSeconds: 10, progressMode: 'smooth' })

    // After 100ms: progress should be ~0.01
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.progress).toBeCloseTo(0.01, 2)
  })

  it('defaults to discrete mode', () => {
    const { result } = renderCountdown({ startSeconds: 10 })

    // After 100ms: progress should still be 0 (discrete default, seconds unchanged)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.progress).toBe(0)
  })

  it('discrete mode still sets progress to 1 on expiry', () => {
    const { result } = renderCountdown({ startSeconds: 1, progressMode: 'discrete' })

    act(() => {
      vi.advanceTimersByTime(1100)
    })

    expect(result.current.progress).toBe(1)
    expect(result.current.isExpired).toBe(true)
  })
})
