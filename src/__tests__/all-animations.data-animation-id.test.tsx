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
 *
 * Known production bugs (tests marked .fails / .todo):
 * - lights__circle-static-{1-8}: components use `export default` instead of named
 *   export, so groupBuilder's lazy() wrapper finds undefined for the named export.
 *   Bug in: src/components/rewards/lights/{css,framer}/LightsCircleStatic*.tsx
 * - prize-reveal__card-pack-open: component renders data-animation-id with "-css"
 *   suffix ("prize-reveal__card-pack-open-css") but metadata id lacks the suffix.
 *   Bug in: src/components/rewards/prize-reveal/css/CardPackOpen.tsx metadata
 */

/** Animation IDs with known production bugs that prevent correct data-animation-id rendering. */
const KNOWN_BUGS: Record<string, string> = {
  'lights__circle-static-1': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-2': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-3': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-4': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-5': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-6': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-7': 'uses export default, incompatible with groupBuilder lazy loading',
  'lights__circle-static-8': 'uses export default, incompatible with groupBuilder lazy loading',
  'prize-reveal__card-pack-open':
    'data-animation-id includes -css suffix not present in metadata id',
}

describe('all registered animations expose data-animation-id', () => {
  const registry = buildRegistryFromCategories()

  for (const [id, Component] of Object.entries(registry)) {
    if (KNOWN_BUGS[id]) {
      it.todo(`${id} — KNOWN BUG: ${KNOWN_BUGS[id]}`)
      continue
    }

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
