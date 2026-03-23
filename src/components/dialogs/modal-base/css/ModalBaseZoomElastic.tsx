/**
 * Modal entrance — elastic zoom with multi-bounce overshoot. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseZoomElastic.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import './ModalBaseZoomElastic.css'

const DEFAULT_DURATION = 720

function ModalBaseZoomElasticComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__zoom-elastic">
      <div
        className={`pf-modal-zoom-elastic${className ? ` ${className}` : ''}`}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseZoomElastic = memo(ModalBaseZoomElasticComponent)
