import { buildRegistryFromCategories } from '@/components/animationRegistry'
import { render, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it } from 'vitest'

/**
 * Auto-discovering contract test: every animation registered in the registry
 * must render a root element with `data-animation-id` matching its registry key.
 *
 * Registry components are React.lazy() wrapped, so we render inside Suspense
 * and wait for the lazy component to resolve before asserting.
 */

describe('all registered animations expose data-animation-id', () => {
  const registry = buildRegistryFromCategories()

  for (const [id, Component] of Object.entries(registry)) {
    it(`${id}`, async () => {
      const { container } = render(
        <Suspense fallback={<div>loading</div>}>
          <Component />
        </Suspense>
      )

      await waitFor(
        () => {
          expect(container.querySelector(`[data-animation-id="${id}"]`)).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  }
})
