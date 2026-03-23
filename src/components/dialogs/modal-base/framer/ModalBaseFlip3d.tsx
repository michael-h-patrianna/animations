/**
 * Modal entrance — 3D card flip from 180deg with scale-up.
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

const DEFAULT_DURATION = 800
const DEFAULT_PERSPECTIVE = 1200

interface ModalBaseFlip3dProps extends ModalEntranceProps {
  /** CSS perspective depth in pixels. Default: 1200. */
  perspective?: number
}

function ModalBaseFlip3dComponent({
  children,
  duration = DEFAULT_DURATION,
  perspective = DEFAULT_PERSPECTIVE,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
  onAnimationComplete,
}: ModalBaseFlip3dProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : durationS,
        ease: [0.175, 0.885, 0.32, 1],
      }}
      style={
        { ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties
      }
      data-animation-id="modal-base__flip-3d"
    >
      <div className="pf-modal-center" style={{ perspective }}>
        <m.div
          className={className}
          style={{ transformStyle: 'preserve-3d', animation: 'none' }}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { rotateY: 180, scale: 0.65, opacity: 0 }
          }
          animate={prefersReducedMotion ? { opacity: 1 } : { rotateY: 0, scale: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : durationS,
            ease: [0.175, 0.885, 0.32, 1],
          }}
          onAnimationComplete={onAnimationComplete}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </m.div>
  )
}

export const ModalBaseFlip3d = memo(ModalBaseFlip3dComponent)
