/**
 * Stamp Down / Impact Land — CSS variant.
 * Consumer product: StandardEffectsStampDown.module.css — import styles and apply styles['pf-stamp-down'].
 *
 * Copy-paste files: this file + StandardEffectsStampDown.module.css
 * Runtime deps: react
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsStampDown.module.css'
import { DemoBox } from '@/components/demo-blocks'
import { STAMP_DOWN_RING_COLOR } from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsStampDownProps {
  children?: ReactNode
  /** Total animation duration in ms. Default: 350 */
  duration?: number
  /** Initial oversized scale before slam. Default: 2.0 */
  startScale?: number
  /** Subtle tilt on impact in degrees. Default: 2 */
  impactRotation?: number
  /** Show expanding ring on impact. Default: false */
  showImpactRing?: boolean
  /** Impact ring color. Default: rgba(255, 255, 255, 0.3) */
  ringColor?: string
}

function StandardEffectsStampDownComponent({
  children,
  duration = 350,
  startScale = 2.0,
  impactRotation = 2,
  showImpactRing = false,
  ringColor = STAMP_DOWN_RING_COLOR,
}: StandardEffectsStampDownProps) {
  const style = {
    ['--pf-stamp-down-duration' as string]: `${duration}ms`,
    ['--pf-stamp-down-start-scale' as string]: String(startScale),
    ['--pf-stamp-down-rotation' as string]: `${impactRotation}deg`,
    ['--pf-stamp-down-ring-color' as string]: ringColor,
  } as CSSProperties

  return (
    <div
      className={styles['pf-stamp-down']}
      data-animation-id="standard-effects__stamp-down"
      style={style}
    >
      {children ?? <DemoBox label="Stamp" />}

      {showImpactRing && <div className={styles['pf-stamp-down__ring']} aria-hidden="true" />}
    </div>
  )
}

export const StandardEffectsStampDown = memo(StandardEffectsStampDownComponent)
