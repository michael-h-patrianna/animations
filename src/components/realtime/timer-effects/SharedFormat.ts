/**
 * Shared time formatting and color utilities for timer-effect animations.
 *
 * Copy-paste files: this file
 * Runtime deps: (none)
 */

/**
 * Formats total seconds as `MM:SS`.
 * Returns `'00:00'` for zero or negative values.
 */
export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// ============================================================================
// Color Interpolation (used by TimerFlash and TimerFlashSoft framer variants)
// ============================================================================

/** RGB color components for interpolation. */
export interface RgbColor {
  r: number
  g: number
  b: number
}

export const FLASH_NORMAL_RGB: RgbColor = { r: 255, g: 193, b: 7 }
export const FLASH_CRITICAL_RGB: RgbColor = { r: 220, g: 53, b: 69 }

function easeInOutFn(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/** Interpolates between two RGB colors using an easeInOut urgency curve. */
export function computeUrgencyColor(
  seconds: number,
  warningThreshold: number,
  normalColor: RgbColor,
  criticalColor: RgbColor
): string {
  const urgency =
    seconds <= warningThreshold ? (warningThreshold - seconds) / warningThreshold : 0
  const eased = easeInOutFn(urgency)
  const r = Math.round(normalColor.r + (criticalColor.r - normalColor.r) * eased)
  const g = Math.round(normalColor.g + (criticalColor.g - normalColor.g) * eased)
  const b = Math.round(normalColor.b + (criticalColor.b - normalColor.b) * eased)
  return `rgb(${r}, ${g}, ${b})` // eslint-disable-line animation-rules/no-hardcoded-colors -- dynamic color computation
}
