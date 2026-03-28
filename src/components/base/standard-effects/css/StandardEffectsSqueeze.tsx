/**
 * Catalog display for the Squeeze CSS effect.
 * Consumer product: StandardEffectsSqueeze.module.css — import styles and apply styles['pf-squeeze'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsSqueeze.module.css'
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
    <div
      className={styles['pf-squeeze']}
      data-animation-id="standard-effects__squeeze"
      style={style}
    >
      {children ?? <DemoBox label="Squeeze" />}
    </div>
  )
}

export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)
