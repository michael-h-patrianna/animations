/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Stamp Down / Impact Land — CSS variant.
 * Consumer product: StandardEffectsStampDown.module.css — import styles and apply styles['pf-stamp-down'].
 *
 * Copy-paste files: this file + StandardEffectsStampDown.module.css
 * Runtime deps: react
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsStampDown.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsStampDownProps {
  children?: ReactNode
  /** Total animation duration in ms. Default: 350 */
  duration?: number
  /** Initial oversized scale before slam. Default: 2.0 */
  startScale?: number
  /** Subtle tilt on impact in degrees. Default: 2 */
  impactRotation?: number
}

function StandardEffectsStampDownComponent({
  children,
  duration = 350,
  startScale = 2.0,
  impactRotation = 2,
}: StandardEffectsStampDownProps) {
  const style = {
    ['--pf-stamp-down-duration' as string]: `${duration}ms`,
    ['--pf-stamp-down-start-scale' as string]: String(startScale),
    ['--pf-stamp-down-rotation' as string]: `${impactRotation}deg`,
  } as CSSProperties

  return (
    <div
      className={styles['pf-stamp-down']}
      data-animation-id="standard-effects__stamp-down"
      style={style}
    >
      {children ?? <DemoBox label="Stamp" />}
    </div>
  )
}

export const StandardEffectsStampDown = memo(StandardEffectsStampDownComponent)
