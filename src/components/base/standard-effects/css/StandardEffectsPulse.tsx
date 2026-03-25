/**
 * Catalog display for the Pulse CSS effect.
 * Consumer product: StandardEffectsPulse.css — apply .pf-pulse to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsPulse.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsPulseProps {
  children?: ReactNode
  duration?: number
  glowColor?: string
  borderRadius?: number
}

function StandardEffectsPulseComponent({
  children,
  duration = 1500,
  glowColor = 'rgb(198 255 119 / 30%)',
  borderRadius = 16,
}: StandardEffectsPulseProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-pulse-duration' as string]: `${duration}ms`,
    ['--pf-pulse-glow-color' as string]: glowColor,
    ['--pf-pulse-border-radius' as string]: `${borderRadius}px`,
  } as CSSProperties

  return (
    <div className="pf-pulse" data-animation-id="standard-effects__pulse" style={style}>
      {children ?? <DemoBox label="Pulse" />}
    </div>
  )
}

export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)
