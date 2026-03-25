/**
 * Modal entrance — digital glitch with RGB channel separation ghost layers.
 * The ghost layers create a chromatic aberration effect behind the content.
 *
 * Copy-paste files: this file + ModalBaseGlitchDigital.css + SharedTypes.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'

const DEFAULT_DURATION = 600

interface ModalBaseGlitchDigitalProps extends ModalEntranceProps {
  /** Glitch intensity multiplier (0–1). Controls ghost offset and skew magnitude. Default: 1. */
  intensity?: number
}

const ghostBase: CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  pointerEvents: 'none',
  animation: 'none',
}

function ModalBaseGlitchDigitalComponent({
  children,
  duration = DEFAULT_DURATION,
  intensity = 1,
  className,
  style,
  onAnimationComplete,
}: ModalBaseGlitchDigitalProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  const ghostOffsetGreen = { x: 3 * intensity, y: 2 * intensity }
  const ghostOffsetPink = { x: -2 * intensity, y: -3 * intensity }
  const skewMax = 2 * intensity

  return (
    <div data-animation-id="modal-base__tfx-glitchdigital">
      <div style={{ position: 'relative' }}>
        {/* Green ghost — chromatic aberration layer */}
        {!prefersReducedMotion && (
          <m.div
            style={{ ...ghostBase, background: 'var(--pf-glitch-green)' }}
            initial={{ x: ghostOffsetGreen.x, y: ghostOffsetGreen.y, opacity: 0.4 }}
            animate={{ x: 0, y: 0, opacity: 0 }}
            transition={{ duration: durationS, ease: 'easeInOut', delay: 0.05 }}
            aria-hidden="true"
          />
        )}
        {/* Pink ghost — chromatic aberration layer */}
        {!prefersReducedMotion && (
          <m.div
            style={{ ...ghostBase, background: 'var(--pf-glitch-pink)' }}
            initial={{ x: ghostOffsetPink.x, y: ghostOffsetPink.y, opacity: 0.3 }}
            animate={{ x: 0, y: 0, opacity: 0 }}
            transition={{ duration: durationS, ease: 'easeInOut', delay: 0.1 }}
            aria-hidden="true"
          />
        )}
        {/* Main content with glitch skew */}
        <m.div
          className={className}
          initial={{ opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : {
                  skewX: [0, skewMax, -skewMax, skewMax * 0.5, 0],
                  opacity: [0, 0.5, 0.8, 0.95, 1],
                }
          }
          transition={{ duration: prefersReducedMotion ? 0.01 : durationS, ease: 'easeInOut' }}
          onAnimationComplete={onAnimationComplete}
          style={{ ...style, position: 'relative', zIndex: 1, animation: 'none' }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </m.div>
      </div>
    </div>
  )
}

export const ModalBaseGlitchDigital = memo(ModalBaseGlitchDigitalComponent)
