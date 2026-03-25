/**
 * Modal entrance — 3D card flip from 180deg with scale-up. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseFlip3d.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import './ModalBaseFlip3d.css'

const DEFAULT_DURATION = 800
const DEFAULT_PERSPECTIVE = 1200

interface ModalBaseFlip3dProps extends ModalEntranceProps {
  perspective?: number
}

function ModalBaseFlip3dComponent({
  children,
  duration = DEFAULT_DURATION,
  perspective = DEFAULT_PERSPECTIVE,
  className,
  style,
}: ModalBaseFlip3dProps) {
  return (
    <div
      data-animation-id="modal-base__flip-3d"
      style={{ '--pf-entrance-duration': `${duration}ms`, perspective } as React.CSSProperties}
    >
      <div className={`pf-modal-flip-3d${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseFlip3d = memo(ModalBaseFlip3dComponent)
