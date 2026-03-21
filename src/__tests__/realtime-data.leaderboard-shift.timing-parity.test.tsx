import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RealtimeDataLeaderboardShift as CssRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/css/RealtimeDataLeaderboardShift'
import { RealtimeDataLeaderboardShift as FramerRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/framer/RealtimeDataLeaderboardShift'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
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

describe('realtime-data leaderboard-shift behavioral verification', () => {
  it('CSS variant renders initial player list before any timer fires', () => {
    const { container } = render(<CssRealtimeDataLeaderboardShift />)

    const players = Array.from(container.querySelectorAll('.pf-realtime-data__player')).map(
      (el) => el.textContent
    )
    // Should have at least 3 players in the initial state
    expect(players.length).toBeGreaterThanOrEqual(3)
    // All player names should be non-empty strings
    for (const name of players) {
      expect(name).toMatch(/\w+/)
    }
  })

  it('CSS and Framer variants start with identical player data', () => {
    const css = render(<CssRealtimeDataLeaderboardShift />)
    const framer = render(<FramerRealtimeDataLeaderboardShift />)

    const cssPlayers = Array.from(css.container.querySelectorAll('.pf-realtime-data__player')).map(
      (el) => el.textContent
    )
    const framerPlayers = Array.from(
      framer.container.querySelectorAll('.pf-realtime-data__player')
    ).map((el) => el.textContent)

    expect(cssPlayers).toEqual(framerPlayers)
  })

  it('leaderboard order changes after the reorder timer fires', () => {
    const { container } = render(<CssRealtimeDataLeaderboardShift />)

    const playersBefore = Array.from(
      container.querySelectorAll('.pf-realtime-data__player')
    ).map((el) => el.textContent)

    act(() => {
      vi.advanceTimersByTime(800)
    })

    const playersAfter = Array.from(
      container.querySelectorAll('.pf-realtime-data__player')
    ).map((el) => el.textContent)

    // The order should have changed (same players, different positions)
    expect(playersAfter).not.toEqual(playersBefore)
    // Same set of players (sorted should match)
    expect([...playersAfter].sort()).toEqual([...playersBefore].sort())
  })
})
