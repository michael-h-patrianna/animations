import { render } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import { buildRegistryFromCategories } from '../components/animationRegistry'

type AnimationComponent = React.ComponentType<Record<string, unknown>>

describe('animationRegistry smoke', () => {
  it('renders and unmounts all registered animation components without throwing', () => {
    const animationRegistry = buildRegistryFromCategories()
    const entries = Object.entries(animationRegistry) as [string, AnimationComponent][]

    // Sanity: we expect 100+ components
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

    // Report all failures at once for debugging
    expect(failures, `Components that failed to render:\n${failures.join('\n')}`).toEqual([])
  })

  it('registry keys are unique and non-overlapping between direct render', async () => {
    const registry = buildRegistryFromCategories()
    const keys = Object.keys(registry)

    // Every key should appear exactly once
    const uniqueKeys = new Set(keys)
    expect(uniqueKeys.size).toBe(keys.length)

    // Verify key format consistency
    for (const key of keys) {
      const parts = key.split('__')
      expect(parts, `Key "${key}" should have exactly one "__" separator`).toHaveLength(2)
      expect(parts[0], `Key "${key}" has empty group prefix`).toMatch(/^[a-z][a-z0-9-]+$/)
      expect(parts[1], `Key "${key}" has empty variant suffix`).toMatch(/^[a-z][a-z0-9-]+$/)
    }
  })
})
