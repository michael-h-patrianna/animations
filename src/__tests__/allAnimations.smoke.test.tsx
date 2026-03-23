import { render } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import { buildRegistryFromCategories } from '../components/animationRegistry'

type AnimationComponent = React.ComponentType<Record<string, unknown>>

/**
 * Lightweight smoke test for the animation registry.
 *
 * These components are React.lazy() wrappers rendered WITHOUT a Suspense boundary.
 * In happy-dom, this doesn't throw — it renders the lazy wrapper's pending state
 * (effectively nothing). This test verifies that:
 *   1. buildRegistryFromCategories() produces a valid map
 *   2. The React.lazy() wrappers don't crash during creation or mounting
 *   3. Mount/unmount cycle completes without errors
 *
 * For actual component rendering verification (with Suspense + waitFor),
 * see `all-animations.data-animation-id.test.tsx`.
 */
describe('animationRegistry smoke', () => {
  it('mounts and unmounts all registered lazy wrappers without throwing', () => {
    const animationRegistry = buildRegistryFromCategories()
    const entries = Object.entries(animationRegistry) as [string, AnimationComponent][]

    expect(entries.length).toBeGreaterThanOrEqual(100)

    const failures: string[] = []
    for (const [key, Component] of entries) {
      try {
        const { unmount } = render(<Component />)
        unmount()
      } catch (e) {
        failures.push(`${key}: ${(e as Error).message}`)
      }
    }

    expect(failures, `Components that failed to mount:\n${failures.join('\n')}`).toEqual([])
  })

  it('registry keys follow group__variant naming convention with no duplicates', () => {
    const registry = buildRegistryFromCategories()
    const keys = Object.keys(registry)

    expect(new Set(keys).size).toBe(keys.length)

    for (const key of keys) {
      expect(key, `"${key}" does not match group__variant pattern`).toMatch(
        /^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/
      )
    }
  })
})
