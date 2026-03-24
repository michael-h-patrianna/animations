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

/** Normalize children to an array, returning [] when children is undefined. */
export function toItemArray(children: ReactNode | undefined): ReactNode[] {
  if (children === undefined) return []
  return Array.isArray(children) ? children : [children]
}

// ── Shared motion presets (framer variants) ──────────────────────────────

const EASE_STANDARD: [number, number, number, number] = [0.4, 0, 0.2, 1]

/** Modal entrance: scale + translate + fade. */
export const MODAL_ENTRANCE = {
  initial: { scale: 0.88, y: -16, opacity: 0 },
  animate: { scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] },
  transition: { duration: 0.4, ease: EASE_STANDARD, times: [0, 0.5, 1] },
}

/** Reduced-motion fallback: instant fade-in. */
export const REDUCED_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.01 },
}

/** Button bounce-up preset (for demo footer buttons). */
export function buttonBounceProps(delay: number, reduced: boolean) {
  if (reduced) return REDUCED_FADE
  return {
    initial: { y: 16, scale: 0.94, opacity: 0 },
    animate: { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] },
    transition: { duration: 0.3, delay, ease: EASE_STANDARD, times: [0, 0.6, 1] },
  }
}
