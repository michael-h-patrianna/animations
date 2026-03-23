/**
 * Modal entrance — origami unfold from rotateX(-180). CSS variant.
 *
 * Copy-paste files: this file + ModalBaseUnfoldOrigami.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseUnfoldOrigami.css'

const DEFAULT_DURATION = 900
const DEFAULT_PERSPECTIVE = 1200

interface ModalBaseUnfoldOrigamiProps extends ModalEntranceProps {
  perspective?: number
}

function ModalBaseUnfoldOrigamiComponent({
  children,
  duration = DEFAULT_DURATION,
  perspective = DEFAULT_PERSPECTIVE,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalBaseUnfoldOrigamiProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-overlay-opacity': overlayOpacity,
    '--pf-perspective': `${perspective}px`,
  } as React.CSSProperties

  return (
    <div
      className="pf-modal-origami"
      style={cssVars}
      data-animation-id="modal-base__unfold-origami"
    >
      <div className="pf-modal-origami__perspective">
        <div
          className={`pf-modal-origami__content${className ? ` ${className}` : ''}`}
          style={style}
        >
          <ModalPlaceholder>{children}</ModalPlaceholder>
        </div>
      </div>
    </div>
  )
}

export const ModalBaseUnfoldOrigami = memo(ModalBaseUnfoldOrigamiComponent)
