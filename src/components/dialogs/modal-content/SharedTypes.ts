import type { CSSProperties, ReactNode } from 'react'

/**
 * Shared props for content choreography animations.
 *
 * Each animation is a stagger container: it wraps `children` and reveals them
 * one-by-one with a specific animation effect. When `children` is omitted,
 * styled placeholder items render so the effect is visible in the catalog.
 *
 * Consumer usage:
 * ```tsx
 * <ModalContentButtonsStagger2 stagger={80} duration={350}>
 *   <button>Accept</button>
 *   <button>Cancel</button>
 * </ModalContentButtonsStagger2>
 * ```
 */
export interface ContentStaggerProps {
  /** Items to choreograph. Each direct child is animated as one unit. */
  children?: ReactNode

  /** Duration of each item's entrance animation in ms. Default varies per animation. */
  duration?: number

  /** Delay between each item's entrance in ms. Default varies per animation. */
  stagger?: number

  /** Additional CSS class name on the root container. */
  className?: string

  /** Additional inline styles on the root container. */
  style?: CSSProperties

  /** Fires after the last item's animation completes (framer variant only). */
  onAnimationComplete?: () => void
}

/**
 * Extended props for directional reveal animations (left/right slide).
 */
export interface DirectionalRevealProps extends ContentStaggerProps {
  /** Horizontal slide distance in px. Default 32. */
  distance?: number
}
