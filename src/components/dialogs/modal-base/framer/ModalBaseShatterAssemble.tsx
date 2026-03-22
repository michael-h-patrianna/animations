/**
 * Modal entrance — shatter-assemble with jittery rotation and position shifts.
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

const DEFAULT_DURATION = 850

function ModalBaseShatterAssembleComponent({
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
      transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: 'linear' }}
      style={{ ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties}
      data-animation-id="modal-base__shatter-assemble"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={prefersReducedMotion ? { opacity: 0 } : { rotate: 0, x: 0, y: 0, opacity: 0 }}
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
          transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: [0.68, -0.55, 0.265, 1.55] }}
          onAnimationComplete={onAnimationComplete}
          style={{ animation: 'none' }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </m.div>
  )
}

export const ModalBaseShatterAssemble = memo(ModalBaseShatterAssembleComponent)
