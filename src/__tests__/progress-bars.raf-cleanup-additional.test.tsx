import { afterEach, beforeEach, describe, it, vi } from 'vitest'

import { ProgressBarsCelebrationBurst as CssCelebrationBurst } from '@/components/progress/progress-bars/css/ProgressBarsCelebrationBurst'
import { ProgressBarsQuestlineRoyal as CssQuestlineRoyal } from '@/components/progress/progress-bars/css/ProgressBarsQuestlineRoyal'
import { ProgressBarsQuestlineRoyal as FramerQuestlineRoyal } from '@/components/progress/progress-bars/framer/ProgressBarsQuestlineRoyal'
import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('progress-bars additional RAF cleanup', () => {
  it('cleans up CSS questline-royal RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssQuestlineRoyal, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up Framer questline-royal RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerQuestlineRoyal, { advanceBeforeUnmountMs: 2000 })
  })

  it('cleans up CSS celebration-burst RAF loop on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssCelebrationBurst, { advanceBeforeUnmountMs: 2000 })
  })
})
