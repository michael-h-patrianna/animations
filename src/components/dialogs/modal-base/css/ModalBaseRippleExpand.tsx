/**
 * Modal entrance — ripple expand from zero with scale overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseRippleExpand.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import './ModalBaseRippleExpand.css'

const DEFAULT_DURATION = 550

function ModalBaseRippleExpandComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__ripple-expand">
      <div
        className={`pf-modal-ripple${className ? ` ${className}` : ''}`}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseRippleExpand = memo(ModalBaseRippleExpandComponent)
