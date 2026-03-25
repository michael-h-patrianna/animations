/**
 * Catalog display for the Radial Pulse CSS effect.
 * Consumer product: StandardEffectsRadialPulse.css — use documented HTML structure.
 */
import { memo, type CSSProperties } from 'react'
import './StandardEffectsRadialPulse.css'
import {
  INDICATOR_DOT_COLOR,
  INDICATOR_DOT_BORDER_COLOR,
  INDICATOR_RADIAL_RING_COLOR,
} from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsRadialPulseProps {
  ringCount?: number
  color?: string
  dotColor?: string
  dotBorderColor?: string
  duration?: number
}

function StandardEffectsRadialPulseComponent({
  ringCount = 3,
  color = INDICATOR_RADIAL_RING_COLOR,
  dotColor = INDICATOR_DOT_COLOR,
  dotBorderColor = INDICATOR_DOT_BORDER_COLOR,
  duration = 2400,
}: StandardEffectsRadialPulseProps) {
  const style = {
    ['--pf-radial-pulse-color' as string]: color,
    ['--pf-radial-pulse-dot-color' as string]: dotColor,
    ['--pf-radial-pulse-dot-border-color' as string]: dotBorderColor,
    ['--pf-radial-pulse-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div
      className="pf-radial-pulse"
      data-animation-id="standard-effects__radial-pulse"
      style={style}
      role="img"
      aria-label="Radial pulse"
    >
      {Array.from({ length: ringCount }, (_, index) => (
        <span
          key={index}
          className="pf-radial-pulse__ring"
          style={{ animationDelay: `${index * 0.6}s` }}
        />
      ))}
      <span className="pf-radial-pulse__dot" />
    </div>
  )
}

export const StandardEffectsRadialPulse = memo(StandardEffectsRadialPulseComponent)
