/**
 * Modal entrance — ripple expand from zero with scale overshoot settle.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 550

function ModalBaseRippleExpandComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__ripple-expand">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { scale: [0, 1.05, 0.98, 1], opacity: [0, 0.8, 1, 1] }
        }
        transition={{
          duration: prefersReducedMotion ? 0.2 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onAnimationComplete={onAnimationComplete}
        style={style}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseRippleExpand = memo(ModalBaseRippleExpandComponent)
