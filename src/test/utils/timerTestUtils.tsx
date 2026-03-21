import { act, render } from '@testing-library/react'
import type React from 'react'
import { vi } from 'vitest'

/**
 * Renders a component, optionally advances timers, unmounts, then asserts
 * no timers remain pending. Catches leaked setInterval/setTimeout/rAF handles
 * that would accumulate across tests or cause memory leaks in production.
 *
 * Requires `vi.useFakeTimers()` in the test's `beforeEach`.
 *
 * @param Component - The React component to render (must accept no required props)
 * @param options.advanceBeforeUnmountMs - If set, advances fake timers by this many ms
 *   before unmounting, to exercise timer-scheduling code paths that only fire after a delay.
 */
export function assertNoLeakedTimersAfterUnmount(
  Component: React.ComponentType,
  options?: { advanceBeforeUnmountMs?: number }
) {
  const { unmount } = render(<Component />)

  if (options?.advanceBeforeUnmountMs) {
    act(() => {
      vi.advanceTimersByTime(options.advanceBeforeUnmountMs as number)
    })
  }

  unmount()

  // No timers should remain after cleanup runs
  const pendingAfterUnmount = vi.getTimerCount()
  if (pendingAfterUnmount !== 0) {
    throw new Error(
      `Expected 0 pending timers after unmount, found ${pendingAfterUnmount}. ` +
        `The component's cleanup effect is not clearing all timers.`
    )
  }

  // Flush any that might have snuck through — should still be zero
  act(() => {
    vi.runOnlyPendingTimers()
  })

  if (vi.getTimerCount() !== 0) {
    throw new Error(
      `Expected 0 pending timers after flushing, found ${vi.getTimerCount()}. ` +
        `A timer callback is scheduling new timers after unmount.`
    )
  }
}
