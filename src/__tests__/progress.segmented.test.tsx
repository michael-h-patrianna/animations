import { act, render } from '@testing-library/react'
import { ProgressBarsProgressSegmented } from '../components/progress/progress-bars/ProgressBarsProgressSegmented'

describe('ProgressBarsProgressSegmented', () => {
  it('creates gap overlays and triggers segment pulses at thresholds', async () => {
    jest.useFakeTimers()
    const { container, unmount } = render(<ProgressBarsProgressSegmented />)

    const gapOverlays = container.querySelectorAll('.animation-element')
    expect(gapOverlays.length).toBeGreaterThan(0)

    const trackContainer = container.querySelector('.track-container') as HTMLElement
    expect(trackContainer).toBeTruthy()

    // Should have gap bars appended to gap overlay (segmentCount - 1 = 3)
    const gapOverlay = trackContainer.querySelector('.animation-element') as HTMLElement
    expect(gapOverlay).toBeTruthy()
    expect(gapOverlay.children.length).toBeGreaterThan(0)

    // Advance to duration (3000ms) so threshold setTimeouts fire
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })

    // Each segment should have a glow child appended at some point
    const segments = (trackContainer.querySelector('.animation-element')?.nextSibling as HTMLElement)
      ?.children
    if (segments && segments.length > 0) {
      // Check at least one segment contains a child (glow) after time advance
      const hasGlow = Array.from(segments).some((seg) => (seg as HTMLElement).children.length > 0)
      expect(hasGlow).toBe(true)
    }

    unmount()
  })
})
