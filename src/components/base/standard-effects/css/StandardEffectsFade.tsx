/**
 * Catalog display for the Fade CSS effect.
 * Consumer product: StandardEffectsFade.css — apply .pf-fade to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsFade.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFadeProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsFadeComponent({
  children,
  duration = 800,
}: StandardEffectsFadeProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-fade-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-fade" data-animation-id="standard-effects__fade" style={style}>
      {children ?? <DemoBox label="Fade" />}
    </div>
  )
}

export const StandardEffectsFade = memo(StandardEffectsFadeComponent)
