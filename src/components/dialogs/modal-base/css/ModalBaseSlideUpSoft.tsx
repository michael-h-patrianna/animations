/**
 * Modal entrance — slides up from below with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideUpSoft.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseSlideUpSoft.module.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 64

interface ModalBaseSlideUpSoftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideUpSoftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideUpSoftProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div data-animation-id="modal-base__slide-up-soft">
      <div
        ref={containerRef}
        className={`${styles['pf-modal-slide-up']}${className ? ` ${className}` : ''}`}
        style={{ ...style, ...cssVars }}
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

export const ModalBaseSlideUpSoft = memo(ModalBaseSlideUpSoftComponent)
