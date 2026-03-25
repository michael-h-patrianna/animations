/**
 * Catalog display for the Tada CSS effect.
 * Consumer product: StandardEffectsTada.css — apply .pf-tada to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsTada.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsTadaProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsTadaComponent({
  children,
  duration = 1000,
}: StandardEffectsTadaProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-tada-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-tada" data-animation-id="standard-effects__tada" style={style}>
      {children ?? <DemoBox label="Tada" />}
    </div>
  )
}

export const StandardEffectsTada = memo(StandardEffectsTadaComponent)
