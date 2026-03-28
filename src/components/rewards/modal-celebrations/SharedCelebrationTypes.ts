/**
 * Shared types for all modal-celebration animations.
 *
 * Copy-paste files: this file (required by all celebration components)
 * Runtime deps: react
 */

/**
 * Base props shared by all celebration particle effects.
 * Every celebration animation extends this interface with animation-specific
 * count and appearance props.
 *
 * All props are optional — animations produce meaningful output with zero configuration.
 */
export interface CelebrationBaseProps {
  /**
   * Total animation duration in milliseconds.
   * Each animation has its own default (typically 1200–3000ms).
   * Internal timings (delays, sub-animations) scale proportionally.
   */
  duration?: number

  /**
   * Color palette for particles, trails, and sparkles.
   * Defaults vary by animation type:
   * - Confetti effects: celebration palette (pink, green, cyan, gold, white)
   * - Coin effects: golden palette (gold, amber, cream)
   * Accepts any valid CSS color string (hex, rgb, hsl).
   */
  colors?: readonly string[]

  /**
   * Image URLs for particles. Each particle is randomly assigned an image from the array.
   * When omitted, particles render as colored confetti shapes (or SVG coins for coin effects).
   * Takes precedence over animation-specific image props (e.g., `coinImage`).
   */
  particleImages?: string[]

  /**
   * Maximum width in pixels for image particles.
   * Only applies when `particleImages` is provided. Confetti fallback shapes keep their own sizes.
   * @default 24
   */
  particleMaxWidth?: number

  /**
   * Maximum height in pixels for image particles.
   * Only applies when `particleImages` is provided. Confetti fallback shapes keep their own sizes.
   * @default 24
   */
  particleMaxHeight?: number

  /** Fires after the last particle finishes its animation. */
  onComplete?: () => void
}

/** Celebration color palette — hex values for standalone use. */
export const CELEBRATION_COLORS_HEX = [
  '#ff5981',
  '#c6ff77',
  '#47fff4',
  '#ffce1a',
  '#ffffff',
] as const

/** Golden palette for coin/treasure effects — hex values for standalone use. */
export const GOLDEN_COLORS_HEX = ['#ffd700', '#d97706', '#fde68a', '#fbbf24', '#ffc107'] as const

