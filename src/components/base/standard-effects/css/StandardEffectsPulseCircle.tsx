/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Pulse Circle CSS effect.
 * Consumer product: StandardEffectsPulseCircle.module.css — use documented HTML structure.
 */
import { memo, type CSSProperties } from 'react'
import styles from './StandardEffectsPulseCircle.module.css'
import {
  INDICATOR_COLOR,
  INDICATOR_RING_COLOR,
} from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsPulseCircleProps {
  size?: number
  color?: string
  ringColor?: string
  duration?: number
}

function StandardEffectsPulseCircleComponent({
  size = 76,
  color = INDICATOR_COLOR,
  ringColor = INDICATOR_RING_COLOR,
  duration = 2200,
}: StandardEffectsPulseCircleProps) {
  const style = {
    ['--pf-pulse-circle-size' as string]: `${size}px`,
    ['--pf-pulse-circle-color' as string]: color,
    ['--pf-pulse-circle-ring-color' as string]: ringColor,
    ['--pf-pulse-circle-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div
      className={styles['pf-pulse-circle-wrapper']}
      data-animation-id="standard-effects__pulse-circle"
      style={style}
    >
      <div className={styles['pf-pulse-circle']} role="img" aria-label="Pulse circle" />
    </div>
  )
}

export const StandardEffectsPulseCircle = memo(StandardEffectsPulseCircleComponent)
