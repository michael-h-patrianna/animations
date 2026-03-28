/**
 * Catalog display for the Pulse Wave CSS effect.
 * Consumer product: StandardEffectsPulseWave.module.css — use documented HTML structure.
 */
import { memo, type CSSProperties } from 'react'
import styles from './StandardEffectsPulseWave.module.css'
import {
  INDICATOR_COLOR,
  INDICATOR_RING_COLOR,
} from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsPulseWaveProps {
  size?: number
  color?: string
  ringColor?: string
  duration?: number
}

function StandardEffectsPulseWaveComponent({
  size = 56,
  color = INDICATOR_COLOR,
  ringColor = INDICATOR_RING_COLOR,
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
      className={styles['pf-pulse-wave']}
      data-animation-id="standard-effects__pulse-wave"
      style={style}
      role="img"
      aria-label="Pulse wave"
    >
      <div className={styles['pf-pulse-wave__core']} />
    </div>
  )
}

export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)
