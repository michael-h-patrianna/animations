import { assertNoLeakedTimersAfterUnmount } from '@/test/utils/timerTestUtils'
import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('assertNoLeakedTimersAfterUnmount', () => {
  it('passes for a component with no timers', () => {
    function NoTimers() {
      return <div>Static</div>
    }

    expect(() => assertNoLeakedTimersAfterUnmount(NoTimers)).not.toThrow()
  })

  it('passes for a component that properly cleans up its timer', () => {
    function CleanComponent() {
      useEffect(() => {
        const id = setInterval(() => {}, 1000)
        return () => clearInterval(id)
      }, [])
      return <div>Clean</div>
    }

    expect(() => assertNoLeakedTimersAfterUnmount(CleanComponent)).not.toThrow()
  })

  it('fails for a component with a leaked setInterval', () => {
    function LeakyInterval() {
      useEffect(() => {
        const _leaked = setInterval(() => {}, 1000) // Intentionally leaked for testing
        void _leaked
      }, [])
      return <div>Leaky</div>
    }

    expect(() => assertNoLeakedTimersAfterUnmount(LeakyInterval)).toThrow(
      /Expected 0 pending timers after unmount/
    )
  })

  it('fails for a component with a leaked setTimeout', () => {
    function LeakyTimeout() {
      useEffect(() => {
        const _leaked = setTimeout(() => {}, 5000) // Intentionally leaked for testing
        void _leaked
      }, [])
      return <div>Leaky</div>
    }

    expect(() => assertNoLeakedTimersAfterUnmount(LeakyTimeout)).toThrow(
      /Expected 0 pending timers after unmount/
    )
  })

  it('exercises timers before unmount when advanceBeforeUnmountMs is set', () => {
    let timerFired = false

    function DelayedTimer() {
      useEffect(() => {
        const id = setTimeout(() => {
          timerFired = true
          // Schedule another timer that should be cleaned up
          const _zombie = setTimeout(() => {}, 1000)
          void _zombie
        }, 500)
        return () => clearTimeout(id)
      }, [])
      return <div>Delayed</div>
    }

    // With advanceBeforeUnmountMs: 600, the 500ms timer fires and schedules a new one
    // The zombie timer (scheduled after cleanup can't catch it) will be detected
    expect(() =>
      assertNoLeakedTimersAfterUnmount(DelayedTimer, { advanceBeforeUnmountMs: 600 })
    ).toThrow(/Expected 0 pending timers/)
    expect(timerFired).toBe(true)
  })

  it('passes for component with timer that fires and cleans up during advance', () => {
    function SelfCleaningTimer() {
      useEffect(() => {
        let id: ReturnType<typeof setTimeout> | undefined
        id = setTimeout(() => {
          id = undefined // Timer has fired, cleanup no longer needed
        }, 500)
        return () => {
          if (id !== undefined) clearTimeout(id)
        }
      }, [])
      return <div>Self-cleaning</div>
    }

    expect(() =>
      assertNoLeakedTimersAfterUnmount(SelfCleaningTimer, { advanceBeforeUnmountMs: 600 })
    ).not.toThrow()
  })
})
