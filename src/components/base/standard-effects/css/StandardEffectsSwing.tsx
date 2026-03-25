/**
 * Catalog display for the Swing CSS effect.
 * Consumer product: StandardEffectsSwing.css — apply .pf-swing to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsSwing.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSwingProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsSwingComponent({ children, duration = 1000 }: StandardEffectsSwingProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-swing-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-swing" data-animation-id="standard-effects__swing" style={style}>
      {children ?? <DemoBox label="Swing" />}
    </div>
  )
}

export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)
