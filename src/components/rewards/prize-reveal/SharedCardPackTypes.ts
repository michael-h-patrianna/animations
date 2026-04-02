/** Phase of the card-pack opening sequence. */
export type PackPhase = 'arrival' | 'anticipation' | 'burst' | 'fan' | 'flip' | 'idle'

/** Rarity tier 1-5 (common → legendary). */
export type CardRarity = 1 | 2 | 3 | 4 | 5

/** Data for a single card in the pack. */
export type CardData = {
  id: number
  name: string
  rarity: CardRarity
  frontImage: string
  setId?: string
  isNew?: boolean
}

/** Fan-out position for a revealed card. */
export type FanPosition = { x: number; y: number; rotate: number }

/** Pre-calculated data for a confetti particle. */
export type ConfettiData = {
  id: number
  angle: number
  distance: number
  rotation: number
  size: number
  duration: number
  delay: number
}

/** Glow color per rarity tier, referenced as CSS variables. */
export const RARITY_COLORS: Record<CardRarity, { glow: string }> = {
  1: { glow: 'var(--rarity-common-glow)' },
  2: { glow: 'var(--rarity-uncommon-glow)' },
  3: { glow: 'var(--rarity-rare-glow)' },
  4: { glow: 'var(--rarity-epic-glow)' },
  5: { glow: 'var(--rarity-legendary-glow)' },
}
