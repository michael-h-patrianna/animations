/**
 * Modal entrance — spring-physics bounce with overshoot settle.
 *
 * Copy-paste files: this file + MockModalContent.tsx + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

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
  className,
  style,
  onAnimationComplete,
}: ModalBaseSpringBounceProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div data-animation-id="modal-base__spring-bounce">
      <m.div
        className={className}
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0, y: -30 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness, damping, mass }
        }
        onAnimationComplete={onAnimationComplete}
        style={style}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseSpringBounce = memo(ModalBaseSpringBounceComponent)
