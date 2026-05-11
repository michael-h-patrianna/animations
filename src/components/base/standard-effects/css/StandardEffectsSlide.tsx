/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Slide CSS effect.
 * Consumer product: StandardEffectsSlide.module.css — import styles and apply styles['pf-slide'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsSlide.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSlideProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsSlideComponent({ children, duration = 700 }: StandardEffectsSlideProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-slide-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-slide']} data-animation-id="standard-effects__slide" style={style}>
      {children ?? <DemoBox label="Slide" />}
    </div>
  )
}

export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)
