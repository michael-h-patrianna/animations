/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Pulse CSS effect.
 * Consumer product: StandardEffectsPulse.module.css — import styles and apply styles['pf-pulse'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsPulse.module.css'
import { DemoBox } from '@/components/demo-blocks'
import { PULSE_GLOW_COLOR } from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsPulseProps {
  children?: ReactNode
  duration?: number
  glowColor?: string
  borderRadius?: number
}

function StandardEffectsPulseComponent({
  children,
  duration = 1500,
  glowColor = PULSE_GLOW_COLOR,
  borderRadius = 16,
}: StandardEffectsPulseProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-pulse-duration' as string]: `${duration}ms`,
    ['--pf-pulse-glow-color' as string]: glowColor,
    ['--pf-pulse-border-radius' as string]: `${borderRadius}px`,
  } as CSSProperties

  return (
    <div className={styles['pf-pulse']} data-animation-id="standard-effects__pulse" style={style}>
      {children ?? <DemoBox label="Pulse" />}
    </div>
  )
}

export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)
