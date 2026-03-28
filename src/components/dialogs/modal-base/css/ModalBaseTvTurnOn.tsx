/**
 * Modal entrance — CRT TV power-on effect. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseTvTurnOn.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import './ModalBaseTvTurnOn.css'

const DEFAULT_DURATION = 650

function ModalBaseTvTurnOnComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__tv-turn-on">
      <div
        className={`pf-modal-tv-on${className ? ` ${className}` : ''}`}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return
          onAnimationComplete?.()
        }}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseTvTurnOn = memo(ModalBaseTvTurnOnComponent)
