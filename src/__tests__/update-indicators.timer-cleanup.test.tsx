import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { UpdateIndicatorsBadgePop as CssBadgePop } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse as CssBadgePulse } from '@/components/realtime/update-indicators/css/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsLivePing as CssLivePing } from '@/components/realtime/update-indicators/css/UpdateIndicatorsLivePing'
import { UpdateIndicatorsBadgePop as FramerBadgePop } from '@/components/realtime/update-indicators/framer/UpdateIndicatorsBadgePop'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('update-indicators timer cleanup', () => {
  it('cleans up CSS badge-pop timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssBadgePop, { advanceBeforeUnmountMs: 3000 })
  })

  it('cleans up Framer badge-pop timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerBadgePop, { advanceBeforeUnmountMs: 3000 })
  })

  it('cleans up CSS badge-pulse timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssBadgePulse, { advanceBeforeUnmountMs: 3000 })
  })

  it('cleans up CSS live-ping timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssLivePing, { advanceBeforeUnmountMs: 3000 })
  })
})
