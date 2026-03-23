/**
 * Modal entrance — drifts in from the right with subtle scale and fade.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 68

interface ModalBaseSlideLeftDriftProps extends ModalEntranceProps {
  /** Distance in pixels the modal drifts from the right. Default: 68. */
  distance?: number
}

function ModalBaseSlideLeftDriftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideLeftDriftProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__slide-left-drift">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { x: distance, scale: 0.93, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { x: 0, scale: 1, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.01 : durationS,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        onAnimationComplete={onAnimationComplete}
        style={{ ...style, animation: 'none' }}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseSlideLeftDrift = memo(ModalBaseSlideLeftDriftComponent)
