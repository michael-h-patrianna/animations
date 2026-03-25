/**
 * Catalog display for the Flip CSS effect.
 * Consumer product: StandardEffectsFlip.css — apply .pf-flip to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsFlip.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFlipProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsFlipComponent({
  children,
  duration = 800,
}: StandardEffectsFlipProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-flip-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-flip" data-animation-id="standard-effects__flip" style={style}>
      {children ?? <DemoBox label="Flip" />}
    </div>
  )
}

export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)
