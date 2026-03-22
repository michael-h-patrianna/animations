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

describe('timer-effects timer-flash countdown behavior', () => {
  it('CSS and Framer timer-flash start at 32 seconds by default', () => {
    const css = render(<CssTimerEffectsTimerFlash />)
    const framer = render(<FramerTimerEffectsTimerFlash />)

    expect(parseClockValue(css.container, '.pf-timer-flash__time')).toBe(32)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBe(32)
  })

  it('CSS and Framer timer-flash count down over time', () => {
    const css = render(<CssTimerEffectsTimerFlash />)
    const framer = render(<FramerTimerEffectsTimerFlash />)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(parseClockValue(css.container, '.pf-timer-flash__time')).toBeLessThan(32)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBeLessThan(32)
  })

  it('CSS and Framer timer-flash reach zero', () => {
    const css = render(<CssTimerEffectsTimerFlash />)
    const framer = render(<FramerTimerEffectsTimerFlash />)

    act(() => {
      vi.advanceTimersByTime(33000)
    })

    expect(parseClockValue(css.container, '.pf-timer-flash__time')).toBe(0)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBe(0)
  })

  it('timer-flash accepts custom startSeconds', () => {
    const css = render(<CssTimerEffectsTimerFlash startSeconds={15} />)
    const framer = render(<FramerTimerEffectsTimerFlash startSeconds={15} />)

    expect(parseClockValue(css.container, '.pf-timer-flash__time')).toBe(15)
    expect(parseClockValue(framer.container, '.pf-timer-flash__time')).toBe(15)
  })

  it('timer-flash-soft CSS and Framer count down in sync', () => {
    const css = render(<CssTimerEffectsTimerFlashSoft />)
    const framer = render(<FramerTimerEffectsTimerFlashSoft />)

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    const cssVal = parseClockValue(css.container, '.pf-timer-flash-soft__time')
    const framerVal = parseClockValue(framer.container, '.pf-timer-flash__time')
    expect(Math.abs(cssVal - framerVal)).toBeLessThanOrEqual(1)
  })
})

describe('timer-effects timer-flash behavioral verification', () => {
  it('CSS timer-flash displays time in MM:SS format', () => {
    const { container } = render(<CssTimerEffectsTimerFlash />)

    const timeText = container.querySelector('.pf-timer-flash__time')?.textContent ?? ''
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

    for (const ms of [0, 5000, 10000, 15000]) {
      if (ms > 0) {
        act(() => {
          vi.advanceTimersByTime(5000)
        })
      }

      const cssVal = parseClockValue(css.container, '.pf-timer-flash__time')
      const framerVal = parseClockValue(framer.container, '.pf-timer-flash__time')
      expect(Math.abs(cssVal - framerVal)).toBeLessThanOrEqual(1)
    }
  })

  it('onEnd callback fires when timer reaches zero', () => {
    const onEnd = vi.fn()
    render(<CssTimerEffectsTimerFlash startSeconds={5} onEnd={onEnd} />)

    act(() => {
      vi.advanceTimersByTime(5100)
    })

    expect(onEnd).toHaveBeenCalledOnce()
  })
})
