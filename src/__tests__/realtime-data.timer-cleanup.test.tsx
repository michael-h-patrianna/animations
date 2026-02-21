import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RealtimeDataLeaderboardShift as CssRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/css/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as CssRealtimeDataLiveScoreUpdate } from '@/components/realtime/realtime-data/css/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as CssRealtimeDataStackedRealtime } from '@/components/realtime/realtime-data/css/RealtimeDataStackedRealtime'
import { RealtimeDataLeaderboardShift as FramerRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/framer/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as FramerRealtimeDataLiveScoreUpdate } from '@/components/realtime/realtime-data/framer/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as FramerRealtimeDataStackedRealtime } from '@/components/realtime/realtime-data/framer/RealtimeDataStackedRealtime'

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

describe('realtime-data timer cleanup', () => {
  it('cleans up CSS leaderboard timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(CssRealtimeDataLeaderboardShift, { advanceBeforeUnmountMs: 800 })
  })

  it('cleans up Framer leaderboard timers on unmount', () => {
    assertNoLeakedTimersAfterUnmount(FramerRealtimeDataLeaderboardShift, { advanceBeforeUnmountMs: 800 })
  })

  it('cleans up CSS live-score timers after nested scheduling', () => {
    assertNoLeakedTimersAfterUnmount(CssRealtimeDataLiveScoreUpdate, { advanceBeforeUnmountMs: 2100 })
  })

  it('cleans up Framer live-score timers after nested scheduling', () => {
    assertNoLeakedTimersAfterUnmount(FramerRealtimeDataLiveScoreUpdate, { advanceBeforeUnmountMs: 2300 })
  })

  it('cleans up CSS stacked-realtime timers after nested scheduling', () => {
    assertNoLeakedTimersAfterUnmount(CssRealtimeDataStackedRealtime, { advanceBeforeUnmountMs: 1600 })
  })

  it('cleans up Framer stacked-realtime timers after nested scheduling', () => {
    assertNoLeakedTimersAfterUnmount(FramerRealtimeDataStackedRealtime, { advanceBeforeUnmountMs: 1600 })
  })
})
