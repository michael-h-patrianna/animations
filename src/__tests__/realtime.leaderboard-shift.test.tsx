import { act, render, screen } from '@testing-library/react'
import { RealtimeDataLeaderboardShift } from '../components/realtime/realtime-data/RealtimeDataLeaderboardShift'

describe('RealtimeDataLeaderboardShift', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('reorders the leaderboard after an animation cycle', async () => {
    render(<RealtimeDataLeaderboardShift />)

    // Initial order
    const initial = screen.getAllByText(/^#\d/).map((el) => el.textContent)
    expect(initial[0]).toBe('#1')
    expect(screen.getByText('Phoenix')).toBeInTheDocument()

    // Advance past the animation and reordering window (1s + small buffer)
    await act(async () => {
      jest.advanceTimersByTime(1100)
    })

    // After the cycle, the list should have been updated (Phoenix moved to rank 4)
    const ranks = screen.getAllByText(/^#\d/).map((el) => el.textContent)
    expect(ranks[0]).toBe('#1')
    // Verify Phoenix is still present but no longer rank 1
    const phoenixRow = screen.getByText('Phoenix').closest('.pf-realtime-data__row')
    expect(phoenixRow?.querySelector('.pf-realtime-data__rank')?.textContent).toBe('#4')
  })
})
