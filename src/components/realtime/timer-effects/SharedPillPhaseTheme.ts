import type { CSSProperties } from 'react'

// NOTE: `color-mix(in srgb, ...)` has no React Native equivalent.
// Moti adaptation requires pre-computed color values (e.g. via a JS color library)
// instead of CSS color functions.

function buildSurfaceGradient(color: string): string {
  return `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 72%, black) 100%)`
}

function buildGlowColor(color: string): string {
  return `color-mix(in srgb, ${color} 55%, transparent)`
}

/** Builds a CSS custom-property theme for the heartbeat pill countdown variant. */
export function buildHeartbeatPillTheme(color: string): CSSProperties {
  return {
    background: buildSurfaceGradient(color),
    '--glow-color': buildGlowColor(color),
  } as CSSProperties
}

/** Builds a CSS custom-property theme for the glitch pill countdown variant. */
export function buildGlitchPillTheme(color: string): CSSProperties {
  return {
    background: buildSurfaceGradient(color),
    '--glow-color': buildGlowColor(color),
    '--timer-effects-pill-countdown-glitch-color-1': `color-mix(in srgb, ${color} 40%, cyan 60%)`,
    '--timer-effects-pill-countdown-glitch-bg-1-ff': `color-mix(in srgb, ${color} 40%, magenta 60%)`,
  } as CSSProperties
}
