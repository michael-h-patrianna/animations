/**
 * Swing effect — wraps any React element with a pendulum swing animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsSwing duration={1000}><YourContent /></StandardEffectsSwing>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'

interface StandardEffectsSwingProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 1000 */
  duration?: number
}

function StandardEffectsSwingComponent({
  children,
  duration = 1000,
}: StandardEffectsSwingProps) {
  return (
    <m.div
      data-animation-id="standard-effects__swing"
      style={{ transformOrigin: 'center top', animation: 'none' }}
      animate={{
        rotate: [0, 15, -10, 5, -2, 0],
        x: [0, 2, -1.5, 1, -0.5, 0],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1] as const,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }}
    >
      {children ?? (
        <div className="pf-standard-demo__element">
          <span className="pf-standard-demo__label">Swing</span>
        </div>
      )}
    </m.div>
  )
}

export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)
