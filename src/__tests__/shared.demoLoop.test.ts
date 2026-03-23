import {
  useDemoPingPong,
  useDemoProgress,
} from '@/components/progress/progress-bars/SharedDemoLoop'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let rafCallbacks: Array<(time: number) => void> = []
let rafIdCounter = 1
let currentTime = 0

beforeEach(() => {
  rafCallbacks = []
  rafIdCounter = 1
  currentTime = 0

  vi.spyOn(performance, 'now').mockImplementation(() => currentTime)
  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
    const id = rafIdCounter++
    rafCallbacks.push(cb)
    return id
  })
  vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {
    rafCallbacks = []
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

/** Flush one RAF frame at the given time. */
function flushFrame(time: number) {
  currentTime = time
  const cbs = [...rafCallbacks]
  rafCallbacks = []
  for (const cb of cbs) {
    cb(time)
  }
}

describe('useDemoProgress', () => {
  it('returns external progress unchanged when provided', () => {
    const { result } = renderHook(() => useDemoProgress(0.75))

    expect(result.current).toBe(0.75)
  })

  it('returns 0 for external progress of 0', () => {
    const { result } = renderHook(() => useDemoProgress(0))

    expect(result.current).toBe(0)
  })

  it('returns 1 for external progress of 1', () => {
    const { result } = renderHook(() => useDemoProgress(1))

    expect(result.current).toBe(1)
  })

  it('does not create a RAF loop when external progress is provided', () => {
    renderHook(() => useDemoProgress(0.5))

    expect(rafCallbacks).toHaveLength(0)
  })

  it('starts internal progress at 0 when no external progress', () => {
    const { result } = renderHook(() => useDemoProgress(undefined))

    expect(result.current).toBe(0)
  })

  it('creates a RAF loop when external progress is undefined', () => {
    renderHook(() => useDemoProgress(undefined))

    expect(rafCallbacks.length).toBeGreaterThanOrEqual(1)
  })

  it('sweeps from 0 to 1 over the default duration (4000ms)', () => {
    const { result } = renderHook(() => useDemoProgress(undefined))

    // At halfway (2000ms)
    act(() => flushFrame(2000))
    expect(result.current).toBeCloseTo(0.5, 1)

    // At full duration (4000ms)
    act(() => flushFrame(4000))
    expect(result.current).toBe(1)
  })

  it('clamps progress to 1 at the duration boundary', () => {
    const { result } = renderHook(() => useDemoProgress(undefined, { duration: 1000 }))

    act(() => flushFrame(1500))
    expect(result.current).toBe(1)
  })

  it('resets to 0 after pause period', () => {
    const { result } = renderHook(() => useDemoProgress(undefined, { duration: 1000, pause: 500 }))

    // Complete the sweep
    act(() => flushFrame(1000))
    expect(result.current).toBe(1)

    // During pause — still 1
    act(() => flushFrame(1200))
    expect(result.current).toBe(1)

    // After pause ends — resets to 0
    act(() => flushFrame(1600))
    expect(result.current).toBe(0)
  })

  it('cancels RAF on unmount', () => {
    const cancelSpy = vi.mocked(cancelAnimationFrame)
    const { unmount } = renderHook(() => useDemoProgress(undefined))

    unmount()

    expect(cancelSpy).toHaveBeenCalled()
  })

  it('switches from internal to external mode on rerender', () => {
    const { result, rerender } = renderHook(({ ext }) => useDemoProgress(ext), {
      initialProps: { ext: undefined as number | undefined },
    })

    // Internal mode — at t=2000 with default duration 4000ms, progress ≈ 0.5
    act(() => flushFrame(2000))
    expect(result.current).toBeCloseTo(0.5, 1)

    // Switch to external
    rerender({ ext: 0.42 })
    expect(result.current).toBe(0.42)
  })
})

describe('useDemoPingPong', () => {
  it('returns external progress and direction "up" when provided', () => {
    const { result } = renderHook(() => useDemoPingPong(0.6))

    expect(result.current.value).toBe(0.6)
    expect(result.current.direction).toBe('up')
  })

  it('starts at value=0, direction="up" when no external progress', () => {
    const { result } = renderHook(() => useDemoPingPong(undefined))

    expect(result.current.value).toBe(0)
    expect(result.current.direction).toBe('up')
  })

  it('sweeps up from 0 to 1 during the first cycle', () => {
    const { result } = renderHook(() => useDemoPingPong(undefined, { duration: 1000, pause: 200 }))

    act(() => flushFrame(500))
    expect(result.current.value).toBeCloseTo(0.5, 1)
    expect(result.current.direction).toBe('up')

    act(() => flushFrame(1000))
    expect(result.current.value).toBe(1)
  })

  it('changes direction to "down" after first cycle pause', () => {
    const { result } = renderHook(() => useDemoPingPong(undefined, { duration: 1000, pause: 200 }))

    // Complete up sweep
    act(() => flushFrame(1000))
    expect(result.current.direction).toBe('up')

    // Pause ends → direction flips
    act(() => flushFrame(1300))
    expect(result.current.direction).toBe('down')
  })

  it('sweeps down from 1 to 0 during the second cycle', () => {
    const { result } = renderHook(() => useDemoPingPong(undefined, { duration: 1000, pause: 200 }))

    // Complete up + pause
    act(() => flushFrame(1000))
    act(() => flushFrame(1300)) // direction flips to down, startTime resets

    // Halfway through down sweep
    act(() => flushFrame(1800))
    expect(result.current.direction).toBe('down')
    // raw = 0.5, p = 1 - 0.5 = 0.5
    expect(result.current.value).toBeCloseTo(0.5, 1)
  })

  it('cancels RAF on unmount', () => {
    const cancelSpy = vi.mocked(cancelAnimationFrame)
    const { unmount } = renderHook(() => useDemoPingPong(undefined))

    unmount()

    expect(cancelSpy).toHaveBeenCalled()
  })
})
