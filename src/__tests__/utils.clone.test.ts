import { describe, expect, it } from 'vitest'
import { isRecord, shallowClone } from '@/utils/clone'

describe('isRecord', () => {
  it('returns true for plain objects', () => {
    expect(isRecord({})).toBe(true)
    expect(isRecord({ a: 1 })).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isRecord([])).toBe(false)
    expect(isRecord([1, 2, 3])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isRecord(null)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isRecord(42)).toBe(false)
    expect(isRecord('string')).toBe(false)
    expect(isRecord(true)).toBe(false)
    expect(isRecord(undefined)).toBe(false)
  })

  it('returns true for class instances (they are objects)', () => {
    expect(isRecord(new Date())).toBe(true)
    expect(isRecord(new Map())).toBe(true)
    expect(isRecord(/regex/)).toBe(true)
  })
})

describe('shallowClone', () => {
  it('shallow-clones arrays', () => {
    const original = [1, 2, 3]
    const cloned = shallowClone(original)
    expect(cloned).toEqual([1, 2, 3])
    expect(cloned).not.toBe(original)
  })

  it('shallow-clones plain objects', () => {
    const original = { a: 1, b: 'two' }
    const cloned = shallowClone(original)
    expect(cloned).toEqual({ a: 1, b: 'two' })
    expect(cloned).not.toBe(original)
  })

  it('returns primitives as-is (identity preserved)', () => {
    expect(shallowClone(42)).toBe(42)
    expect(shallowClone('hello')).toBe('hello')
    expect(shallowClone(true)).toBe(true)
    expect(shallowClone(null)).toBe(null)
    // undefined + null must pass through without wrapping into {} or []
    const undefinedResult = shallowClone(undefined)
    expect(typeof undefinedResult === 'undefined' && undefinedResult === undefined).toBe(true)
  })

  it('does not deep-clone nested objects', () => {
    const nested = { x: 10 }
    const original = { child: nested }
    const cloned = shallowClone(original) as Record<string, unknown>
    expect(cloned).not.toBe(original)
    expect(cloned.child).toBe(nested) // same reference — shallow
  })

  it('does not deep-clone nested arrays', () => {
    const nested = [1, 2]
    const original = [nested]
    const cloned = shallowClone(original) as unknown[]
    expect(cloned).not.toBe(original)
    expect(cloned[0]).toBe(nested) // same reference — shallow
  })

  it('handles empty arrays', () => {
    const cloned = shallowClone([])
    expect(cloned).toEqual([])
  })

  it('handles empty objects', () => {
    const cloned = shallowClone({})
    expect(cloned).toEqual({})
  })
})
