/**
 * Catalog display for the Spin CSS effect.
 * Consumer product: StandardEffectsSpin.css — apply .pf-spin to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsSpin.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSpinProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsSpinComponent({ children, duration = 800 }: StandardEffectsSpinProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-spin-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-spin']} data-animation-id="standard-effects__spin" style={style}>
      {children ?? <DemoBox label="Spin" />}
    </div>
  )
}

export const StandardEffectsSpin = memo(StandardEffectsSpinComponent)
