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

describe('timer-effects timer-pulse countdown behavior', () => {
  it('CSS and Framer variants start at 10 by default', () => {
    const css = render(<CssTimerEffectsTimerPulse />)
    const framer = render(<FramerTimerEffectsTimerPulse />)

    expect(getCssValue(css.container)).toBe(10)
    expect(getFramerValue(framer.container)).toBe(10)
  })

  it('CSS variant counts down over time', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    expect(getCssValue(container)).toBe(10)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    const midValue = getCssValue(container)
    // After 3s of a 10s countdown, value should be ~7
    expect(midValue).toBeLessThanOrEqual(8)
    expect(midValue).toBeGreaterThanOrEqual(6)
  })

  it('CSS variant reaches zero', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    act(() => {
      vi.advanceTimersByTime(11000)
    })

    expect(getCssValue(container)).toBe(0)
  })

  it('accepts custom startSeconds', () => {
    const { container } = render(<CssTimerEffectsTimerPulse startSeconds={5} />)

    expect(getCssValue(container)).toBe(5)

    act(() => {
      vi.advanceTimersByTime(5100)
    })

    expect(getCssValue(container)).toBe(0)
  })
})

describe('timer-effects timer-pulse behavioral correctness', () => {
  it('CSS variant displays progress CSS custom property', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    const underline = container.querySelector('.pf-timer-pulse__underline')
    expect(underline).toBeInTheDocument()

    // Initially progress is 0
    expect(underline).toHaveStyle({ '--progress': '0' })

    // After full countdown, progress should be 1
    act(() => {
      vi.advanceTimersByTime(11000)
    })
    expect(underline).toHaveStyle({ '--progress': '1' })
  })

  it('countdown values are monotonically decreasing', () => {
    const { container } = render(<CssTimerEffectsTimerPulse />)

    const values: number[] = [getCssValue(container)]
    for (let i = 0; i < 100; i++) {
      act(() => {
        vi.advanceTimersByTime(100)
      })
      values.push(getCssValue(container))
    }

    // Verify monotonic decrease
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThanOrEqual(values[i - 1]!)
    }
    // First value should be 10, last should be 0
    expect(values[0]).toBe(10)
    expect(values[values.length - 1]).toBe(0)
  })

  it('onEnd callback fires when timer reaches zero', () => {
    const onEnd = vi.fn()
    render(<CssTimerEffectsTimerPulse startSeconds={3} onEnd={onEnd} />)

    act(() => {
      vi.advanceTimersByTime(3100)
    })

    expect(onEnd).toHaveBeenCalledOnce()
  })
})
