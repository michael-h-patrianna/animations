/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Modal entrance — gentle scale pop from 85% with fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseScaleGentlePop.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts + @/utils/useCssReducedMotionCallback.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseScaleGentlePop.module.css'

const DEFAULT_DURATION = 420

function ModalBaseScaleGentlePopComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  return (
    <div data-animation-id="modal-base__scale-gentle-pop">
      <div
        ref={containerRef}
        className={`${styles['pf-modal-scale-pop']}${className ? ` ${className}` : ''}`}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) {
            return
          }

          onAnimationComplete?.()
        }}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseScaleGentlePop = memo(ModalBaseScaleGentlePopComponent)
