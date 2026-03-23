import {
  clampBulbCount,
  MAX_BULB_COUNT,
  MIN_BULB_COUNT,
  resolveColorInputDefault,
  useCardControls,
} from '@/components/ui/useCardControls'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('clampBulbCount', () => {
  it('returns value when within range', () => {
    expect(clampBulbCount(10)).toBe(10)
    expect(clampBulbCount(MIN_BULB_COUNT)).toBe(MIN_BULB_COUNT)
    expect(clampBulbCount(MAX_BULB_COUNT)).toBe(MAX_BULB_COUNT)
  })

  it('clamps below minimum to MIN_BULB_COUNT', () => {
    expect(clampBulbCount(0)).toBe(MIN_BULB_COUNT)
    expect(clampBulbCount(-1)).toBe(MIN_BULB_COUNT)
    expect(clampBulbCount(MIN_BULB_COUNT - 1)).toBe(MIN_BULB_COUNT)
  })

  it('clamps above maximum to MAX_BULB_COUNT', () => {
    expect(clampBulbCount(100)).toBe(MAX_BULB_COUNT)
    expect(clampBulbCount(MAX_BULB_COUNT + 1)).toBe(MAX_BULB_COUNT)
  })

  it('handles NaN by returning MIN_BULB_COUNT', () => {
    expect(clampBulbCount(NaN)).toBe(MIN_BULB_COUNT)
  })

  it('handles Infinity by clamping to MAX_BULB_COUNT', () => {
    expect(clampBulbCount(Infinity)).toBe(MAX_BULB_COUNT)
  })

  it('handles -Infinity by clamping to MIN_BULB_COUNT', () => {
    expect(clampBulbCount(-Infinity)).toBe(MIN_BULB_COUNT)
  })
})

describe('resolveColorInputDefault', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--test-color')
  })

  it('resolves CSS custom property to hex', () => {
    document.documentElement.style.setProperty('--test-color', '#ff6600')
    const result = resolveColorInputDefault('var(--test-color)')
    expect(result).toBe('#ff6600')
  })

  it('returns empty string for unset CSS custom property', () => {
    // --nonexistent-color is not set, so getComputedStyle returns ''
    const result = resolveColorInputDefault('var(--nonexistent-color)')
    expect(result).toBe('')
  })

  it('resolves direct hex color', () => {
    const result = resolveColorInputDefault('#ff0000')
    expect(result).toBe('#ff0000')
  })

  it('resolves rgb() format', () => {
    const result = resolveColorInputDefault('rgb(255, 0, 0)')
    expect(result).toBe('#ff0000')
  })

  it('returns empty string for unparseable color', () => {
    // toHex throws on unparseable strings; resolveColorInputDefault catches and returns ''
    const result = resolveColorInputDefault('not-a-color')
    expect(result).toBe('')
  })

  it('returns empty string for empty string input', () => {
    const result = resolveColorInputDefault('')
    expect(result).toBe('')
  })

  it('handles CSS variable with rgb value', () => {
    document.documentElement.style.setProperty('--test-color', 'rgb(0, 128, 255)')
    const result = resolveColorInputDefault('var(--test-color)')
    expect(result).toBe('#0080ff')
  })

  it('handles malformed var() syntax', () => {
    // var( missing closing paren won't match the regex
    const result = resolveColorInputDefault('var(--broken')
    // Falls through to toHex('var(--broken') which throws → returns ''
    expect(result).toBe('')
  })

  it('handles var() with invalid property name', () => {
    const result = resolveColorInputDefault('var(not-a-prop)')
    // Regex /^var\((--[\w-]+)\)$/ won't match because 'not-a-prop' doesn't start with --
    // Falls through to toHex('var(not-a-prop)') → throws → returns ''
    expect(result).toBe('')
  })

  it('handles var() with extra whitespace inside parens', () => {
    // The regex /^var\((--[\w-]+)\)$/ requires exact match — no whitespace allowed
    // CSS spec allows var( --foo ), but the regex is strict
    const result = resolveColorInputDefault('var( --test-color )')
    expect(result).toBe('')
  })

  it('handles var() with fallback value syntax', () => {
    // CSS allows var(--color, #ff0000) but the regex /^var\((--[\w-]+)\)$/ requires
    // the var() to contain ONLY the property name — no fallback. So this won't match.
    const result = resolveColorInputDefault('var(--missing, #ff0000)')
    expect(result).toBe('')
  })

  it('handles CSS variable resolving to empty string (set but empty)', () => {
    // Setting a property to '' via style.setProperty makes getComputedStyle return ''
    document.documentElement.style.setProperty('--test-color', '')
    const result = resolveColorInputDefault('var(--test-color)')
    // getPropertyValue returns '' → empty string check triggers → falls through to toHex
    // toHex('var(--test-color)') → throws because var() can't be parsed statically → returns ''
    expect(result).toBe('')
  })

  it('handles CSS variable resolving to whitespace-only value', () => {
    document.documentElement.style.setProperty('--test-color', '   ')
    const result = resolveColorInputDefault('var(--test-color)')
    // getPropertyValue returns '   ', .trim() is '' → same as empty → falls through
    expect(result).toBe('')
    document.documentElement.style.removeProperty('--test-color')
  })

  it('handles non-var() non-hex color strings without throwing', () => {
    // 'transparent' is not hex/rgb — toHex resolves it via DOM probe.
    // In happy-dom this either resolves to a hex or throws and returns ''.
    const result = resolveColorInputDefault('transparent')
    // Valid outcomes are a hex string (#rrggbb) or empty string (resolution failed)
    expect(result === '' || /^#[\da-f]{6}$/i.test(result)).toBe(true)
  })
})

