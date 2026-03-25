/**
 * Modal entrance — slides up from below with subtle scale and fade.
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
const DEFAULT_DISTANCE = 64

interface ModalBaseSlideUpSoftProps extends ModalEntranceProps {
  /** Distance in pixels the modal slides from below. Default: 64. */
  distance?: number
}

function ModalBaseSlideUpSoftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideUpSoftProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__slide-up-soft">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { y: distance, scale: 0.92, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
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

export const ModalBaseSlideUpSoft = memo(ModalBaseSlideUpSoftComponent)
