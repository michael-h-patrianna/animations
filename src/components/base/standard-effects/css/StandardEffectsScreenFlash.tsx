/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Screen Flash / Impact Flash — CSS variant.
 * Full-container overlay that fires once on mount with a brief peak hold, then fades.
 *
 * Copy-paste files: this file + StandardEffectsScreenFlash.module.css
 * Runtime deps: react
 *
 * Usage: <StandardEffectsScreenFlash color="red"><GameView /></StandardEffectsScreenFlash>
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsScreenFlash.module.css'
import { DemoBox } from '@/components/demo-blocks'
import { SCREEN_FLASH_COLOR } from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsScreenFlashProps {
  children?: ReactNode
  /** Flash overlay color. Default: 'rgba(255, 255, 255, 0.9)' */
  color?: string
  /** Fade-out duration in ms. Default: 400 */
  duration?: number
  /** How long the flash stays at full opacity before fading, in ms. Default: 80 */
  peakDuration?: number
}

function StandardEffectsScreenFlashComponent({
  children,
  color = SCREEN_FLASH_COLOR,
  duration = 400,
  peakDuration = 80,
}: StandardEffectsScreenFlashProps) {
  const style = {
    ['--pf-flash-color' as string]: color,
    ['--pf-flash-duration' as string]: `${duration}ms`,
    ['--pf-flash-peak-duration' as string]: `${peakDuration}ms`,
  } as CSSProperties

  return (
    <div
      className={styles['pf-screen-flash']}
      data-animation-id="standard-effects__screen-flash"
      style={style}
    >
      {children ?? <DemoBox label="Flash" />}
      <div className={styles['pf-screen-flash__overlay']} aria-hidden="true" />
    </div>
  )
}

export const StandardEffectsScreenFlash = memo(StandardEffectsScreenFlashComponent)
