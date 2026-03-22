/**
 * Modal entrance — elastic zoom with multi-bounce overshoot. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseZoomElastic.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseZoomElastic.css'

const DEFAULT_DURATION = 720

function ModalBaseZoomElasticComponent({
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
    <div className="pf-modal-zoom-elastic" style={cssVars} data-animation-id="modal-base__zoom-elastic">
      <div className={`pf-modal-zoom-elastic__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseZoomElastic = memo(ModalBaseZoomElasticComponent)
