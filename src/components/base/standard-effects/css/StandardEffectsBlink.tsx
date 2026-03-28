/**
 * Catalog display for the Blink CSS effect.
 * Consumer product: StandardEffectsBlink.css — apply .pf-blink to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsBlink.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsBlinkProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsBlinkComponent({ children, duration = 1000 }: StandardEffectsBlinkProps) {
  const style =
    duration !== 1000
      ? ({
          display: 'inline-flex',
          ['--pf-blink-duration' as string]: `${duration}ms`,
        } as CSSProperties)
      : ({ display: 'inline-flex' } as CSSProperties)

  return (
    <div className={styles['pf-blink']} data-animation-id="standard-effects__blink" style={style}>
      {children ?? <DemoBox label="Blink" />}
    </div>
  )
}

export const StandardEffectsBlink = memo(StandardEffectsBlinkComponent)
