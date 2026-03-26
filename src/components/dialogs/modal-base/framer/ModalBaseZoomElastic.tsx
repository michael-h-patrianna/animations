/**
 * Modal entrance — elastic zoom with multi-bounce overshoot.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 720

function ModalBaseZoomElasticComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__zoom-elastic">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { scale: [0, 1.15, 0.95, 1.05, 1], opacity: [0, 1, 1, 1, 1] }
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

export const ModalBaseZoomElastic = memo(ModalBaseZoomElasticComponent)
