import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RealtimeDataLiveScoreUpdate as CssLiveScore } from '@/components/realtime/realtime-data/css/RealtimeDataLiveScoreUpdate'
import { RealtimeDataLiveScoreUpdate as FramerLiveScore } from '@/components/realtime/realtime-data/framer/RealtimeDataLiveScoreUpdate'
import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

const INITIAL_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 1450 },
  { id: 'shadow', label: 'Shadow', score: 1320 },
]

const UPDATED_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 1570 },
  { id: 'shadow', label: 'Shadow', score: 1440 },
]

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

  it('CSS variant counts up when items prop changes to higher scores', () => {
    const { container, rerender } = render(<CssLiveScore items={INITIAL_ITEMS} />)
    const initialScores = getDisplayedScores(container)

    rerender(<CssLiveScore items={UPDATED_ITEMS} />)

    // Advance through the count-up interval (20 steps × 40ms = 800ms)
    act(() => {
      vi.advanceTimersByTime(900)
    })

    const updatedScores = getDisplayedScores(container)
    for (let i = 0; i < initialScores.length; i++) {
      expect(updatedScores[i]).toBeGreaterThan(initialScores[i]!)
    }
  })

  it('Framer variant counts up when items prop changes to higher scores', () => {
    const { container, rerender } = render(<FramerLiveScore items={INITIAL_ITEMS} />)
    const initialScores = getDisplayedScores(container)

    rerender(<FramerLiveScore items={UPDATED_ITEMS} />)

    act(() => {
      vi.advanceTimersByTime(900)
    })

    const updatedScores = getDisplayedScores(container)
    for (let i = 0; i < initialScores.length; i++) {
      expect(updatedScores[i]).toBeGreaterThan(initialScores[i]!)
    }
  })

  it('no animation fires without items change (no internal cycling)', () => {
    const { container } = render(<CssLiveScore items={INITIAL_ITEMS} />)
    const initialScores = getDisplayedScores(container)

    // Advance time significantly — no cycling should occur
    act(() => {
      vi.advanceTimersByTime(10000)
    })

    const scoresAfterWait = getDisplayedScores(container)
    expect(scoresAfterWait).toEqual(initialScores)
  })
})
