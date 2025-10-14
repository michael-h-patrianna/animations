export const motionDurations = {
  pulse: 1.5,
  pulseCircle: 2.2,
  pulseWave: 2,
} as const

export const motionEasings = {
  standard: [0.4, 0, 0.6, 1] as const,
} as const

/**
 * Overlay opacity tokens for modal backgrounds and overlays
 */
export const overlayOpacity = {
  /** Subtle overlay - 40% opacity */
  subtle: 0.4,
  /** Standard overlay - 68% opacity (default for most modals) */
  standard: 0.68,
  /** Strong overlay - 85% opacity (for high-emphasis modals) */
  strong: 0.85,
} as const
