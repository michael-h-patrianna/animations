/**
 * Catalog display for the Radial Pulse CSS effect.
 * Consumer product: StandardEffectsRadialPulse.css — use documented HTML structure.
 */
import { memo, type CSSProperties } from 'react'
import './StandardEffectsRadialPulse.css'

interface StandardEffectsRadialPulseProps {
  ringCount?: number
  color?: string
  dotColor?: string
  duration?: number
}

function StandardEffectsRadialPulseComponent({
  ringCount = 3,
  color = 'rgb(236 195 255 / 32%)',
  dotColor = '#efd7fa',
  duration = 2400,
}: StandardEffectsRadialPulseProps) {
  const style = {
    ['--pf-radial-pulse-color' as string]: color,
    ['--pf-radial-pulse-dot-color' as string]: dotColor,
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
      {Array.from({ length: ringCount }, (_, index) => index + 1).map((i) => (
        <span
          key={i}
          className={`pf-radial-pulse__ring pf-radial-pulse__ring--${Math.min(i, 3)}`}
          style={{ animationDelay: `${(i - 1) * 0.6}s` }}
        />
      ))}
      <span className="pf-radial-pulse__dot" />
    </div>
  )
}

export const StandardEffectsRadialPulse = memo(StandardEffectsRadialPulseComponent)
