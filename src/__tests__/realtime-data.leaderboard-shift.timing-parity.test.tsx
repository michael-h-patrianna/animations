import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RealtimeDataLeaderboardShift as CssRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/css/RealtimeDataLeaderboardShift'
import { RealtimeDataLeaderboardShift as FramerRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/framer/RealtimeDataLeaderboardShift'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function getTopPlayer(container: HTMLElement) {
  return container.querySelector('.pf-realtime-data__row .pf-realtime-data__player')?.textContent
}

describe('realtime-data leaderboard-shift timing parity', () => {
  it('reorders leaderboard by 800ms in CSS and Framer variants', () => {
    const css = render(<CssRealtimeDataLeaderboardShift />)
    const framer = render(<FramerRealtimeDataLeaderboardShift />)

    act(() => {
      vi.advanceTimersByTime(800)
    })

    expect(getTopPlayer(css.container)).toBe('Shadow')
    expect(getTopPlayer(framer.container)).toBe('Shadow')
  })
})
