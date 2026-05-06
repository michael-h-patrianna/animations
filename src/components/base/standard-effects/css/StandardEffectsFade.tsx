/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Fade CSS effect.
 * Consumer product: StandardEffectsFade.module.css — import styles and apply styles['pf-fade'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsFade.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFadeProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsFadeComponent({ children, duration = 800 }: StandardEffectsFadeProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-fade-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-fade']} data-animation-id="standard-effects__fade" style={style}>
      {children ?? <DemoBox label="Fade" />}
    </div>
  )
}

export const StandardEffectsFade = memo(StandardEffectsFadeComponent)
