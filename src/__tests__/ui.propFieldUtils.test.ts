import { describe, it, expect } from 'vitest'
import {
  isStyleValueRecord,
  normalizeColorDefault,
  resolveColorArray,
  parseStyleNumberValue,
  serializeStyleFieldValue,
  buildStyleObjectDefaultRecord,
} from '@/components/ui/propFieldUtils'
import type { StyleObjectFieldConfig } from '@/types/animation'

describe('isStyleValueRecord', () => {
  it('returns true for plain objects', () => {
    expect(isStyleValueRecord({ a: 1 })).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isStyleValueRecord([1, 2])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isStyleValueRecord(null)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isStyleValueRecord('string')).toBe(false)
    expect(isStyleValueRecord(42)).toBe(false)
  })
})

describe('normalizeColorDefault', () => {
  it('returns empty string for null/undefined', () => {
    expect(normalizeColorDefault(undefined)).toBe('')
    expect(normalizeColorDefault(undefined)).toBe('')
  })

  it('passes through valid hex colors', () => {
    const result = normalizeColorDefault('#ff0000')
    expect(result).toBe('#ff0000')
  })
})

describe('resolveColorArray', () => {
  it('normalizes each color in the array', () => {
    const result = resolveColorArray(['#ff0000', '#00ff00'])
    expect(result).toEqual(['#ff0000', '#00ff00'])
  })

  it('handles empty arrays', () => {
    expect(resolveColorArray([])).toEqual([])
  })
})

describe('parseStyleNumberValue', () => {
  it('returns number from number input', () => {
    expect(parseStyleNumberValue(42)).toBe(42)
  })

  it('parses number from string with unit', () => {
    expect(parseStyleNumberValue('16px')).toBe(16)
  })

  it('parses negative numbers', () => {
    expect(parseStyleNumberValue('-5deg')).toBe(-5)
  })

  it('parses decimal numbers', () => {
    expect(parseStyleNumberValue('0.5em')).toBe(0.5)
  })

  it('returns undefined for non-numeric strings', () => {
    expect(parseStyleNumberValue('auto')).toStrictEqual(undefined)
  })

  it('returns undefined for NaN', () => {
    expect(parseStyleNumberValue(NaN)).toStrictEqual(undefined)
  })

  it('returns undefined for non-string non-number', () => {
    expect(parseStyleNumberValue(null)).toStrictEqual(undefined)
    expect(parseStyleNumberValue(true)).toStrictEqual(undefined)
  })
})

describe('serializeStyleFieldValue', () => {
  it('serializes number with unit', () => {
    const field: StyleObjectFieldConfig = { type: 'number', key: '--x', label: 'X', unit: 'px' }
    expect(serializeStyleFieldValue(field, 16)).toBe('16px')
  })

  it('serializes number without unit', () => {
    const field: StyleObjectFieldConfig = { type: 'number', key: '--x', label: 'X' }
    expect(serializeStyleFieldValue(field, 42)).toBe('42')
  })

  it('returns empty string for non-number on number field', () => {
    const field: StyleObjectFieldConfig = { type: 'number', key: '--x', label: 'X' }
    expect(serializeStyleFieldValue(field, 'abc')).toBe('')
  })

  it('serializes color strings', () => {
    const field: StyleObjectFieldConfig = { type: 'color', key: '--c', label: 'Color' }
    expect(serializeStyleFieldValue(field, '#ff0000')).toBe('#ff0000')
  })

  it('serializes string fields', () => {
    const field: StyleObjectFieldConfig = { type: 'string', key: '--s', label: 'String' }
    expect(serializeStyleFieldValue(field, 'hello')).toBe('hello')
  })
})

describe('buildStyleObjectDefaultRecord', () => {
  it('builds record from field definitions', () => {
    const fields: StyleObjectFieldConfig[] = [
      { type: 'number', key: '--size', label: 'Size', default: 16, unit: 'px' },
      { type: 'color', key: '--color', label: 'Color', default: '#333' },
      { type: 'string', key: '--family', label: 'Font', default: 'sans-serif' },
    ]
    const result = buildStyleObjectDefaultRecord(fields)
    expect(result['--size']).toBe('16px')
    expect(result['--color']).toBe('#333333')
    expect(result['--family']).toBe('sans-serif')
  })

  it('omits fields with empty default values', () => {
    const fields: StyleObjectFieldConfig[] = [
      { type: 'number', key: '--x', label: 'X' }, // no default
      { type: 'string', key: '--y', label: 'Y' }, // default is ''
    ]
    const result = buildStyleObjectDefaultRecord(fields)
    expect(Object.keys(result)).toEqual([])
  })
})
