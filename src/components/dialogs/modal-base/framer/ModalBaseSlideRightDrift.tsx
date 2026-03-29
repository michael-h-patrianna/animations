/**
 * Modal entrance — drifts in from the left with subtle scale and fade.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 68

interface ModalBaseSlideRightDriftProps extends ModalEntranceProps {
  /** Distance in pixels the modal drifts from the left. Default: 68. */
  distance?: number
}

function ModalBaseSlideRightDriftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideRightDriftProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__slide-right-drift">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { x: -distance, scale: 0.93, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { x: 0, scale: 1, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : durationS,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        onAnimationComplete={onAnimationComplete}
        style={style}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseSlideRightDrift = memo(ModalBaseSlideRightDriftComponent)
