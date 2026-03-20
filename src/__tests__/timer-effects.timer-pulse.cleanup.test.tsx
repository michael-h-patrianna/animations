import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { TimerEffectsTimerPulse as CssTimerEffectsTimerPulse } from '@/components/realtime/timer-effects/css/TimerEffectsTimerPulse'
import { TimerEffectsTimerPulse as FramerTimerEffectsTimerPulse } from '@/components/realtime/timer-effects/framer/TimerEffectsTimerPulse'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('timer-effects timer-pulse cleanup', () => {
  it('cleans up CSS timer-pulse restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssTimerEffectsTimerPulse, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer timer-pulse restart timeout on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerTimerEffectsTimerPulse, { advanceBeforeUnmountMs: 2000 })
  })
})
