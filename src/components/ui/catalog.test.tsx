import { render } from '@testing-library/react'
import { AnimationCard, CategorySection, GroupSection } from './catalog'

// Minimal render checks to cover re-export barrel file
describe('ui • catalog re-exports', () => {
  it('exports AnimationCard component', () => {
    const { container } = render(
      <AnimationCard title="t" description="d" animationId="x">
        <div>c</div>
      </AnimationCard>
    )
    expect(container.querySelector('[data-animation-id="x"]')).toBeInTheDocument()
  })

  it('exports CategorySection and GroupSection types', () => {
    // We do not fully render these without data, but calling them ensures coverage of export bindings
    expect(CategorySection).toBeDefined()
    expect(GroupSection).toBeDefined()
  })
})
