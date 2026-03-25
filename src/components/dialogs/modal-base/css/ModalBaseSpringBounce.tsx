/**
 * Modal entrance — spring-physics bounce with overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSpringBounce.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import './ModalBaseSpringBounce.css'

function ModalBaseSpringBounceComponent({ children, className, style }: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__spring-bounce">
      <div className={`pf-modal-spring${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSpringBounce = memo(ModalBaseSpringBounceComponent)
