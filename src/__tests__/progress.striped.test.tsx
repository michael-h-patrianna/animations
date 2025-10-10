import { render } from '@testing-library/react'
import { ProgressBarsProgressStriped } from '../components/progress/progress-bars/framer/ProgressBarsProgressStriped'

describe('ProgressBarsProgressStriped', () => {
  it('renders progress bar with stripes and shimmer using Framer Motion', () => {
    const { container, unmount } = render(<ProgressBarsProgressStriped />)

    // Should render progress bar components
    const progressBar = container.querySelector('.pf-progress-fill')
    expect(progressBar).toBeTruthy()

    // Should have stripes container
    const stripesContainer = container.querySelector('.stripes-container')
    expect(stripesContainer).toBeTruthy()

    // Should have shimmer overlay
    const shimmer = container.querySelector('.shimmer')
    expect(shimmer).toBeTruthy()

    // Should have stripe elements
    const stripes = container.querySelectorAll('.stripe')
    expect(stripes.length).toBeGreaterThan(0)

    unmount()
  })
})
