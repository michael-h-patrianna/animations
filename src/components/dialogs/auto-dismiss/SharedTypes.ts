import type { CSSProperties, ReactNode } from 'react'

/**
 * Shared props for all auto-dismiss animations.
 *
 * Each animation wraps `children` with enter → visible → exit choreography.
 * The consumer provides their own notification content. When `children` is omitted,
 * a placeholder notification renders so the animation is visible in the catalog.
 */
export interface AutoDismissProps {
  /**
   * Content to wrap with the dismiss animation. When omitted, renders a
   * placeholder notification card. The animation wraps this content — it
   * does not dictate notification styling.
   */
  children?: ReactNode

  /**
   * Auto-dismiss timeout in milliseconds — how long the content stays visible
   * before the exit animation begins. Each animation has its own default.
   */
  duration?: number

  /**
   * Called after the exit animation completes. Use to remove the element
   * from the DOM or update notification state.
   */
  onDismiss?: () => void

  /** Additional CSS class applied to the animated wrapper element. */
  className?: string

  /** Additional inline styles applied to the animated wrapper element. */
  style?: CSSProperties
}
