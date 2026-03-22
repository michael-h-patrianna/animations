/**
 * Modal entrance — portal swirl with 720deg rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBasePortalSwirl.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBasePortalSwirl.css'

const DEFAULT_DURATION = 800

function ModalBasePortalSwirlComponent({
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
    <div className="pf-modal-portal" style={cssVars} data-animation-id="modal-base__portal-swirl">
      <div className={`pf-modal-portal__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBasePortalSwirl = memo(ModalBasePortalSwirlComponent)
