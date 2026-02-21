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

function assertNoLeakedTimersAfterUnmount(
  Component: () => JSX.Element,
  options?: { advanceBeforeUnmountMs?: number }
) {
  const { unmount } = render(<Component />)

  if (options?.advanceBeforeUnmountMs) {
    act(() => {
      vi.advanceTimersByTime(options.advanceBeforeUnmountMs as number)
    })
  }

  unmount()
  const pendingTimersAfterUnmount = vi.getTimerCount()

  expect(pendingTimersAfterUnmount).toBe(0)

  act(() => {
    vi.runOnlyPendingTimers()
  })

  expect(vi.getTimerCount()).toBe(0)
}

describe('timer-effects timer-pulse cleanup', () => {
  it('cleans up CSS timer-pulse restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsTimerPulse, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer timer-pulse restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsTimerPulse, { advanceBeforeUnmountMs: 2000 })
  })
})
