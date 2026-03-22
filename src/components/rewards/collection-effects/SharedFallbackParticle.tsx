import { memo } from 'react'
import type { ConfettiShape } from './SharedParticleUtils'

interface FallbackParticleProps {
  shape: ConfettiShape
  color: string
  size: number
}

const SHAPE_PATHS: Record<Exclude<ConfettiShape, 'circle'>, string> = {
  square: 'M4 4h16v16H4z',
  diamond: 'M12 2L22 12L12 22L2 12z',
  triangle: 'M12 3L22 21H2z',
  rectangle: 'M3 7h18v10H3z',
}

/**
 * SVG fallback particle rendered when no particleImages are provided.
 * Pure geometric shapes — lightweight, no image loading required.
 */
function FallbackParticleComponent({ shape, color, size }: FallbackParticleProps) {
  const viewBox = '0 0 24 24'

  if (shape === 'circle') {
    return (
      <svg width={size} height={size} viewBox={viewBox} fill={color} aria-hidden="true" style={{ display: 'block' }}>
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox={viewBox} fill={color} aria-hidden="true" style={{ display: 'block' }}>
      <path d={SHAPE_PATHS[shape]} />
    </svg>
  )
}

export const FallbackParticle = memo(FallbackParticleComponent)
