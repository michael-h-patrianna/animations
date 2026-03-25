import type { CSSProperties } from 'react'

function buildSurfaceGradient(color: string): string {
  return `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 72%, black) 100%)`
}

function buildGlowColor(color: string): string {
  return `color-mix(in srgb, ${color} 55%, transparent)`
}

export function buildHeartbeatPillTheme(color: string): CSSProperties {
  return {
    background: buildSurfaceGradient(color),
    '--glow-color': buildGlowColor(color),
  } as CSSProperties
}

export function buildGlitchPillTheme(color: string): CSSProperties {
  return {
    background: buildSurfaceGradient(color),
    '--glow-color': buildGlowColor(color),
    '--timer-effects-pill-countdown-glitch-color-1': `color-mix(in srgb, ${color} 40%, cyan 60%)`,
    '--timer-effects-pill-countdown-glitch-bg-1-ff': `color-mix(in srgb, ${color} 40%, magenta 60%)`,
  } as CSSProperties
}
