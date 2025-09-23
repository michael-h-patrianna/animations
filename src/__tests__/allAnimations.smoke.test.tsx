import { render } from '@testing-library/react'
import { animationRegistry } from '../components/animationRegistry'
import type { AnimationComponent } from '../types/animation'

describe('animationRegistry smoke', () => {
  it('renders all registered animation components without throwing', () => {
    // Render each component once to exercise mount effects
    const entries = Object.entries(animationRegistry) as [string, AnimationComponent][]
    for (const [key, Component] of entries) {
      try {
        const C = Component as AnimationComponent
        const { unmount } = render(<C />)
        // unmount to trigger cleanup effects
        unmount()
      } catch (e) {
        // Surface which component failed for easier debugging
        throw new Error(`Component for key "${key}" failed to render: ${(e as Error).message}`)
      }
    }
  })
})
