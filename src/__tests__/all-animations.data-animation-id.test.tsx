import { buildRegistryFromCategories } from '@/components/animationRegistry'
import { cleanup, render, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

/**
 * Auto-discovering contract test: every animation registered in the registry
 * must render a root element with `data-animation-id` matching its registry key.
 *
 * Registry components are React.lazy() wrapped, so we render inside Suspense
 * and wait for the lazy component to resolve before asserting.
 *
 * Each test explicitly unmounts after assertion to prevent memory accumulation
 * across 170+ component renders within a single worker.
 */

describe('all registered animations expose data-animation-id', () => {
  const registry = buildRegistryFromCategories()

  afterEach(() => {
    cleanup()
  })

  for (const [id, Component] of Object.entries(registry)) {
    it(`${id}`, async () => {
      const { container, unmount } = render(
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

      unmount()
    })
  }
})
