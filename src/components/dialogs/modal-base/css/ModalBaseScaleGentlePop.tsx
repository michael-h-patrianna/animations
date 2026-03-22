/**
 * Modal entrance — gentle scale pop from 85% with fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseScaleGentlePop.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseScaleGentlePop.css'

const DEFAULT_DURATION = 420

function ModalBaseScaleGentlePopComponent({
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
      className="pf-modal-scale-pop"
      style={cssVars}
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className={`pf-modal-scale-pop__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseScaleGentlePop = memo(ModalBaseScaleGentlePopComponent)
