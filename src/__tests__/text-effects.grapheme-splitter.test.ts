/**
 * Locks down grapheme-aware text splitting used by every text-effect animation.
 *
 * The earlier `Array.from(text)` implementation split ZWJ emoji sequences and
 * combining marks into multiple animation spans, so a single user-visible
 * character would render as fragments. These tests pin the contract that
 * grapheme clusters stay intact.
 */
import { describe, expect, it } from 'vitest'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

describe('splitGraphemes', () => {
  it('splits plain ASCII into individual characters', () => {
    expect(splitGraphemes('EPIC')).toEqual(['E', 'P', 'I', 'C'])
  })

  it('keeps a ZWJ family emoji as a single grapheme', () => {
    // 👨‍👩‍👧‍👦 is 7 code points (4 emoji + 3 ZWJs) but one user-visible character.
    expect(splitGraphemes('👨‍👩‍👧‍👦')).toEqual(['👨‍👩‍👧‍👦'])
  })

  it('keeps a combining-mark sequence as a single grapheme', () => {
    // 'é' as e + U+0301 combining acute — two code points, one grapheme.
    expect(splitGraphemes('é')).toEqual(['é'])
  })

  it('splits a mixed string into the right per-grapheme spans', () => {
    const result = splitGraphemes('A👨‍👩‍👧‍👦éZ')
    expect(result).toEqual(['A', '👨‍👩‍👧‍👦', 'é', 'Z'])
  })

  it('returns an empty array for an empty string', () => {
    expect(splitGraphemes('')).toEqual([])
  })
})
