/**
 * Catalog display for the Flip CSS effect.
 * Consumer product: StandardEffectsFlip.module.css — import styles and apply styles['pf-flip'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsFlip.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFlipProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsFlipComponent({ children, duration = 800 }: StandardEffectsFlipProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-flip-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className={styles['pf-flip']} data-animation-id="standard-effects__flip" style={style}>
      {children ?? <DemoBox label="Flip" />}
    </div>
  )
}

export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)
