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

describe('timer-effects restart-timeout cleanup', () => {
  it('cleans up CSS timer-flash restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsTimerFlash, { advanceBeforeUnmountMs: 32000 })
  })

  it('cleans up Framer timer-flash restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsTimerFlash, { advanceBeforeUnmountMs: 32000 })
  })

  it('cleans up CSS timer-flash-soft restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsTimerFlashSoft, { advanceBeforeUnmountMs: 32000 })
  })

  it('cleans up Framer timer-flash-soft restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsTimerFlashSoft, { advanceBeforeUnmountMs: 32000 })
  })
})
