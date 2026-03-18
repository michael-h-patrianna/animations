import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { TimerEffectsPillCountdownExtreme as CssTimerEffectsPillCountdownExtreme } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownExtreme'
import { TimerEffectsPillCountdownStrong as CssTimerEffectsPillCountdownStrong } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownStrong'
import { TimerEffectsPillCountdownExtreme as FramerTimerEffectsPillCountdownExtreme } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownExtreme'
import { TimerEffectsPillCountdownStrong as FramerTimerEffectsPillCountdownStrong } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownStrong'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('timer-effects pill-countdown timeout cleanup', () => {
  it('cleans up CSS pill-countdown-strong nested timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsPillCountdownStrong, {
      advanceBeforeUnmountMs: 51100,
    })
  })

  it('cleans up Framer pill-countdown-strong nested timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsPillCountdownStrong, {
      advanceBeforeUnmountMs: 51100,
    })
  })

  it('cleans up CSS pill-countdown-extreme zero-flash timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsPillCountdownExtreme, {
      advanceBeforeUnmountMs: 60100,
    })
  })

  it('cleans up Framer pill-countdown-extreme zero-flash timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsPillCountdownExtreme, {
      advanceBeforeUnmountMs: 60100,
    })
  })
})
