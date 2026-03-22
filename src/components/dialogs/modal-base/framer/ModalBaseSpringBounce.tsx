/**
 * Modal entrance — spring-physics bounce with overshoot settle.
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

const DEFAULT_STIFFNESS = 280
const DEFAULT_DAMPING = 20
const DEFAULT_MASS = 0.8

interface ModalBaseSpringBounceProps extends ModalEntranceProps {
  /** Spring stiffness — higher = snappier. Default: 280. */
  stiffness?: number
  /** Spring damping — higher = less oscillation. Default: 20. */
  damping?: number
  /** Spring mass — higher = more inertia. Default: 0.8. */
  mass?: number
}

function ModalBaseSpringBounceComponent({
  children,
  stiffness = DEFAULT_STIFFNESS,
  damping = DEFAULT_DAMPING,
  mass = DEFAULT_MASS,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSpringBounceProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ ...style, '--overlay-opacity': overlayOpacity, animation: 'none' } as React.CSSProperties}
      data-animation-id="modal-base__spring-bounce"
    >
      <div className="pf-modal-center">
        <m.div
          className={className}
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0, y: -30 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : { type: 'spring', stiffness, damping, mass }
          }
          onAnimationComplete={onAnimationComplete}
          style={{ animation: 'none' }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </m.div>
  )
}

export const ModalBaseSpringBounce = memo(ModalBaseSpringBounceComponent)
