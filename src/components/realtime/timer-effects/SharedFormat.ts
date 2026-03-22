/**
 * Shared time formatting for timer-effect animations.
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
