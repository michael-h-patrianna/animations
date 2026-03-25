import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { cleanSourceForDisplay } from '@/lib/sourceTransform'

/** Arbitrary for typical JSX line content (no data-animation-id, no MockModalContent) */
const safeJsxLine = fc
  .array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789 =<>/{}()\'"-_.'.split('')), {
    minLength: 1,
    maxLength: 80,
  })
  .map((chars) => chars.join(''))
  .filter((s) => !s.includes('data-animation-id') && !s.includes('MockModalContent'))

/** Arbitrary for multi-line JSX source without transformable patterns */
const safeSource = fc.array(safeJsxLine, { minLength: 1, maxLength: 20 }).map((lines) => lines.join('\n'))

/** Arbitrary for kebab-case identifier segments */
const kebabSegment = fc
  .array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz-'.split('')), { minLength: 2, maxLength: 15 })
  .map((chars) => chars.join(''))

/** Arbitrary animation IDs matching the group__variant pattern */
const animationId = fc.tuple(kebabSegment, kebabSegment).map(([group, variant]) => `${group}__${variant}`)

describe('cleanSourceForDisplay — property-based', () => {
  it('never increases line count', () => {
    fc.assert(
      fc.property(safeSource, (source) => {
        const inputLines = source.split('\n').length
        const result = cleanSourceForDisplay(source)
        if (result === '') return true
        const outputLines = result.split('\n').length
        return outputLines <= inputLines
      })
    )
  })

  it('is idempotent for non-transformable input', () => {
    fc.assert(
      fc.property(safeSource, (source) => {
        const first = cleanSourceForDisplay(source)
        const second = cleanSourceForDisplay(first)
        expect(second).toBe(first)
      })
    )
  })

  it('removes data-animation-id from properly formatted JSX attributes', () => {
    fc.assert(
      fc.property(animationId, (id) => {
        const source = `<div data-animation-id="${id}" className="pf-test">`
        const result = cleanSourceForDisplay(source)
        expect(result).not.toContain('data-animation-id')
        expect(result).toContain('className="pf-test"')
      })
    )
  })

  it('output is always trimmed', () => {
    fc.assert(
      fc.property(safeSource, (source) => {
        const result = cleanSourceForDisplay(source)
        expect(result).toBe(result.trim())
      })
    )
  })

  it('empty string produces empty string', () => {
    expect(cleanSourceForDisplay('')).toBe('')
  })
})
