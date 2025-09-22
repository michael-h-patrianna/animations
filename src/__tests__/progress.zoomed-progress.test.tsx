import { ProgressBarsZoomedProgress } from '@/components/progress/progress-bars/ProgressBarsZoomedProgress'
import { act, render, screen } from '@testing-library/react'

describe('ProgressBarsZoomedProgress', () => {
  const REAL_RANDOM = Math.random

  beforeEach(() => {
    jest.useFakeTimers()
    // Make rndPoints deterministic: Math.random() -> 0.99 so it adds max each tick
    ;(Math.random as unknown as jest.Mock) = jest.fn(() => 0.99)
  })

  afterEach(() => {
    jest.useRealTimers()
    ;(Math.random as unknown as jest.Mock) = REAL_RANDOM as unknown as jest.Mock
  })

  it('advances levels and updates bar widths and mask class', async () => {
    render(<ProgressBarsZoomedProgress />)

    // initial timer to start update: 500ms
    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    // Now it schedules every 1000ms; with random=0.99 and level 1, points increase by 1 per tick up to 3
    await act(async () => {
      jest.advanceTimersByTime(1000 * 3)
    })

    // Level 1 should be completed; levelReached[0] true => marker 1 has 'reached'
    const level1 = screen.getByText('1').parentElement as HTMLElement
    expect(level1.className).toMatch(/reached/)

    // The first bar should be full width (100%)
    const bar1Fill = document.querySelector('.pf-zoomed-progress__bar--1 .pf-zoomed-progress__fill') as HTMLElement
    expect(bar1Fill.style.width).toBe('100%')

    // After level up, mask should reflect level 2
    const mask = document.querySelector('.pf-zoomed-progress__mask') as HTMLElement
    expect(mask.className).toMatch(/pf-zoomed-progress__mask--level-2/)

    // Advance a few more ticks to accumulate level 2 points (cap 6)
    await act(async () => {
      jest.advanceTimersByTime(1000 * 6)
    })

    const bar2Fill = document.querySelector('.pf-zoomed-progress__bar--2 .pf-zoomed-progress__fill') as HTMLElement
    expect(parseFloat(bar2Fill.style.width)).toBeGreaterThan(0)

    // Track left CSS should reflect the new level (25 - 40*(level-1))
    const track = document.querySelector('.pf-zoomed-progress__track') as HTMLElement
    expect(track.style.left).toMatch(/-15%|25%/)
  })
})
