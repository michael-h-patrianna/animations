import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RealtimeDataLiveScoreUpdate as CssLiveScore } from '@/components/realtime/realtime-data/css/RealtimeDataLiveScoreUpdate'
import { RealtimeDataLiveScoreUpdate as FramerLiveScore } from '@/components/realtime/realtime-data/framer/RealtimeDataLiveScoreUpdate'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

/** Extracts displayed scores by matching locale-formatted numbers (e.g. "1,450") */
function getDisplayedScores(): number[] {
  return screen
    .getAllByText(/^\d{1,3}(,\d{3})*$/)
    .map((el) => parseInt(el.textContent?.replace(/,/g, '') ?? '0', 10))
}

describe('realtime-data live-score-update behavior', () => {
  it('CSS and Framer variants start with identical initial scores', () => {
    const { unmount } = render(<CssLiveScore />)
    const cssScores = getDisplayedScores()
    unmount()

    render(<FramerLiveScore />)
    const framerScores = getDisplayedScores()

    expect(cssScores).toEqual(framerScores)
  })

  it('scores display with locale formatting (commas)', () => {
    render(<CssLiveScore />)
    expect(screen.getByText('1,450')).toHaveClass('pf-realtime-data__score')
    expect(screen.getByText('1,320')).toHaveClass('pf-realtime-data__score')
  })

  it('scores increase over time (not decrease)', () => {
    render(<CssLiveScore />)
    const initialScores = getDisplayedScores()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    const updatedScores = getDisplayedScores()
    // Scores should increase or stay the same (never decrease)
    for (let i = 0; i < initialScores.length; i++) {
      expect(updatedScores[i]).toBeGreaterThanOrEqual(initialScores[i]!)
    }
  })
})
