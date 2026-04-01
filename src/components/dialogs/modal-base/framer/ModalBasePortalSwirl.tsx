/**
 * Modal entrance — portal swirl with 720deg rotation, scale from zero, and morphing border-radius.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 800

function ModalBasePortalSwirlComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__portal-swirl">
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

export const ModalBasePortalSwirl = memo(ModalBasePortalSwirlComponent)
