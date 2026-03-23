/**
 * Modal entrance — shatter-assemble with jittery rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseShatterAssemble.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseShatterAssemble.css'

const DEFAULT_DURATION = 850

function ModalBaseShatterAssembleComponent({
  children,
  duration = DEFAULT_DURATION,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalEntranceProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-overlay-opacity': overlayOpacity,
  } as React.CSSProperties

  return (
    <div
      className="pf-modal-shatter"
      style={cssVars}
      data-animation-id="modal-base__shatter-assemble"
    >
      <div className={`pf-modal-shatter__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseShatterAssemble = memo(ModalBaseShatterAssembleComponent)
