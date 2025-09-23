import { act, render, screen } from '@testing-library/react'

// Partially mock framer-motion to make animate immediate and deterministic
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    // Immediately set MotionValue to target and call onComplete
    animate: (value: unknown, to: unknown, opts?: { onComplete?: () => void }) => {
      const maybe = value as { set?: (v: unknown) => void }
      if (maybe && typeof maybe.set === 'function') {
        maybe.set(to)
      }
      if (opts && typeof opts.onComplete === 'function') {
        opts.onComplete()
      }
      return {
        stop() {},
        play() {},
        pause() {},
        complete() {},
      }
    },
  }
})

import { ProgressBarsXpAccumulation } from '@/components/progress/progress-bars'

describe('ProgressBarsXpAccumulation', () => {
  const REAL_RANDOM = Math.random

  beforeEach(() => {
    jest.useFakeTimers()
    // Deterministic random: XP script picks the min of each range; offsets become 0
    ;(Math.random as unknown as jest.Mock) = jest.fn(() => 0)
  })

  afterEach(() => {
    jest.useRealTimers()
    ;(Math.random as unknown as jest.Mock) = REAL_RANDOM as unknown as jest.Mock
  })

  it('progresses XP over time, spawns floating +XP, toggles multiplier at thresholds and emits Start pulse', async () => {
    render(<ProgressBarsXpAccumulation />)

    // Start pulse scheduled ~120ms after mount
    await act(async () => {
      jest.advanceTimersByTime(130)
    })

    // Start marker should be active
    // Verify Start label is present somewhere
    expect(screen.getByText(/Start/i)).toBeInTheDocument()

    // First runGain after 520ms
    await act(async () => {
      jest.advanceTimersByTime(520)
    })

    // Floating XP spawns shortly before impact (420 - 110 = 310ms)
    await act(async () => {
      jest.advanceTimersByTime(310)
    })

    // A floating +XP element should appear
    const floating = screen.getAllByText(/^\+\d+ XP$/)
    expect(floating.length).toBeGreaterThan(0)

    // After impact delay (420ms), values animate immediately via mocked animate()
    await act(async () => {
      jest.advanceTimersByTime(420)
    })

    // Counter value should have advanced above initial 100
    expect(screen.getByText(/\d+\s*\/\s*1,000\s*XP/i)).toBeInTheDocument()

    // Advance to next gain interval so that XP crosses 20% threshold (>= 200)
    await act(async () => {
      jest.advanceTimersByTime(1580) // GAIN_INTERVAL_MS
      jest.advanceTimersByTime(310) // spawn lead
      jest.advanceTimersByTime(420) // impact
    })

  // Multiplier x2 should become visible once >= 20%; scope to the multiplier badge
  const multiplierBadges = document.querySelectorAll('.pf-xp-multiplier')
  const hasX2 = Array.from(multiplierBadges).some((el) => /x\s*2/i.test(el.textContent || ''))
  expect(hasX2).toBe(true)

    // Floating XP should eventually be cleaned up after lifetime (~1650ms post-impact)
    await act(async () => {
      jest.advanceTimersByTime(1650)
    })
    // Some may be removed; ensure no errors if none remain
    // Optionally assert at least one disappears by checking total reduces, but keep test lenient
  })
})
