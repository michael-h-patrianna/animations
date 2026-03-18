import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { TimerEffectsPillCountdownGlitch as CssGlitch } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as CssHeartbeat } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownHeartbeat'
import { TimerEffectsPillCountdownMedium as CssMedium } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownMedium'
import { TimerEffectsPillCountdownSoft as CssSoft } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownSoft'
import { TimerEffectsPillCountdownGlitch as FramerGlitch } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as FramerHeartbeat } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownHeartbeat'
import { TimerEffectsPillCountdownMedium as FramerMedium } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownMedium'
import { TimerEffectsPillCountdownSoft as FramerSoft } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownSoft'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('timer-effects pill-countdown remaining variants timer cleanup', () => {
  it('cleans up CSS pill-countdown-soft timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssSoft, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer pill-countdown-soft timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerSoft, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up CSS pill-countdown-medium timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssMedium, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer pill-countdown-medium timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerMedium, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up CSS pill-countdown-heartbeat timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssHeartbeat, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer pill-countdown-heartbeat timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerHeartbeat, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up CSS pill-countdown-glitch timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssGlitch, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer pill-countdown-glitch timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerGlitch, { advanceBeforeUnmountMs: 2000 })
  })
})
