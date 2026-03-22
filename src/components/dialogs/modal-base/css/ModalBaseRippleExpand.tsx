/**
 * Modal entrance — ripple expand from zero with scale overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseRippleExpand.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseRippleExpand.css'

const DEFAULT_DURATION = 550

function ModalBaseRippleExpandComponent({
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
    <div className="pf-modal-ripple" style={cssVars} data-animation-id="modal-base__ripple-expand">
      <div className={`pf-modal-ripple__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseRippleExpand = memo(ModalBaseRippleExpandComponent)
