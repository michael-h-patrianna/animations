/**
 * Modal entrance — origami unfold from rotateX(-180) with scale-up.
 *
 * Copy-paste files: this file + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 900
const DEFAULT_PERSPECTIVE = 1200

interface ModalBaseUnfoldOrigamiProps extends ModalEntranceProps {
  /** CSS perspective depth in pixels. Default: 1200. */
  perspective?: number
}

function ModalBaseUnfoldOrigamiComponent({
  children,
  duration = DEFAULT_DURATION,
  perspective = DEFAULT_PERSPECTIVE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseUnfoldOrigamiProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <div data-animation-id="modal-base__unfold-origami" style={{ perspective }}>
      <m.div
        className={className}
        style={{ ...style, transformStyle: 'preserve-3d' }}
        initial={prefersReducedMotion ? { opacity: 0 } : { rotateX: -180, scale: 0, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { rotateX: 0, scale: 1, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onAnimationComplete={onAnimationComplete}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalBaseUnfoldOrigami = memo(ModalBaseUnfoldOrigamiComponent)
