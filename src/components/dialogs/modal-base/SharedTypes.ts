import type { CSSProperties, ReactNode } from 'react'

/**
 * Shared props for all modal entrance animations.
 *
 * Every modal animation is a wrapper: it renders an animated overlay + an animated
 * content container around `children`. The consumer passes their own modal as children.
 * When `children` is omitted, a minimal placeholder renders so the animation is visible.
 */
export interface ModalEntranceProps {
  /**
   * The modal content to animate. When omitted, renders a minimal placeholder.
   * The animation wraps this content — it does not dictate modal styling.
   */
  children?: ReactNode

  /**
   * Total entrance animation duration in milliseconds.
   * Each animation has its own default (typically 400–900ms).
   * For CSS variants, applied via CSS custom property override.
   */
  duration?: number

  /**
   * Overlay opacity at the end of the fade-in (0–1).
   * Controls how much the backdrop dims. Default: 0.5.
   */
  overlayOpacity?: number

  /** Additional CSS class name applied to the content wrapper. */
  className?: string

  /** Additional inline styles applied to the content wrapper. */
  style?: CSSProperties

  /** Fires after the entrance animation completes. */
  onAnimationComplete?: () => void
}

/** Default overlay opacity when not specified by the consumer. */
export const DEFAULT_OVERLAY_OPACITY = 0.5
