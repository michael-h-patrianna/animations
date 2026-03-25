/**
 * Catalog display for the Shake CSS effect.
 * Consumer product: StandardEffectsShake.css — apply .pf-shake to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsShake.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsShakeProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsShakeComponent({ children, duration = 500 }: StandardEffectsShakeProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-shake-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-shake" data-animation-id="standard-effects__shake" style={style}>
      {children ?? <DemoBox label="Shake" />}
    </div>
  )
}

export const StandardEffectsShake = memo(StandardEffectsShakeComponent)
