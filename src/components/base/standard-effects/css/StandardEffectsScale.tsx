/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Scale CSS effect.
 * Consumer product: StandardEffectsScale.module.css — import styles and apply styles['pf-scale'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsScale.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsScaleProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsScaleComponent({ children, duration = 600 }: StandardEffectsScaleProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-scale-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-scale']} data-animation-id="standard-effects__scale" style={style}>
      {children ?? <DemoBox label="Scale" />}
    </div>
  )
}

export const StandardEffectsScale = memo(StandardEffectsScaleComponent)
