import { ProgressBarsProgressSpark } from '@/components/progress/progress-bars/ProgressBarsProgressSpark'
import { ProgressBarsProgressStriped } from '@/components/progress/progress-bars/ProgressBarsProgressStriped'
import { withAnimationCard } from '@/test/utils/animationTestUtils'
import { render } from '@testing-library/react'

describe('Progress Bars • Spark & Striped', () => {
  it('renders Spark progress', () => {
    const { container } = render(
      withAnimationCard(<ProgressBarsProgressSpark />, { id: 'progress-bars__progress-spark', title: 'Spark', description: 'd', infinite: true })
    )
    expect(container.querySelector('.pf-progress-spark')).toBeTruthy()
  })

  it('renders Striped progress', () => {
    const { container } = render(
      withAnimationCard(<ProgressBarsProgressStriped />, { id: 'progress-bars__progress-striped', title: 'Striped', description: 'd', infinite: true })
    )
    expect(container.querySelector('.pf-progress-striped')).toBeTruthy()
  })
})
