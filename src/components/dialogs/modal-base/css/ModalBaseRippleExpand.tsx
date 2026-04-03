/**
 * Modal entrance — ripple expand from zero with scale overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseRippleExpand.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseRippleExpand.module.css'

const DEFAULT_DURATION = 550

function ModalBaseRippleExpandComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  return (
    <div data-animation-id="modal-base__ripple-expand">
      <div
        ref={containerRef}
        className={`${styles['pf-modal-ripple']}${className ? ` ${className}` : ''}`}
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

export const ModalBaseRippleExpand = memo(ModalBaseRippleExpandComponent)
