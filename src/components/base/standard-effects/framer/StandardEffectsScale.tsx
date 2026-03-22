/**
 * Scale In effect — wraps any React element with a scale entrance animation.
 * Port to React Native: translate initial/animate/transition to Moti MotiView from/animate/transition.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsScale duration={600}><YourContent /></StandardEffectsScale>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'

interface StandardEffectsScaleProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 600 */
  duration?: number
}

function StandardEffectsScaleComponent({
  children,
  duration = 600,
}: StandardEffectsScaleProps) {
  return (
    <m.div
      data-animation-id="standard-effects__scale"
      style={{ animation: 'none' }}
      initial={{ scale: 0, rotate: 0, skewY: 0, opacity: 0 }}
      animate={{
        scale: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1.05, 1.08, 1.05, 1.02, 1],
        rotate: [0, -6, -10, -8, -4, 2, 4, 2, -1, -0.5, 0],
        skewY: [0, 0.8, 1.4, 1, 0.5, -0.5, -0.8, -0.4, 0.2, 0.1, 0],
        opacity: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 0.9, 0.95, 0.98, 1, 1],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }}
    >
      {children ?? (
        <div className="pf-standard-demo__element">
          <span className="pf-standard-demo__label">Scale</span>
        </div>
      )}
    </m.div>
  )
}

export const StandardEffectsScale = memo(StandardEffectsScaleComponent)
