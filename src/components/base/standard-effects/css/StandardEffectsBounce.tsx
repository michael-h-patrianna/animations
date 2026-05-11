/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Bounce CSS effect.
 * Consumer product: StandardEffectsBounce.module.css — import styles and apply styles['pf-bounce'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsBounce.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsBounceProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsBounceComponent({ children, duration = 800 }: StandardEffectsBounceProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-bounce-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-bounce']} data-animation-id="standard-effects__bounce" style={style}>
      {children ?? <DemoBox label="Bounce" />}
    </div>
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
