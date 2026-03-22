/**
 * Modal entrance — ripple expand from zero with scale overshoot settle.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'

const DEFAULT_DURATION = 550

function ModalBaseRippleExpandComponent({
  children,
  duration = DEFAULT_DURATION,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties}
      data-animation-id="modal-base__ripple-expand"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { scale: [0, 1.05, 0.98, 1], opacity: [0, 0.8, 1, 1] }
          }
          transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: [0.25, 0.46, 0.45, 0.94] }}
          onAnimationComplete={onAnimationComplete}
          style={{ animation: 'none' }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </m.div>
  )
}

export const ModalBaseRippleExpand = memo(ModalBaseRippleExpandComponent)
