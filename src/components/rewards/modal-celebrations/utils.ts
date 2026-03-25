/** Shared utilities for the modal-celebrations group. */

/** Random float in [min, max). */
export const randBetween = (min: number, max: number): number => Math.random() * (max - min) + min

/** Random integer in [min, max]. */
export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

/** Convert polar coordinates to { x, y }. Angle in radians. */
export const polarToXY = (angle: number, radius: number) => ({
  x: Math.cos(angle) * radius,
  y: Math.sin(angle) * radius,
})

/** Degrees to radians. */
export const deg2rad = (deg: number): number => (deg * Math.PI) / 180

/** Pick a random item from a non-empty array. Throws if array is empty. */
export const pickRandom = <T>(arr: readonly T[]): T => {
  if (arr.length === 0) throw new Error('pickRandom: array must not be empty')
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * Confetti particle shapes.
 * - rect: classic rectangle
 * - circle: small dot
 * - ribbon: thin elongated strip
 * - star: 4-pointed star via clip-path
 */
export type ConfettiShape = 'rect' | 'circle' | 'ribbon' | 'star'

/** All available confetti shapes for random selection. */
export const CONFETTI_SHAPES: readonly ConfettiShape[] = ['rect', 'circle', 'ribbon', 'star']

/** Celebration color palette — design tokens with hex fallbacks for standalone use. */
export const CELEBRATION_COLORS = [
  'var(--pf-anim-firework-pink, #ff5981)',
  'var(--pf-anim-green, #c6ff77)',
  'var(--pf-anim-firework-cyan, #47fff4)',
  'var(--pf-anim-firework-gold, #ffce1a)',
  'var(--pf-base-50, #ffffff)',
] as const

/** Golden palette for coin/treasure effects — design tokens with hex fallbacks. */
export const GOLDEN_COLORS = [
  'var(--pf-anim-gold, #ffd700)',
  'var(--pf-anim-coin-dark, #d97706)',
  'var(--pf-anim-coin-light, #fde68a)',
  'var(--pf-anim-coin-gold, #fbbf24)',
  'var(--pf-anim-yellow-warm, #ffc107)',
] as const

/** Gem color configs — design tokens with hex fallbacks. */
export const GEM_TYPES = [
  {
    name: 'diamond',
    color1: 'var(--pf-anim-firework-cyan, #47fff4)',
    color2: 'var(--pf-anim-sky, #38bdf8)',
  },
  {
    name: 'ruby',
    color1: 'var(--pf-anim-confetti-red, #ff6b6b)',
    color2: 'var(--pf-anim-red-dark, #dc2626)',
  },
  {
    name: 'emerald',
    color1: 'var(--pf-anim-emerald, #10b981)',
    color2: 'var(--pf-anim-green-dark, #a8e65c)',
  },
  {
    name: 'sapphire',
    color1: 'var(--pf-anim-blue, #60a5fa)',
    color2: 'var(--pf-anim-blue-dark, #3b82f6)',
  },
] as const
