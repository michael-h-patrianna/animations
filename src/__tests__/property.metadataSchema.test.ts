/**
 * Property-based tests for animation metadata validation.
 * Verifies the schema accepts all valid metadata shapes and rejects invalid ones.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validateAnimationMetadata } from '@/lib/metadataSchema'

/** Arbitrary for a valid animation ID (group__variant format). */
const animationId = fc
  .tuple(fc.stringMatching(/^[a-z][a-z0-9-]{1,19}$/), fc.stringMatching(/^[a-z][a-z0-9-]{1,19}$/))
  .map(([group, variant]) => `${group}__${variant}`)

/** Arbitrary for a non-empty human-readable string. */
const humanString = fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,59}$/)

/** Arbitrary for valid tier values. */
const tier = fc.constantFrom(1, 2, 3, 4) as fc.Arbitrary<1 | 2 | 3 | 4>

/** Arbitrary for valid demoMode values. */
const demoMode = fc.constantFrom('burst', 'magnet', 'trail', 'fountain', 'icon-dot', 'status-row')

/** Arbitrary for valid previewPosition values. */
const previewPosition = fc.constantFrom(
  'center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'top-center',
  'bottom-center'
)

/** Arbitrary for minimal valid metadata. */
const validMetadata = fc.record({
  id: animationId,
  title: humanString,
  description: humanString,
})

/** Arbitrary for fully-populated valid metadata. */
const fullMetadata = fc.record({
  id: animationId,
  title: humanString,
  description: humanString,
  disableReplay: fc.boolean(),
  infinite: fc.boolean(),
  tier,
  demoMode,
  previewPosition,
  order: fc.integer({ min: 0, max: 100 }),
  previewMaxWidth: fc.integer({ min: 100, max: 2000 }),
})

describe('validateAnimationMetadata — property-based', () => {
  it('accepts all minimal valid metadata', () => {
    fc.assert(
      fc.property(validMetadata, (meta) => {
        const errors = validateAnimationMetadata(meta, 'test.meta.ts')
        expect(errors).toEqual([])
      })
    )
  })

  it('accepts all fully-populated valid metadata', () => {
    fc.assert(
      fc.property(fullMetadata, (meta) => {
        const errors = validateAnimationMetadata(meta, 'test.meta.ts')
        expect(errors).toEqual([])
      })
    )
  })

  it('rejects metadata with empty id', () => {
    fc.assert(
      fc.property(humanString, humanString, (title, description) => {
        const meta = { id: '', title, description }
        const errors = validateAnimationMetadata(meta, 'test.meta.ts')
        expect(errors.length).toBeGreaterThan(0)
      })
    )
  })

  it('rejects metadata with empty title', () => {
    fc.assert(
      fc.property(animationId, humanString, (id, description) => {
        const meta = { id, title: '', description }
        const errors = validateAnimationMetadata(meta, 'test.meta.ts')
        expect(errors.length).toBeGreaterThan(0)
      })
    )
  })

  it('rejects metadata with invalid tier', () => {
    fc.assert(
      fc.property(
        validMetadata,
        fc.integer().filter((n) => n < 1 || n > 4),
        (meta, badTier) => {
          const errors = validateAnimationMetadata({ ...meta, tier: badTier }, 'test.meta.ts')
          expect(errors.length).toBeGreaterThan(0)
        }
      )
    )
  })

  it('rejects non-integer tier values', () => {
    fc.assert(
      fc.property(
        validMetadata,
        fc.double({ min: 1.01, max: 3.99, noNaN: true }).filter((n) => !Number.isInteger(n)),
        (meta, fractionalTier) => {
          const errors = validateAnimationMetadata(
            { ...meta, tier: fractionalTier },
            'test.meta.ts'
          )
          expect(errors.length).toBeGreaterThan(0)
        }
      )
    )
  })

  it('rejects metadata with invalid demoMode', () => {
    fc.assert(
      fc.property(
        validMetadata,
        fc
          .string({ minLength: 1, maxLength: 20 })
          .filter(
            (s) => !['burst', 'magnet', 'trail', 'fountain', 'icon-dot', 'status-row'].includes(s)
          ),
        (meta, badMode) => {
          const errors = validateAnimationMetadata({ ...meta, demoMode: badMode }, 'test.meta.ts')
          expect(errors.length).toBeGreaterThan(0)
        }
      )
    )
  })

  it('includes source path in error messages', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-z][a-z0-9/.-]{4,39}$/), (sourcePath) => {
        const errors = validateAnimationMetadata({}, sourcePath)
        expect(errors.length).toBeGreaterThan(0)
        for (const error of errors) {
          expect(error).toContain(sourcePath)
        }
      })
    )
  })
})
