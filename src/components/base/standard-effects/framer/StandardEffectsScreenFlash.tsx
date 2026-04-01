/**
 * Screen Flash / Impact Flash — full-container overlay that fires once on mount.
 * A bright burst that holds briefly at peak opacity, then rapidly fades out.
 * Port to React Native: Moti MotiView with opacity animate + delay.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsScreenFlash color="red"><GameView /></StandardEffectsScreenFlash>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
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
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      data-animation-id="standard-effects__screen-flash"
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children ?? <DemoBox label="Flash" />}
      <m.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          zIndex: 1,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0.05 : duration / 1000,
          delay: prefersReducedMotion ? 0 : peakDuration / 1000,
          ease: [0, 0, 0.2, 1],
        }}
      />
    </div>
  )
}

export const StandardEffectsScreenFlash = memo(StandardEffectsScreenFlashComponent)
