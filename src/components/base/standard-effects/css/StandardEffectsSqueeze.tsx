/**
 * Catalog display for the Squeeze CSS effect.
 * Consumer product: StandardEffectsSqueeze.css — apply .pf-squeeze to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsSqueeze.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSqueezeProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsSqueezeComponent({
  children,
  duration = 900,
}: StandardEffectsSqueezeProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-squeeze-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-squeeze" data-animation-id="standard-effects__squeeze" style={style}>
      {children ?? <DemoBox label="Squeeze" />}
    </div>
  )
}

export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)
