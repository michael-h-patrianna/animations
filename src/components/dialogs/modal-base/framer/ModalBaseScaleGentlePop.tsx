/**
 * Modal entrance — gentle scale pop from 85% with fade.
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

const DEFAULT_DURATION = 420

function ModalBaseScaleGentlePopComponent({
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
      transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: [0.12, 0.75, 0.4, 1] }}
      style={
        { ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties
      }
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : durationS,
            ease: [0.12, 0.75, 0.4, 1],
          }}
          onAnimationComplete={onAnimationComplete}
          style={{ animation: 'none' }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </m.div>
  )
}

export const ModalBaseScaleGentlePop = memo(ModalBaseScaleGentlePopComponent)
