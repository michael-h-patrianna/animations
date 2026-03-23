/**
 * Modal entrance — portal swirl with 720deg rotation, scale from zero, and morphing border-radius.
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

function ModalBasePortalSwirlComponent({
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
      transition={{
        duration: prefersReducedMotion ? 0.01 : durationS,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={
        { ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties
      }
      data-animation-id="modal-base__portal-swirl"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { rotate: 720, scale: 0, opacity: 0, borderRadius: '50%' }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { rotate: 0, scale: 1, opacity: 1, borderRadius: '12px' }
          }
          transition={{
            duration: prefersReducedMotion ? 0.01 : durationS,
            ease: [0.25, 0.46, 0.45, 0.94],
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

export const ModalBasePortalSwirl = memo(ModalBasePortalSwirlComponent)
