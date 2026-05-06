/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Swing CSS effect.
 * Consumer product: StandardEffectsSwing.module.css — import styles and apply styles['pf-swing'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsSwing.module.css'
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
    <div className={styles['pf-swing']} data-animation-id="standard-effects__swing" style={style}>
      {children ?? <DemoBox label="Swing" />}
    </div>
  )
}

export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)
