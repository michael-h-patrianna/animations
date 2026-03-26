/**
 * Modal entrance — shatter-assemble with jittery rotation and position shifts.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 850

function ModalBaseShatterAssembleComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__shatter-assemble">
      <m.div
        className={className}
        initial={{ opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : {
                rotate: [0, 5, -5, 2, 0],
                x: [0, -5, 5, -2, 0],
                y: [0, -5, -5, -2, 0],
                opacity: [0, 0.3, 0.6, 0.9, 1],
              }
        }
        transition={{
          duration: prefersReducedMotion ? 0.2 : durationS,
          ease: [0.68, -0.55, 0.265, 1.55],
        }}
        onAnimationComplete={onAnimationComplete}
        style={{ ...style, animation: 'none' }}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseShatterAssemble = memo(ModalBaseShatterAssembleComponent)
