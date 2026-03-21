import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerEffectsTimerPulse as CssTimerEffectsTimerPulse } from '@/components/realtime/timer-effects/css/TimerEffectsTimerPulse'
import { TimerEffectsTimerPulse as FramerTimerEffectsTimerPulse } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerPulse'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function getCssValue(container: HTMLElement) {
  return Number(container.querySelector('.pf-timer-pulse__value')?.textContent ?? '')
}

function getFramerValue(container: HTMLElement) {
  return Number(container.querySelector('.pf-timer__value')?.textContent ?? '')
}

describe('timer-effects timer-pulse restart parity', () => {
  it('continues countdown after first reset in both CSS and Framer variants', () => {
    const css = render(<CssTimerEffectsTimerPulse />)
    const framer = render(<FramerTimerEffectsTimerPulse />)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(getCssValue(css.container)).toBe(10)
    expect(getFramerValue(framer.container)).toBe(10)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(getCssValue(css.container)).toBeLessThan(10)
    expect(getFramerValue(framer.container)).toBeLessThan(10)
  })
})

describe('timer-effects timer-pulse behavioral correctness', () => {
  it('CSS variant starts at 10 and counts down to 0 over 2 seconds', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    // Initial value should be 10
    expect(getCssValue(container)).toBe(10)

    // At 1 second (50% progress), value should be ~5
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    const midValue = getCssValue(container)
    expect(midValue).toBeLessThanOrEqual(6)
    expect(midValue).toBeGreaterThanOrEqual(4)

    // At 2 seconds (100% progress), value should be 0
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(getCssValue(container)).toBe(0)
  })

  it('CSS variant resets to 10 after countdown completes and 1s pause', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    // Complete the countdown (2s) + restart pause (1s)
    act(() => {
      vi.advanceTimersByTime(3100)
    })

    // Should have restarted back to 10
    expect(getCssValue(container)).toBe(10)
  })

  it('CSS variant displays progress CSS custom property', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    const underline = container.querySelector('.pf-timer-pulse__underline')
    expect(underline).toBeInTheDocument()

    // Initially progress is 0 (value=10, progress = (10-10)/10 = 0)
    expect(underline).toHaveStyle({ '--progress': '0' })

    // After full countdown, progress should be 1
    act(() => {
      vi.advanceTimersByTime(2100)
    })
    expect(underline).toHaveStyle({ '--progress': '1' })
  })

  it('countdown values are monotonically decreasing', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    const values: number[] = [getCssValue(container)]
    for (let i = 0; i < 20; i++) {
      act(() => {
        vi.advanceTimersByTime(100)
      })
      values.push(getCssValue(container))
    }

    // Verify monotonic decrease (each value <= previous)
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThanOrEqual(values[i - 1]!)
    }
    // First value should be 10, last should be 0
    expect(values[0]).toBe(10)
    expect(values[values.length - 1]).toBe(0)
  })
})
