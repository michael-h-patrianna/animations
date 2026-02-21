import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerEffectsTimerPulse as CssTimerEffectsTimerPulse } from '@/components/realtime/timer-effects/css/TimerEffectsTimerPulse'
import { TimerEffectsTimerPulse as FramerTimerEffectsTimerPulse } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerPulse'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
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
