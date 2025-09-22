import { render } from '@testing-library/react'
import { AnimationCard } from './animation-card'

describe('ui • animation-card re-export', () => {
  it('re-exports AnimationCard component', () => {
    const { container } = render(
      <AnimationCard title="ReExport" description="d" animationId="re">
        <div>child</div>
      </AnimationCard>
    )
    expect(container.querySelector('[data-animation-id="re"]')).toBeInTheDocument()
  })
})
