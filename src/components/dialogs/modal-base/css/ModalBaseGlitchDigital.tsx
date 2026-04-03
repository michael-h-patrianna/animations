/**
 * Modal entrance — digital glitch with RGB channel separation. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseGlitchDigital.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseGlitchDigital.module.css'

const DEFAULT_DURATION = 600

interface ModalBaseGlitchDigitalProps extends ModalEntranceProps {
  /** Glitch intensity multiplier (0-1). Default: 1. */
  intensity?: number
}

function ModalBaseGlitchDigitalComponent({
  children,
  duration = DEFAULT_DURATION,
  intensity = 1,
  className,
  style,
  onAnimationComplete,
}: ModalBaseGlitchDigitalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-glitch-intensity': intensity,
  } as React.CSSProperties

  return (
    <div data-animation-id="modal-base__glitch-digital">
      <div className={styles['pf-modal-glitch']} style={cssVars}>
        <div
          className={`${styles['pf-modal-glitch__ghost']} ${styles['pf-modal-glitch__ghost--green']}`}
          aria-hidden="true"
        />
        <div
          className={`${styles['pf-modal-glitch__ghost']} ${styles['pf-modal-glitch__ghost--pink']}`}
          aria-hidden="true"
        />
        <div
          ref={containerRef}
          className={`${styles['pf-modal-glitch__content']}${className ? ` ${className}` : ''}`}
          style={style}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return
            onAnimationComplete?.()
          }}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </div>
      </div>
    </div>
  )
}

export const ModalBaseGlitchDigital = memo(ModalBaseGlitchDigitalComponent)
