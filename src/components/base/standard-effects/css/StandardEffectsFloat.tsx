/**
 * Catalog display for the Float CSS effect.
 * Consumer product: StandardEffectsFloat.module.css — import styles and apply styles['pf-float'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsFloat.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFloatProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsFloatComponent({ children, duration = 6000 }: StandardEffectsFloatProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-float-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-float']} data-animation-id="standard-effects__float" style={style}>
      {children ?? <DemoBox label="Float" />}
    </div>
  )
}

export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)
