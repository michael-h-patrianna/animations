/** Shared utilities for the modal-celebrations group. */

/** Random float in [min, max). */
export const randBetween = (min: number, max: number): number =>
  Math.random() * (max - min) + min

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

/** Pick a random item from an array. */
export const pickRandom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

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

/** Celebration color palette — sourced from design tokens. */
export const CELEBRATION_COLORS = [
  'var(--pf-anim-firework-pink)',
  'var(--pf-anim-green)',
  'var(--pf-anim-firework-cyan)',
  'var(--pf-anim-firework-gold)',
  'var(--pf-base-50)',
] as const

/** Golden palette for coin/treasure effects — uses design tokens. */
export const GOLDEN_COLORS = [
  'var(--pf-anim-gold)',
  'var(--pf-anim-coin-dark)',
  'var(--pf-anim-coin-light)',
  'var(--pf-anim-coin-gold)',
  'var(--pf-anim-yellow-warm)',
] as const

/** Gem color configs — uses design tokens. */
export const GEM_TYPES = [
  { name: 'diamond', color1: 'var(--pf-anim-firework-cyan)', color2: 'var(--pf-anim-sky)' },
  { name: 'ruby', color1: 'var(--pf-anim-confetti-red)', color2: 'var(--pf-anim-red-dark)' },
  { name: 'emerald', color1: 'var(--pf-anim-emerald)', color2: 'var(--pf-anim-green-dark)' },
  { name: 'sapphire', color1: 'var(--pf-anim-blue)', color2: 'var(--pf-anim-blue-dark)' },
] as const
