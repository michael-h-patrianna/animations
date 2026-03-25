/**
 * Modal entrance — shatter-assemble with jittery rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseShatterAssemble.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import './ModalBaseShatterAssemble.css'

const DEFAULT_DURATION = 850

function ModalBaseShatterAssembleComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__shatter-assemble">
      <div
        className={`pf-modal-shatter${className ? ` ${className}` : ''}`}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseShatterAssemble = memo(ModalBaseShatterAssembleComponent)
