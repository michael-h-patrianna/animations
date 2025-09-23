import { act, render } from '@testing-library/react'
import { ProgressBarsZoomedProgress } from '../components/progress/progress-bars/ProgressBarsZoomedProgress'

describe('ProgressBarsZoomedProgress level progression', () => {
  const REAL_RANDOM = Math.random

  beforeEach(() => {
    jest.useFakeTimers()
    ;(Math.random as unknown as jest.Mock) = jest.fn(() => 0.99)
  })
  afterEach(() => {
    jest.useRealTimers()
    ;(Math.random as unknown as jest.Mock) = REAL_RANDOM as unknown as jest.Mock
  })

  it('progresses beyond level 1 and updates mask/track accordingly', async () => {
    const { container, unmount } = render(<ProgressBarsZoomedProgress />)

    // Kick off
    await act(async () => jest.advanceTimersByTime(500))

    // Step through time until mask switches to level 2 or 3 (max ~12 seconds)
    let reached = false
    for (let i = 0; i < 12 && !reached; i++) {
      await act(async () => jest.advanceTimersByTime(1000))
      const mask = container.querySelector('.pf-zoomed-progress__mask') as HTMLElement
      if (/pf-zoomed-progress__mask--level-(2|3)/.test(mask.className)) {
        reached = true
      }
    }
    expect(reached).toBe(true)

    // Track left should be one of the expected positions based on the level
    const track = container.querySelector('.pf-zoomed-progress__track') as HTMLElement
    expect(track.style.left).toMatch(/-55%|-15%|25%/)

    unmount()
  })
})
