import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProgressBarsProgressMilestones as CssProgressBarsProgressMilestones } from '@/components/progress/progress-bars/css/ProgressBarsProgressMilestones'
import { ProgressBarsXpAccumulation as CssProgressBarsXpAccumulation } from '@/components/progress/progress-bars/css/ProgressBarsXpAccumulation'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function assertNoPendingAnimationFrameTimersAfterUnmount(
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

  expect(vi.getTimerCount()).toBe(0)

  act(() => {
    vi.runOnlyPendingTimers()
  })

  expect(vi.getTimerCount()).toBe(0)
}

describe('progress-bars RAF cleanup', () => {
  it('cleans up CSS progress-milestones RAF loop on unmount', () => {
    assertNoPendingAnimationFrameTimersAfterUnmount(CssProgressBarsProgressMilestones)
  })

  it('cleans up CSS xp-accumulation RAF loop on unmount', () => {
    assertNoPendingAnimationFrameTimersAfterUnmount(CssProgressBarsXpAccumulation, {
      advanceBeforeUnmountMs: 1000,
    })
  })
})
