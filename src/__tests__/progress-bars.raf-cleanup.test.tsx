import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { ProgressBarsProgressMilestones as CssProgressBarsProgressMilestones } from '@/components/progress/progress-bars/css/ProgressBarsProgressMilestones'
import { ProgressBarsXpAccumulation as CssProgressBarsXpAccumulation } from '@/components/progress/progress-bars/css/ProgressBarsXpAccumulation'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('progress-bars RAF cleanup', () => {
  it('cleans up CSS progress-milestones RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssProgressBarsProgressMilestones)
  })

  it('cleans up CSS xp-accumulation RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssProgressBarsXpAccumulation, {
      advanceBeforeUnmountMs: 1000,
    })
  })
})
