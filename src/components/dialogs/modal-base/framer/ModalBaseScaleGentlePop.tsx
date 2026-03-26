/**
 * Modal entrance — gentle scale pop from 85% with fade.
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

function ModalBaseScaleGentlePopComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__scale-gentle-pop">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : durationS,
          ease: [0.12, 0.75, 0.4, 1],
        }}
        onAnimationComplete={onAnimationComplete}
        style={{ ...style, animation: 'none' }}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseScaleGentlePop = memo(ModalBaseScaleGentlePopComponent)
