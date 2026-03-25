/**
 * Catalog display for the Bounce CSS effect.
 * Consumer product: StandardEffectsBounce.css — apply .pf-bounce to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsBounce.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsBounceProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsBounceComponent({ children, duration = 800 }: StandardEffectsBounceProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-bounce-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-bounce" data-animation-id="standard-effects__bounce" style={style}>
      {children ?? <DemoBox label="Bounce" />}
    </div>
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
