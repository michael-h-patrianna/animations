/**
 * Modal entrance — digital glitch with RGB channel separation. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseGlitchDigital.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseGlitchDigital.css'

const DEFAULT_DURATION = 600

interface ModalBaseGlitchDigitalProps extends ModalEntranceProps {
  /** Glitch intensity multiplier (0-1). Default: 1. */
  intensity?: number
}

function ModalBaseGlitchDigitalComponent({
  children,
  duration = DEFAULT_DURATION,
  intensity = 1,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalBaseGlitchDigitalProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-overlay-opacity': overlayOpacity,
    '--pf-glitch-intensity': intensity,
  } as React.CSSProperties

  return (
    <div
      className="pf-modal-glitch"
      style={cssVars}
      data-animation-id="modal-base__tfx-glitchdigital"
    >
      <div className="pf-modal-glitch__stage">
        <div className="pf-modal-glitch__ghost pf-modal-glitch__ghost--green" aria-hidden="true" />
        <div className="pf-modal-glitch__ghost pf-modal-glitch__ghost--pink" aria-hidden="true" />
        <div
          className={`pf-modal-glitch__content${className ? ` ${className}` : ''}`}
          style={style}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </div>
      </div>
    </div>
  )
}

export const ModalBaseGlitchDigital = memo(ModalBaseGlitchDigitalComponent)
