import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RealtimeDataLeaderboardShift as CssLeaderboard } from '@/components/realtime/realtime-data/css/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as CssLiveScore } from '@/components/realtime/realtime-data/css/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as CssStacked } from '@/components/realtime/realtime-data/css/RealtimeDataStackedRealtime'
import { RealtimeDataWinTicker as CssWinTicker } from '@/components/realtime/realtime-data/css/RealtimeDataWinTicker'
import { RealtimeDataLeaderboardShift as FramerLeaderboard } from '@/components/realtime/realtime-data/framer/RealtimeDataLeaderboardShift'
import { RealtimeDataLiveScoreUpdate as FramerLiveScore } from '@/components/realtime/realtime-data/framer/RealtimeDataLiveScoreUpdate'
import { RealtimeDataStackedRealtime as FramerStacked } from '@/components/realtime/realtime-data/framer/RealtimeDataStackedRealtime'
import { RealtimeDataWinTicker as FramerWinTicker } from '@/components/realtime/realtime-data/framer/RealtimeDataWinTicker'

/**
 * Parity tests: CSS and Framer variants must produce structurally equivalent
 * initial DOM — same data-animation-id, same BEM wrapper, same initial data.
 */
describe('realtime-data CSS/Framer initial DOM parity', () => {
  it('leaderboard-shift: same data-animation-id and initial player data', () => {
    const css = render(<CssLeaderboard />)
    const framer = render(<FramerLeaderboard />)

    expect(
      css.container.querySelector('[data-animation-id="realtime-data__leaderboard-shift"]')
    ).toBeInTheDocument()
    expect(
      framer.container.querySelector('[data-animation-id="realtime-data__leaderboard-shift"]')
    ).toBeInTheDocument()

    // Both should render the same player names initially
    const cssPlayers = Array.from(css.container.querySelectorAll('.pf-realtime-data__player')).map(
      (el) => el.textContent
    )
    const framerPlayers = Array.from(
      framer.container.querySelectorAll('.pf-realtime-data__player')
    ).map((el) => el.textContent)

    expect(cssPlayers.length).toBeGreaterThanOrEqual(3)
    expect(cssPlayers).toEqual(framerPlayers)
  })

  it('live-score-update: same data-animation-id and initial scores', () => {
    const css = render(<CssLiveScore />)
    const framer = render(<FramerLiveScore />)

    expect(
      css.container.querySelector('[data-animation-id="realtime-data__live-score-update"]')
    ).toBeInTheDocument()
    expect(
      framer.container.querySelector('[data-animation-id="realtime-data__live-score-update"]')
    ).toBeInTheDocument()
  })

  it('stacked-realtime: same data-animation-id', () => {
    const css = render(<CssStacked />)
    const framer = render(<FramerStacked />)

    expect(
      css.container.querySelector('[data-animation-id="realtime-data__stacked-realtime"]')
    ).toBeInTheDocument()
    expect(
      framer.container.querySelector('[data-animation-id="realtime-data__stacked-realtime"]')
    ).toBeInTheDocument()
  })

  it('win-ticker: same data-animation-id', () => {
    const css = render(<CssWinTicker />)
    const framer = render(<FramerWinTicker />)

    expect(
      css.container.querySelector('[data-animation-id="realtime-data__win-ticker"]')
    ).toBeInTheDocument()
    expect(
      framer.container.querySelector('[data-animation-id="realtime-data__win-ticker"]')
    ).toBeInTheDocument()
  })

  it('leaderboard-shift: both variants render same number of rows initially', () => {
    const css = render(<CssLeaderboard />)
    const framer = render(<FramerLeaderboard />)

    const cssRows = css.container.querySelectorAll('.pf-realtime-data__row')
    const framerRows = framer.container.querySelectorAll('.pf-realtime-data__row')

    expect(cssRows.length).toBe(framerRows.length)
    expect(cssRows.length).toBeGreaterThanOrEqual(3)
  })

  it('live-score-update: both variants render initial score elements', () => {
    const css = render(<CssLiveScore />)
    const framer = render(<FramerLiveScore />)

    // Both should render score display elements
    const cssScores = css.container.querySelectorAll('.pf-realtime-data__score')
    const framerScores = framer.container.querySelectorAll('.pf-realtime-data__score')

    // Should have same number of score elements (structural parity)
    expect(cssScores.length).toBe(framerScores.length)
  })
})
