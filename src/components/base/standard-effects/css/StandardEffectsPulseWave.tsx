/**
 * Catalog display for the Pulse Wave CSS effect.
 * Consumer product: StandardEffectsPulseWave.css — use documented HTML structure.
 */
import { memo, type CSSProperties } from 'react'
import './StandardEffectsPulseWave.css'

interface StandardEffectsPulseWaveProps {
  size?: number
  color?: string
  ringColor?: string
  duration?: number
}

function StandardEffectsPulseWaveComponent({
  size = 56,
  color = '#7a468e',
  ringColor = 'rgb(236 195 255 / 60%)',
  duration = 2000,
}: StandardEffectsPulseWaveProps) {
  const style = {
    ['--pf-pulse-wave-size' as string]: `${size}px`,
    ['--pf-pulse-wave-color' as string]: color,
    ['--pf-pulse-wave-ring-color' as string]: ringColor,
    ['--pf-pulse-wave-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div
      className="pf-pulse-wave"
      data-animation-id="standard-effects__pulse-wave"
      style={style}
      role="img"
      aria-label="Pulse wave"
    >
      <div className="pf-pulse-wave__core" />
    </div>
  )
}

export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)
