import { render } from '@testing-library/react'
import { ProgressBarsProgressStriped } from '../components/progress/progress-bars/ProgressBarsProgressStriped'

describe('ProgressBarsProgressStriped', () => {
  it('creates stripes and shimmer overlays on mount', () => {
    const { container, unmount } = render(<ProgressBarsProgressStriped />)
    const overlays = container.querySelectorAll('.animation-element')
    expect(overlays.length).toBeGreaterThanOrEqual(2)
    unmount()
  })
})
