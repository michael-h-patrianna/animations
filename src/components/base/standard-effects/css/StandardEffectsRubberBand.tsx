/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Rubber Band CSS effect.
 * Consumer product: StandardEffectsRubberBand.module.css — import styles and apply styles['pf-rubber-band'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsRubberBand.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsRubberBandProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsRubberBandComponent({
  children,
  duration = 1000,
}: StandardEffectsRubberBandProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-rubber-band-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div
      className={styles['pf-rubber-band']}
      data-animation-id="standard-effects__rubber-band"
      style={style}
    >
      {children ?? <DemoBox label="Rubber Band" />}
    </div>
  )
}

export const StandardEffectsRubberBand = memo(StandardEffectsRubberBandComponent)
