/**
 * Catalog display for the Jello CSS effect.
 * Consumer product: StandardEffectsJello.css — apply .pf-jello to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsJello.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsJelloProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsJelloComponent({ children, duration = 1000 }: StandardEffectsJelloProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-jello-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-jello" data-animation-id="standard-effects__jello" style={style}>
      {children ?? <DemoBox label="Jello" />}
    </div>
  )
}

export const StandardEffectsJello = memo(StandardEffectsJelloComponent)
