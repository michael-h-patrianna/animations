/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Modal entrance — drifts in from the right with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideLeftDrift.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts + @/utils/useCssReducedMotionCallback.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseSlideLeftDrift.module.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 68

interface ModalBaseSlideLeftDriftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideLeftDriftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideLeftDriftProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div data-animation-id="modal-base__slide-left-drift">
      <div
        ref={containerRef}
        className={`${styles['pf-modal-slide-left']}${className ? ` ${className}` : ''}`}
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

export const ModalBaseSlideLeftDrift = memo(ModalBaseSlideLeftDriftComponent)