describe('useCardControls', () => {
  it('returns initial state with default values', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    expect(result.current.bulbCount).toBe(16)
    expect(result.current.prizeCount).toBe(3)
    // onColor is resolved via useLayoutEffect — in test env without CSS vars, returns ''
    expect(result.current.onColor).toBe('')
  })

  it('setBulbCount updates bulb count', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    act(() => {
      result.current.setBulbCount(10)
    })

    expect(result.current.bulbCount).toBe(10)
  })

  it('setOnColor updates color', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    act(() => {
      result.current.setOnColor('#ff6600')
    })

    expect(result.current.onColor).toBe('#ff6600')
  })

  it('setPrizeCount updates prize count', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    act(() => {
      result.current.setPrizeCount(5)
    })

    expect(result.current.prizeCount).toBe(5)
  })

  it('passes setReplayKey through', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    expect(result.current.setReplayKey).toBe(setReplayKey)
  })

  it('resolves CSS custom property color on mount', () => {
    document.documentElement.style.setProperty('--pf-anim-gold', '#ffd700')
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    expect(result.current.onColor).toBe('#ffd700')
    document.documentElement.style.removeProperty('--pf-anim-gold')
  })

  it('state updates are independent (changing one does not affect others)', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    act(() => {
      result.current.setBulbCount(8)
    })

    expect(result.current.bulbCount).toBe(8)
    expect(result.current.prizeCount).toBe(3) // unchanged
  })

  it('exposes setReplayKey that delegates to the provided setter', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    // AnimationCardControls calls setReplayKey(k => k + 1) when controls change
    const updater = (k: number) => k + 1
    result.current.setReplayKey(updater)
    expect(setReplayKey).toHaveBeenCalledWith(updater)
  })

  it('handles rapid sequential state updates correctly', () => {
    const setReplayKey = vi.fn()
    const { result } = renderHook(() => useCardControls(setReplayKey))

    act(() => {
      result.current.setBulbCount(10)
      result.current.setOnColor('#ff0000')
      result.current.setPrizeCount(5)
    })

    expect(result.current.bulbCount).toBe(10)
    expect(result.current.onColor).toBe('#ff0000')
    expect(result.current.prizeCount).toBe(5)
  })
})
