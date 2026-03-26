import { describe, it, expect } from 'vitest'
import { assertNever } from '@/utils/assertNever'

describe('assertNever', () => {
  it('throws with a default message including the unexpected value', () => {
    expect(() => assertNever('oops' as never)).toThrow('Unexpected value: "oops"')
  })

  it('throws with a custom message when provided', () => {
    expect(() => assertNever('bad' as never, 'Unhandled variant')).toThrow('Unhandled variant')
  })

  it('serializes non-string values in the default message', () => {
    expect(() => assertNever(42 as never)).toThrow('Unexpected value: 42')
    expect(() => assertNever(null as never)).toThrow('Unexpected value: null')
  })

  it('has return type never (compile-time check)', () => {
    // This test verifies the type signature at compile time.
    // If assertNever returned anything other than `never`,
    // using it as a switch default in a non-void function would error.
    type Action = { type: 'a' } | { type: 'b' }

    function handle(action: Action): string {
      switch (action.type) {
        case 'a':
          return 'A'
        case 'b':
          return 'B'
        default:
          // assertNever's `never` return allows this in a string-returning function
          return assertNever(action.type)
      }
    }

    expect(handle({ type: 'a' })).toBe('A')
    expect(handle({ type: 'b' })).toBe('B')
  })
})
