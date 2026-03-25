/**
 * Modal entrance — origami unfold from rotateX(-180). CSS variant.
 *
 * Copy-paste files: this file + ModalBaseUnfoldOrigami.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
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
  className,
  style,
}: ModalBaseUnfoldOrigamiProps) {
  return (
    <div
      data-animation-id="modal-base__unfold-origami"
      style={{ '--pf-entrance-duration': `${duration}ms`, perspective } as React.CSSProperties}
    >
      <div className={`pf-modal-origami${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseUnfoldOrigami = memo(ModalBaseUnfoldOrigamiComponent)
