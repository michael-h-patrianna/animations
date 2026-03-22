/**
 * Rubber Band effect — wraps any React element with an elastic stretch animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsRubberBand duration={1000}><YourContent /></StandardEffectsRubberBand>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'

interface StandardEffectsRubberBandProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 1000 */
  duration?: number
}

function StandardEffectsRubberBandComponent({
  children,
  duration = 1000,
}: StandardEffectsRubberBandProps) {
  return (
    <m.div
      data-animation-id="standard-effects__rubber-band"
      style={{ animation: 'none' }}
      animate={{
        scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
        scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1] as const,
        times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
      }}
    >
      {children ?? (
        <div className="pf-standard-demo__element">
          <span className="pf-standard-demo__label">RubberBand</span>
        </div>
      )}
    </m.div>
  )
}

export const StandardEffectsRubberBand = memo(StandardEffectsRubberBandComponent)
