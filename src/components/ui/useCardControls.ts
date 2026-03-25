import { resolveColorInputDefault } from '@/utils/colors'
import type React from 'react'
import { useLayoutEffect, useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────

export const MIN_BULB_COUNT = 4
export const MAX_BULB_COUNT = 22

export const clampBulbCount = (value: number) =>
  Number.isNaN(value) ? MIN_BULB_COUNT : Math.max(MIN_BULB_COUNT, Math.min(MAX_BULB_COUNT, value))

// ── Color resolution ──────────────────────────────────────────────────────

export { resolveColorInputDefault } from '@/utils/colors'

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
    setOnColor(resolveColorInputDefault('var(--pf-anim-gold)'))
  }, [])

  return { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey }
}
