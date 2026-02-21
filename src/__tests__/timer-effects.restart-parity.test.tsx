import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerEffectsTimerFlash as CssTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as CssTimerEffectsTimerFlashSoft } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlashSoft'
import { TimerEffectsTimerFlash as FramerTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as FramerTimerEffectsTimerFlashSoft } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlashSoft'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function parseClockValue(container: HTMLElement, selector: string) {
  const raw = container.querySelector(selector)?.textContent ?? '00:00'
  const [minutes, seconds] = raw.split(':').map((part) => Number(part))
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
