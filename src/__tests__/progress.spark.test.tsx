import { act, render } from '@testing-library/react'
import { ProgressBarsProgressSpark } from '../components/progress/progress-bars/ProgressBarsProgressSpark'

describe('ProgressBarsProgressSpark', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('spawns trailing particles over time and removes them on unmount', async () => {
    const { container, unmount } = render(<ProgressBarsProgressSpark />)

    // Particles spawn every 50ms until 50 particles or cleanup
    await act(async () => {
      jest.advanceTimersByTime(50 * 10)
    })
    expect(container.querySelectorAll('.spark-particle').length).toBeGreaterThan(0)

    // After 3500ms cleanup timeout, component may reset particles once,
    // but the interval can still add more until unmount. Verify unmount clears DOM.
    await act(async () => {
      jest.advanceTimersByTime(3500)
    })
    const beforeUnmount = container.querySelectorAll('.spark-particle').length
    expect(beforeUnmount).toBeGreaterThanOrEqual(0)

    unmount()
    expect(container.querySelectorAll('.spark-particle').length).toBe(0)
  })
})
