import type { ReactNode } from 'react'

/**
 * Shared props for dot-indicator animations (DotBounce, DotPulse, DotRadar, DotSweep).
 *
 * The component overlays an animated notification dot on `children`.
 * When `children` is omitted, renders only the dot (centered).
 */
export interface DotIndicatorProps {
  /** Element to decorate with a notification dot (icon, button, avatar, etc.). */
  children?: ReactNode
  /** Dot fill color. Default: '#ff4967' */
  dotColor?: string
  /** Dot diameter in px. Default: 14 */
  dotSize?: number
  /** Animation duration in ms. Each variant has its own default. */
  duration?: number
}

/**
 * Shared props for badge-indicator animations (BadgePop, BadgePulse).
 *
 * The component renders an animated badge label.
 * Content defaults to "New" when `children` is omitted.
 */
export interface BadgeIndicatorProps {
  /** Badge content. Default: 'New' */
  children?: ReactNode
  /** Badge background color. Default: '#c47ae5' */
  color?: string
  /** Animation duration in ms. Each variant has its own default. */
  duration?: number
}
