/**
 * Property-based tests for source code transformation utilities.
 * Verifies invariants of cleanSourceForDisplay across arbitrary inputs.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { cleanSourceForDisplay } from '@/lib/sourceTransform'

/** Arbitrary for lines that should NOT be transformed (no data-animation-id, no MockModalContent). */
const normalLine = fc
  .string({ minLength: 0, maxLength: 120 })
  .filter(
    (s) =>
      !s.includes('\n') &&
      !s.includes('data-animation-id=') &&
      !/import\s+\{?\s*MockModalContent/.test(s)
  )

/** Arbitrary for a multi-line source string made of normal lines. */
const normalSource = fc
  .array(normalLine, { minLength: 1, maxLength: 50 })
  .map((lines) => lines.join('\n'))

/** Arbitrary for valid animation ID strings (no quotes or newlines). */
const safeId = fc.stringMatching(/^[a-z][a-z0-9_-]{1,29}$/)

describe('cleanSourceForDisplay — property-based', () => {
  it('is idempotent: f(f(x)) === f(x)', () => {
    fc.assert(
      fc.property(normalSource, (source) => {
        const once = cleanSourceForDisplay(source)
        const twice = cleanSourceForDisplay(once)
        expect(twice).toBe(once)
      })
    )
  })

  it('never increases line count', () => {
    fc.assert(
      fc.property(normalSource, (source) => {
        const result = cleanSourceForDisplay(source)
        const inputLines = source.split('\n').length
        const outputLines = result === '' ? 0 : result.split('\n').length
        expect(outputLines).toBeLessThanOrEqual(inputLines)
      })
    )
  })

  it('strips data-animation-id attributes', () => {
    fc.assert(
      fc.property(safeId, (id) => {
        const source = `<div data-animation-id="${id}" className="foo">content</div>`
        const result = cleanSourceForDisplay(source)
        expect(result).not.toContain('data-animation-id')
      })
    )
  })

  it('replaces MockModalContent imports with guidance comment', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          "import { MockModalContent } from '../MockContent'",
          "import MockModalContent from './MockContent'",
          "import {MockModalContent} from '@/mock'"
        ),
        (importLine) => {
          const source = `${importLine}\nconst x = 1`
          const result = cleanSourceForDisplay(source)
          expect(result).toContain('Replace <MockModalContent />')
          expect(result).not.toContain('from')
        }
      )
    )
  })

  it('preserves lines without target patterns unchanged', () => {
    fc.assert(
      fc.property(normalSource, (source) => {
        const result = cleanSourceForDisplay(source)
        const resultLines = result.split('\n')
        for (const line of resultLines) {
          if (line.includes('Replace <MockModalContent />')) continue
          expect(source).toContain(line.trim())
        }
      })
    )
  })
})
