import type { GradientStop } from '@/types/gradient'
import { CHECKERBOARD } from '@/demo-ui/components/ui/colorPickerPanelConstants'

export { CHECKERBOARD }

export const MIN_STOPS = 2
export const MAX_STOPS = 8
export const MARKER_SIZE = 16
export const MARKER_HIT_SIZE = 28

/** Linearly interpolates a color at a position between sorted gradient stops. */
export function interpolateColorAtPosition(sortedStops: GradientStop[], position: number): string {
  // eslint-disable-next-line animation-rules/no-hardcoded-colors -- fallback white for empty gradient
  if (sortedStops.length === 0) return '#ffffff'
  if (sortedStops.length === 1 || position <= sortedStops[0]!.position) {
    return sortedStops[0]!.color
  }
  if (position >= sortedStops[sortedStops.length - 1]!.position) {
    return sortedStops[sortedStops.length - 1]!.color
  }

  for (let i = 0; i < sortedStops.length - 1; i++) {
    const a = sortedStops[i]!
    const b = sortedStops[i + 1]!
    if (position >= a.position && position <= b.position) {
      const range = b.position - a.position
      if (range === 0) return a.color
      const t = (position - a.position) / range
      return lerpHex(a.color, b.color, t)
    }
  }
  return sortedStops[0]!.color
}

function parseHexChannel(hex: string, offset: number): number {
  const parsed = parseInt(hex.slice(offset, offset + 2), 16)
  return Number.isNaN(parsed) ? 0 : parsed
}

function lerpHex(hex1: string, hex2: string, t: number): string {
  const r1 = parseHexChannel(hex1, 1)
  const g1 = parseHexChannel(hex1, 3)
  const b1 = parseHexChannel(hex1, 5)
  const r2 = parseHexChannel(hex2, 1)
  const g2 = parseHexChannel(hex2, 3)
  const b2 = parseHexChannel(hex2, 5)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
