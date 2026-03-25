/** Default colors for update-indicator animations. */

// ── Dot indicators ──
export const DOT_COLOR = '#ff4967'
export const DOT_RADAR_RING = 'rgb(255 73 103 / 50%)'
export const DOT_SWEEP_ACCENT = '#ff0a4d'
export const DOT_SWEEP_HALO = 'rgb(255 73 103 / 55%)'

// ── Badge indicators ──
export const BADGE_COLOR = '#c47ae5'
export const BADGE_TEXT_COLOR = '#ffffff'
export const BADGE_GLOW = 'rgb(236 195 255 / 40%)'

// ── Live ping ──
export const PING_COLOR = '#c6ff77'

/** Build a color-mix ring tint from a base color. */
export function ringTint(base: string, pct: number): string {
  return `color-mix(in srgb, ${base} ${pct}%, transparent)`
}
