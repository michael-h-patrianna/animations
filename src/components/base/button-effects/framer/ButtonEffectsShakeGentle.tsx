/**
 * Shake Gentle — wraps any element with a horizontal shake + opacity dim.
 * Communicates insufficient funds, blocked action, or validation error.
 * Plays on mount (catalog replay via key toggle) or on trigger prop edge.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsShakeGentle trigger={hasError}>
 *     <button>Submit</button>
 *   </ButtonEffectsShakeGentle>
 */

import { memo, useState, useEffect, useRef, type ReactNode } from 'react'
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'

interface ButtonEffectsShakeGentleProps {
  children?: ReactNode
  /** Shake duration in ms. Default: 400 */
  duration?: number
  /** Programmatic trigger — animates on false→true edge. Default: undefined (plays on mount) */
  trigger?: boolean
}

function ButtonEffectsShakeGentleComponent({
  children,
  duration = 400,
  trigger,
}: ButtonEffectsShakeGentleProps) {
  const [isAnimating, setIsAnimating] = useState(trigger === undefined)
  const prefersReducedMotion = useReducedMotion()
  const prevTriggerRef = useRef(trigger)

  const durationS = duration / 1000

  useEffect(() => {
    if (trigger === undefined) return
    if (trigger && !prevTriggerRef.current) {
      setIsAnimating(true)
    }
    prevTriggerRef.current = trigger
  }, [trigger])

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  return (
    <m.button
      type="button"
      className="pf-demo-btn pf-demo-btn--primary"
      data-animation-id="button-effects__shake-gentle"
      initial={{ x: 0, scale: 1, opacity: 1 }}
      animate={
        isAnimating
          ? prefersReducedMotion
            ? { x: [0, -3, 2, -1, 0], opacity: [1, 0.85, 0.9, 0.95, 1] }
            : {
                x: [0, -20, 16, -8, 0],
                scale: [1, 0.98, 0.92, 0.98, 1],
                opacity: [1, 0.7, 0.7, 0.85, 1],
              }
          : { x: 0, scale: 1, opacity: 1 }
      }
      transition={
        prefersReducedMotion
          ? { duration: durationS, times: [0, 0.5, 1], ease: 'easeOut' }
          : {
              duration: durationS,
              times: [0, 0.25, 0.5, 0.75, 1],
              ease: [0.45, 0.05, 0.55, 0.95],
              opacity: {
                duration: durationS,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: [0.4, 0.0, 0.6, 1],
              },
            }
      }
      onAnimationComplete={handleAnimationComplete}
      aria-label="Insufficient funds"
      aria-live="polite"
    >
      {children ?? 'Click Me'}
    </m.button>
  )
}

export const ButtonEffectsShakeGentle = memo(ButtonEffectsShakeGentleComponent)
