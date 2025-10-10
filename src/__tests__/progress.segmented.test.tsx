import { act, render } from '@testing-library/react'
import { ProgressBarsProgressSegmented } from '../components/progress/progress-bars/framer/ProgressBarsProgressSegmented'

describe('ProgressBarsProgressSegmented', () => {
  it('renders segmented progress bar with Framer Motion', async () => {
    jest.useFakeTimers()
    const { container, unmount } = render(<ProgressBarsProgressSegmented />)

    // Should render progress bar
    const progressBar = container.querySelector('.pf-progress-fill')
    expect(progressBar).toBeTruthy()

    const trackContainer = container.querySelector('.track-container') as HTMLElement
    expect(trackContainer).toBeTruthy()

    // Should have gap overlays (3 gaps for 4 segments)
    const gapOverlays = container.querySelectorAll('[style*="position: absolute"][style*="background: rgb(42, 16, 64)"]')
    expect(gapOverlays.length).toBe(3)

    // Should have segment overlays (4 segments)
    const segmentOverlays = container.querySelectorAll('[style*="flex: 1"]')
    expect(segmentOverlays.length).toBe(4)

    // Advance to duration (3000ms) so animations complete
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })

    // Should still have progress bar after animation
    expect(container.querySelector('.pf-progress-fill')).toBeTruthy()

    unmount()
  })
})
