import type { CSSProperties } from 'react'

/**
 * Base props for all progress bar components.
 *
 * Every prop is optional. Pass `progress` (0-1) to control the fill level.
 * When omitted the bar renders at 0%.
 */
export interface ProgressBarProps {
  /** Current progress, 0 to 1. Default: 0. */
  progress?: number

  /** Additional CSS class applied to the root element. */
  className?: string

  /** Inline styles applied to the root element. */
  style?: CSSProperties
}

/** A single milestone on a progress bar. */
export interface MilestoneConfig {
  /** Position on the bar, 0 to 1. */
  position: number

  /** Display label shown near the milestone marker. */
  label?: string
}

/** Props for progress bars that display milestone markers. */
export interface MilestoneProgressBarProps extends ProgressBarProps {
  /**
   * Milestone definitions. Each has a `position` (0-1) and optional `label`.
   * When omitted the component uses its built-in defaults.
   */
  milestones?: MilestoneConfig[]
}
