import { toHex } from '@/utils/colors'
import type React from 'react'
import { useLayoutEffect, useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────

export const MIN_BULB_COUNT = 4
export const MAX_BULB_COUNT = 22

export const clampBulbCount = (value: number) =>
  Math.max(MIN_BULB_COUNT, Math.min(MAX_BULB_COUNT, value))

// ── Color resolution ──────────────────────────────────────────────────────

/**
 * Resolves a CSS token color (e.g. `var(--pf-anim-gold)`) to a hex string
 * suitable for an `<input type="color">` element.
 *
 * Uses getComputedStyle to resolve CSS custom properties, then falls back
 * to a DOM probe via `toHex()`. Returns empty string if resolution fails
 * (e.g. in test environments without CSS variables).
 */
export const resolveColorInputDefault = (tokenColor: string): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''

  const tokenMatch = tokenColor.match(/^var\((--[\w-]+)\)$/)
  if (tokenMatch) {
    const cssTokenValue = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(tokenMatch[1]!)
      .trim()
    if (cssTokenValue !== '') {
      try {
        return toHex(cssTokenValue)
      } catch {
        // CSS variable resolved to an unparseable value — fall through to DOM probe
      }
    }
  }

  try {
    return toHex(tokenColor)
  } catch {
    // Color could not be parsed (e.g., CSS variable not available in test env)
    return ''
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────

/** State shape returned by useCardControls. */
export type CardControlsState = {
  bulbCount: number
  onColor: string
  prizeCount: number
  setBulbCount: (v: number) => void
  setOnColor: (v: string) => void
  setPrizeCount: (v: number) => void
  setReplayKey: React.Dispatch<React.SetStateAction<number>>
}

/**
 * Manages interactive control state for animation cards: bulb count,
 * bulb color, and prize count. Resolves the initial color from a CSS
 * custom property on mount.
 */
export const useCardControls = (
  setReplayKey: React.Dispatch<React.SetStateAction<number>>
): CardControlsState => {
  const [bulbCount, setBulbCount] = useState(16)
  const [onColor, setOnColor] = useState('')
  const [prizeCount, setPrizeCount] = useState(3)

  // Resolve CSS custom property to hex — requires DOM access, so runs in layout effect
  // rather than a state initializer to avoid side effects during render. The setState
  // here fires exactly once on mount to resolve var(--pf-anim-gold) through the DOM.
  useLayoutEffect(() => {
    setOnColor(resolveColorInputDefault('var(--pf-anim-gold)')) // eslint-disable-line @eslint-react/set-state-in-effect -- intentional mount-only DOM probe
  }, [])

  return { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey }
}
