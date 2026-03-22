/**
 * Modal entrance — CRT TV power-on effect. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseTvTurnOn.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseTvTurnOn.css'

const DEFAULT_DURATION = 650

function ModalBaseTvTurnOnComponent({
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
    <div className="pf-modal-tv-on" style={cssVars} data-animation-id="modal-base__tv-turn-on">
      <div className={`pf-modal-tv-on__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseTvTurnOn = memo(ModalBaseTvTurnOnComponent)
