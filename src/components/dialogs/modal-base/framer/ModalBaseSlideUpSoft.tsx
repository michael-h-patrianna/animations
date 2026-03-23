/**
 * Modal entrance — slides up from below with subtle scale and fade.
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
const DEFAULT_DISTANCE = 64

interface ModalBaseSlideUpSoftProps extends ModalEntranceProps {
  /** Distance in pixels the modal slides from below. Default: 64. */
  distance?: number
}

function ModalBaseSlideUpSoftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideUpSoftProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : durationS,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={
        { ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties
      }
      data-animation-id="modal-base__slide-up-soft"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={prefersReducedMotion ? { opacity: 0 } : { y: distance, scale: 0.92, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : durationS,
            ease: [0.22, 0.61, 0.36, 1],
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

export const ModalBaseSlideUpSoft = memo(ModalBaseSlideUpSoftComponent)
