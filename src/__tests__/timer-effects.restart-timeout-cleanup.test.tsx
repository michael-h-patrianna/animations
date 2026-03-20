import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { TimerEffectsTimerFlash as CssTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as CssTimerEffectsTimerFlashSoft } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlashSoft'
import { TimerEffectsTimerFlash as FramerTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlash'
import { TimerEffectsTimerFlashSoft as FramerTimerEffectsTimerFlashSoft } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerFlashSoft'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('timer-effects restart-timeout cleanup', () => {
  it('cleans up CSS timer-flash restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsTimerFlash, { advanceBeforeUnmountMs: 32000 })
  })

  it('cleans up Framer timer-flash restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsTimerFlash, {
      advanceBeforeUnmountMs: 32000,
    })
  })

  it('cleans up CSS timer-flash-soft restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsTimerFlashSoft, {
      advanceBeforeUnmountMs: 32000,
    })
  })

  it('cleans up Framer timer-flash-soft restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsTimerFlashSoft, {
      advanceBeforeUnmountMs: 32000,
    })
  })
})
