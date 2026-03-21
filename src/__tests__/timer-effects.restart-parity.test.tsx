import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerEffectsTimerFlash as CssTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as CssTimerEffectsTimerFlashSoft } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlashSoft'
import { TimerEffectsTimerFlash as FramerTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as FramerTimerEffectsTimerFlashSoft } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlashSoft'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function parseClockValue(container: HTMLElement, selector: string) {
  const raw = container.querySelector(selector)?.textContent ?? '00:00'
  const [minutes, seconds] = raw.split(':').map((part) => Number(part)) as [number, number]
  return minutes * 60 + seconds
}

describe('timer-effects restart parity', () => {
  it('continues timer-flash countdown after first reset in CSS and Framer variants', () => {
    const css = render(<CssTimerEffectsTimerFlash />)
    const framer = render(<FramerTimerEffectsTimerFlash />)

    act(() => {
      vi.advanceTimersByTime(34000)
    })

    expect(parseClockValue(css.container, '.pf-timer-flash__time')).toBe(32)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBe(32)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(parseClockValue(css.container, '.pf-timer-flash__time')).toBeLessThan(32)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBeLessThan(32)
  })

  it('continues timer-flash-soft countdown after first reset in CSS and Framer variants', () => {
    const css = render(<CssTimerEffectsTimerFlashSoft />)
    const framer = render(<FramerTimerEffectsTimerFlashSoft />)

    act(() => {
      vi.advanceTimersByTime(34000)
    })

    expect(parseClockValue(css.container, '.pf-timer-flash-soft__time')).toBe(32)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBe(32)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(parseClockValue(css.container, '.pf-timer-flash-soft__time')).toBeLessThan(32)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBeLessThan(32)
  })
})

describe('timer-effects timer-flash behavioral verification', () => {
  it('CSS timer-flash displays time in MM:SS format', () => {
    const { container } = render(<CssTimerEffectsTimerFlash />)

    const timeText = container.querySelector('.pf-timer-flash__time')?.textContent ?? ''
    // Should match MM:SS format
    expect(timeText).toMatch(/^\d{1,2}:\d{2}$/)
  })

  it('CSS timer-flash counts down from initial value', () => {
    const { container } = render(<CssTimerEffectsTimerFlash />)

    const initialSeconds = parseClockValue(container, '.pf-timer-flash__time')

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const afterSeconds = parseClockValue(container, '.pf-timer-flash__time')
    expect(afterSeconds).toBeLessThan(initialSeconds)
  })

  it('CSS and Framer timer-flash maintain synchronized countdown', () => {
    const css = render(<CssTimerEffectsTimerFlash />)
    const framer = render(<FramerTimerEffectsTimerFlash />)

    // Check at multiple time points
    for (const ms of [0, 5000, 10000, 15000]) {
      if (ms > 0) {
        act(() => {
          vi.advanceTimersByTime(5000)
        })
      }

      const cssVal = parseClockValue(css.container, '.pf-timer-flash__time')
      const framerVal = parseClockValue(framer.container, '.pf-timer-flash__time')
      // Values should be within 1 second of each other (timing imprecision)
      expect(Math.abs(cssVal - framerVal)).toBeLessThanOrEqual(1)
    }
  })
})
