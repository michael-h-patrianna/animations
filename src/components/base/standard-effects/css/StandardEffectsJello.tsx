/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Jello CSS effect.
 * Consumer product: StandardEffectsJello.module.css — import styles and apply styles['pf-jello'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsJello.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsJelloProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsJelloComponent({ children, duration = 1000 }: StandardEffectsJelloProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-jello-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-jello']} data-animation-id="standard-effects__jello" style={style}>
      {children ?? <DemoBox label="Jello" />}
    </div>
  )
}

export const StandardEffectsJello = memo(StandardEffectsJelloComponent)
