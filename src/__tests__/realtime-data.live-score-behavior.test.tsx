import { act, render } from '@testing-library/react'
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

/** Extracts displayed scores from .pf-realtime-data__score elements */
function getDisplayedScores(container: HTMLElement): number[] {
  return Array.from(container.querySelectorAll('.pf-realtime-data__score')).map((el) =>
    parseInt(el.textContent?.replace(/,/g, '') ?? '0', 10)
  )
}

describe('realtime-data live-score-update behavior', () => {
  it('CSS and Framer variants start with identical initial scores', () => {
    const { container: cssContainer, unmount } = render(<CssLiveScore />)
    const cssScores = getDisplayedScores(cssContainer)
    unmount()

    const { container: framerContainer } = render(<FramerLiveScore />)
    const framerScores = getDisplayedScores(framerContainer)

    expect(cssScores).toEqual(framerScores)
  })

  it('scores display with locale formatting (commas) and correct class', () => {
    const { container } = render(<CssLiveScore />)
    const scoreElements = container.querySelectorAll('.pf-realtime-data__score')
    const scoreTexts = Array.from(scoreElements).map((el) => el.textContent)

    expect(scoreTexts).toContain('1,450')
    expect(scoreTexts).toContain('1,320')
  })

  it('scores increase over time (not decrease)', () => {
    const { container } = render(<CssLiveScore />)
    const initialScores = getDisplayedScores(container)

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    const updatedScores = getDisplayedScores(container)
    // Scores should increase or stay the same (never decrease)
    for (let i = 0; i < initialScores.length; i++) {
      expect(updatedScores[i]).toBeGreaterThanOrEqual(initialScores[i]!)
    }
  })
})
