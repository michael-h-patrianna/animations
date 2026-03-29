import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RealtimeDataLeaderboardShift as CssRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/css/RealtimeDataLeaderboardShift'
import { RealtimeDataLeaderboardShift as FramerRealtimeDataLeaderboardShift } from '@/components/realtime/realtime-data/framer/RealtimeDataLeaderboardShift'
import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

const INITIAL_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 2450 },
  { id: 'shadow', label: 'Shadow', score: 2380 },
  { id: 'nova', label: 'Nova', score: 2320 },
  { id: 'apex', label: 'Apex', score: 2290 },
]

const SHIFTED_ITEMS: RankedEntry[] = [
  { id: 'shadow', label: 'Shadow', score: 2380 },
  { id: 'nova', label: 'Nova', score: 2320 },
  { id: 'apex', label: 'Apex', score: 2290 },
  { id: 'phoenix', label: 'Phoenix', score: 2400 },
]

function getTopPlayerCss(container: HTMLElement) {
  return container.querySelector('.pf-realtime-data__row .pf-realtime-data__player')?.textContent
}

function getTopPlayerFramer(container: HTMLElement) {
  return container.querySelector('.pf-realtime-data-fm__row .pf-realtime-data-fm__player')
    ?.textContent
}

function getPlayerNamesCss(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('.pf-realtime-data__player')).map(
    (el) => el.textContent ?? ''
  )
}

function getPlayerNamesFramer(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('.pf-realtime-data-fm__player')).map(
    (el) => el.textContent ?? ''
  )
}

describe('realtime-data leaderboard-shift reactive behavior', () => {
  it('CSS variant renders initial items and updates when items prop changes', () => {
    const { container, rerender } = render(
      <CssRealtimeDataLeaderboardShift items={INITIAL_ITEMS} />
    )

    expect(getTopPlayerCss(container)).toBe('Phoenix')
    expect(getPlayerNamesCss(container)).toEqual(['Phoenix', 'Shadow', 'Nova', 'Apex'])

    // Rerender with shifted items — CSS variant defers removal via setTimeout
    rerender(<CssRealtimeDataLeaderboardShift items={SHIFTED_ITEMS} />)

    // After the exit timeout fires, renderList updates to match new items
    act(() => {
      vi.advanceTimersByTime(800)
    })

    expect(getTopPlayerCss(container)).toBe('Shadow')
  })

  it('Framer variant renders initial items and updates when items prop changes', () => {
    const { container, rerender } = render(
      <FramerRealtimeDataLeaderboardShift items={INITIAL_ITEMS} />
    )

    expect(getTopPlayerFramer(container)).toBe('Phoenix')

    rerender(<FramerRealtimeDataLeaderboardShift items={SHIFTED_ITEMS} />)
    expect(getTopPlayerFramer(container)).toBe('Shadow')
  })

  it('CSS and Framer variants start with identical player data', () => {
    const css = render(<CssRealtimeDataLeaderboardShift />)
    const framer = render(<FramerRealtimeDataLeaderboardShift />)

    const cssPlayers = getPlayerNamesCss(css.container)
    const framerPlayers = getPlayerNamesFramer(framer.container)

    expect(cssPlayers).toEqual(framerPlayers)
  })
})
