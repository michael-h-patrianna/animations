/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Shake CSS effect.
 * Consumer product: StandardEffectsShake.module.css — import styles and apply styles['pf-shake'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsShake.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsShakeProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsShakeComponent({ children, duration = 500 }: StandardEffectsShakeProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-shake-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-shake']} data-animation-id="standard-effects__shake" style={style}>
      {children ?? <DemoBox label="Shake" />}
    </div>
  )
}

export const StandardEffectsShake = memo(StandardEffectsShakeComponent)
