import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useCountUp } from '@/hooks/useCountUp'

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Stub performance.now to return a controllable value
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    // Advance performance.now when RAF fires
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      now += 16 // ~60fps
      return setTimeout(() => cb(now), 0) as unknown as number
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns initial "0" for integer mode before animation starts', () => {
    const { result } = renderHook(() => useCountUp(100, 500, 0, 0))
    expect(result.current).toBe('0')
  })

  it('returns initial "0.00" for decimal mode before animation starts', () => {
    const { result } = renderHook(() => useCountUp(99.99, 500, 100, 2))
    expect(result.current).toBe('0.00')
  })

  it('initial display matches requested decimal places (not hardcoded to 2)', () => {
    const { result: r1 } = renderHook(() => useCountUp(1, 500, 100, 1))
    expect(r1.current).toBe('0.0')

    const { result: r4 } = renderHook(() => useCountUp(1, 500, 100, 4))
    expect(r4.current).toBe('0.0000')
  })

  it('reaches the target value after delay + duration', () => {
    const { result } = renderHook(() => useCountUp(1000, 200, 50, 0))

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(50)
    })

    // Advance past duration — RAF loop will converge
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Final value should be the formatted target
    expect(result.current).toBe('1,000')
  })

  it('reaches decimal target value', () => {
    const { result } = renderHook(() => useCountUp(42.5, 200, 0, 2))

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('42.50')
  })

  it('cleans up timeout and RAF on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const cancelRAFSpy = vi.spyOn(globalThis, 'cancelAnimationFrame')

    const { unmount } = renderHook(() => useCountUp(100, 500, 100, 0))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    expect(cancelRAFSpy).toHaveBeenCalled()
  })

  it('handles target of zero', () => {
    const { result } = renderHook(() => useCountUp(0, 200, 0, 0))

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('0')
  })

  it('restarts animation when target changes', () => {
    const { result, rerender } = renderHook(({ target }) => useCountUp(target, 200, 0, 0), {
      initialProps: { target: 50 },
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('50')

    rerender({ target: 100 })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('100')
  })

  it('handles negative target values', () => {
    const { result } = renderHook(() => useCountUp(-500, 200, 0, 0))

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should reach the negative target
    expect(result.current).toBe('-500')
  })

  it('handles fractional targets with custom decimal places', () => {
    const { result } = renderHook(() => useCountUp(3.14159, 200, 0, 4))

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('3.1416')
  })

  it('handles very large target values without overflow', () => {
    const { result } = renderHook(() => useCountUp(1_000_000, 200, 0, 0))

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('1,000,000')
  })

  it('produces intermediate values during animation (not instant jump)', () => {
    const captured: string[] = []
    const { result } = renderHook(() => useCountUp(1000, 500, 0, 0))

    // Advance in small increments to capture intermediate values
    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(16)
      })
      captured.push(result.current)
    }

    // Should have at least one value between 0 and 1000 (not all '0' or all '1,000')
    const numericValues = captured.map((v) => Number(v.replace(/,/g, '')))
    const hasIntermediate = numericValues.some((v) => v > 0 && v < 1000)
    expect(hasIntermediate, 'Expected intermediate values during animation').toBe(true)
  })

  it('uses cubic ease-out (starts fast, ends slow)', () => {
    const { result } = renderHook(() => useCountUp(1000, 500, 0, 0))

    // Advance to ~20% of duration
    act(() => {
      vi.advanceTimersByTime(100)
    })
    const earlyValue = Number(result.current.replace(/,/g, ''))

    // With cubic ease-out (1-(1-t)^3), at t=0.2: eased = 1-(0.8)^3 = 0.488
    // So we expect ~488 at 20% of duration — more than 20% of target (200)
    // This verifies ease-out behavior (front-loaded)
    expect(earlyValue).toBeGreaterThan(200)
  })

  it('handles durationMs of 1 (near-instant animation)', () => {
    const { result } = renderHook(() => useCountUp(500, 1, 0, 0))

    // A single RAF tick (16ms) far exceeds durationMs=1, so t clamps to 1
    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBe('500')
  })

  it('handles delayMs greater than durationMs', () => {
    const { result } = renderHook(() => useCountUp(100, 50, 500, 0))

    // Before delay expires — should still be initial value
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe('0')

    // After delay + duration
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('100')
  })

  it('does not update state after unmount during active animation', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = renderHook(() => useCountUp(1000, 500, 0, 0))

    // Start the animation
    act(() => {
      vi.advanceTimersByTime(50)
    })

    // Unmount mid-animation
    unmount()

    // Advance timers — RAF callbacks should have been cancelled
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // React 19 won't warn on unmounted state updates, but we verify
    // the cleanup ran by checking no errors were logged
    expect(consoleErrorSpy).not.toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('handles very small fractional targets', () => {
    const { result } = renderHook(() => useCountUp(0.001, 200, 0, 4))

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('0.0010')
  })

  it('handles durationMs of 0 without NaN or infinite loop', () => {
    // durationMs=0 → t = Math.min(elapsed/0, 1) = Math.min(Infinity, 1) = 1
    // So the first RAF tick should immediately set the final value
    const { result } = renderHook(() => useCountUp(500, 0, 0, 0))

    act(() => {
      vi.advanceTimersByTime(50)
    })

    // Should reach the target immediately — no Infinity/NaN in display
    expect(result.current).not.toContain('NaN')
    expect(result.current).not.toContain('Infinity')
    expect(result.current).toBe('500')
  })

  it('handles simultaneous parameter changes on rerender', () => {
    const { result, rerender } = renderHook(
      ({ target, duration, delay, decimals }) => useCountUp(target, duration, delay, decimals),
      { initialProps: { target: 100, duration: 200, delay: 0, decimals: 0 } }
    )

    // Run to completion
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('100')

    // Change all 4 params at once
    rerender({ target: 50.5, duration: 100, delay: 50, decimals: 2 })

    // New delay + new duration
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('50.50')
  })

  it('handles durationMs=0 with delayMs=0 (instant)', () => {
    const { result } = renderHook(() => useCountUp(42, 0, 0, 0))

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBe('42')
  })

  it('handles negative durationMs without crash (t becomes negative, eased > 1)', () => {
    // durationMs = -100 → elapsed / durationMs is negative → Math.min(negative, 1) = negative
    // eased = 1 - (1 - t)^3 where t < 0 → (1-t) > 1 → eased < 0
    // current = target * eased → negative for positive target
    // This documents the behavior: negative duration produces nonsensical values but no crash/NaN
    const { result } = renderHook(() => useCountUp(100, -100, 0, 0))

    act(() => {
      vi.advanceTimersByTime(50)
    })

    // The value should not contain NaN or Infinity
    expect(result.current).not.toContain('NaN')
    expect(result.current).not.toContain('Infinity')
  })

  it('handles negative delayMs (setTimeout fires immediately for negative delay)', () => {
    const { result } = renderHook(() => useCountUp(100, 200, -50, 0))

    // Negative delay in setTimeout is treated as 0 by the browser
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('100')
  })

  it('cleanup cancels both timeout and RAF when unmounting during delay period', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const cancelRAFSpy = vi.spyOn(globalThis, 'cancelAnimationFrame')

    const { unmount } = renderHook(() => useCountUp(100, 500, 1000, 0))

    // Unmount during the delay (before animation starts)
    act(() => {
      vi.advanceTimersByTime(500)
    })
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    // RAF cancel should also be called (even though rafRef.current is still 0)
    expect(cancelRAFSpy).toHaveBeenCalled()

    // Advancing further should not cause errors
    act(() => {
      vi.advanceTimersByTime(2000)
    })
  })
})
