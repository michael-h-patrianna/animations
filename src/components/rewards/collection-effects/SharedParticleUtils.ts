/** Abstract geometric shapes — no semantic meaning, pure confetti. */
export type ConfettiShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'rectangle'

const SHAPES: ConfettiShape[] = ['circle', 'square', 'diamond', 'triangle', 'rectangle']

/** Minimal default palette: gold, coral, teal. */
export const DEFAULT_CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4'] as const

/** Picks a random confetti shape. */
export function randomShape(): ConfettiShape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]!
}

/** Picks a random color from the provided palette. */
export function randomColor(palette: readonly string[]): string {
  return palette[Math.floor(Math.random() * palette.length)]!
}

/** Pre-generates shape + color for a particle. Call once per particle at mount time (useMemo). */
export function generateFallbackParticle(palette?: readonly string[]): {
  shape: ConfettiShape
  color: string
} {
  const colors = palette !== undefined && palette.length > 0 ? palette : DEFAULT_CONFETTI_COLORS
  return { shape: randomShape(), color: randomColor(colors) }
}
