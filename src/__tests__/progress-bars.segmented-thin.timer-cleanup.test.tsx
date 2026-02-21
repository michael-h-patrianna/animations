import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProgressBarsProgressSegmented as CssProgressBarsProgressSegmented } from '@/components/progress/progress-bars/css/ProgressBarsProgressSegmented'
import { ProgressBarsProgressThin as CssProgressBarsProgressThin } from '@/components/progress/progress-bars/css/ProgressBarsProgressThin'
import { ProgressBarsProgressSegmented as FramerProgressBarsProgressSegmented } from '@/components/progress/progress-bars/framer/ProgressBarsProgressSegmented'
import { ProgressBarsProgressThin as FramerProgressBarsProgressThin } from '@/components/progress/progress-bars/framer/ProgressBarsProgressThin'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function assertNoLeakedTimersAfterUnmount(Component: () => JSX.Element) {
  const { unmount } = render(<Component />)

  unmount()
  const pendingTimersAfterUnmount = vi.getTimerCount()

  expect(pendingTimersAfterUnmount).toBe(0)

  act(() => {
    vi.runOnlyPendingTimers()
  })

  expect(vi.getTimerCount()).toBe(0)
}

describe('progress-bars segmented/thin timer cleanup', () => {
  it('cleans up CSS progress-segmented timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssProgressBarsProgressSegmented)
  })

  it('cleans up CSS progress-thin timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssProgressBarsProgressThin)
  })

  it('cleans up Framer progress-segmented timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerProgressBarsProgressSegmented)
  })

  it('cleans up Framer progress-thin timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerProgressBarsProgressThin)
  })
})
