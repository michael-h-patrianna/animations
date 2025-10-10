import { render } from '@testing-library/react'
import { buildRegistryFromCategories } from '../components/animationRegistry'
import type React from 'react'

type AnimationComponent = React.ComponentType<Record<string, unknown>>

describe('animationRegistry smoke', () => {
  it('renders all registered animation components without throwing', () => {
    const animationRegistry = buildRegistryFromCategories()
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
