/**
 * Modal entrance — CRT TV power-on effect: horizontal line expands vertically.
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

const DEFAULT_DURATION = 650

function ModalBaseTvTurnOnComponent({
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
      transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties}
      data-animation-id="modal-base__tv-turn-on"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={prefersReducedMotion ? { opacity: 0 } : { scaleX: 2, scaleY: 0, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { scaleX: 1, scaleY: 1, opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: [0.34, 1.56, 0.64, 1] }}
          onAnimationComplete={onAnimationComplete}
          style={{ animation: 'none' }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </m.div>
  )
}

export const ModalBaseTvTurnOn = memo(ModalBaseTvTurnOnComponent)
