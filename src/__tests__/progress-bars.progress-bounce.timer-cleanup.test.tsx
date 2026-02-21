import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProgressBarsProgressBounce as CssProgressBarsProgressBounce } from '@/components/progress/progress-bars/css/ProgressBarsProgressBounce'
import { ProgressBarsProgressBounce as FramerProgressBarsProgressBounce } from '@/components/progress/progress-bars/framer/ProgressBarsProgressBounce'

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

describe('progress-bars progress-bounce timer cleanup', () => {
  it('cleans up CSS progress-bounce timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssProgressBarsProgressBounce)
  })

  it('cleans up Framer progress-bounce timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerProgressBarsProgressBounce)
  })
})
