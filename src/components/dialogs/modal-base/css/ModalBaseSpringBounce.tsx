/**
 * Modal entrance — spring-physics bounce with overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSpringBounce.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseSpringBounce.css'

function ModalBaseSpringBounceComponent({
  children,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalEntranceProps) {
  const cssVars = { '--pf-overlay-opacity': overlayOpacity } as React.CSSProperties

  return (
    <div className="pf-modal-spring" style={cssVars} data-animation-id="modal-base__spring-bounce">
      <div className={`pf-modal-spring__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSpringBounce = memo(ModalBaseSpringBounceComponent)
