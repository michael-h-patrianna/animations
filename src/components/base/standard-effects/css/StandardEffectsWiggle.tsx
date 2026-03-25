/**
 * Catalog display for the Wiggle CSS effect.
 * Consumer product: StandardEffectsWiggle.css — apply .pf-wiggle to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsWiggle.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsWiggleProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsWiggleComponent({ children, duration = 1000 }: StandardEffectsWiggleProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-wiggle-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-wiggle" data-animation-id="standard-effects__wiggle" style={style}>
      {children ?? <DemoBox label="Wiggle" />}
    </div>
  )
}

export const StandardEffectsWiggle = memo(StandardEffectsWiggleComponent)
