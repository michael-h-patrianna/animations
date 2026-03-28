/**
 * Catalog display for the Pop CSS effect.
 * Consumer product: StandardEffectsPop.module.css — import styles and apply styles['pf-pop'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsPop.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsPopProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsPopComponent({ children, duration = 500 }: StandardEffectsPopProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-pop-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-pop']} data-animation-id="standard-effects__pop" style={style}>
      {children ?? <DemoBox label="Pop" />}
    </div>
  )
}

export const StandardEffectsPop = memo(StandardEffectsPopComponent)
