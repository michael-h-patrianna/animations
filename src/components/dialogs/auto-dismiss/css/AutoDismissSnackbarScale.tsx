/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Auto-dismiss wrapper — bouncy scale-in, subtle pulse during visible, scale-down exit. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <AutoDismissSnackbarScale duration={5000} onDismiss={remove}><YourSnackbar /></AutoDismissSnackbarScale>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/auto-dismiss/SharedToastPlaceholder'
import type { AutoDismissProps } from '@/components/dialogs/auto-dismiss/SharedTypes'

const DEFAULT_DURATION = 4000

function AutoDismissSnackbarScaleComponent({
  children,
  duration = DEFAULT_DURATION,
  onDismiss,
  className,
  style,
}: AutoDismissProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const el = wrapperRef.current
    if (el === null) return

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      el.closest("[data-reduced-motion='reduce']") !== null

    if (reducedMotion) {
      el.animate(
        [
          { opacity: '0', transform: 'none' },
          { opacity: '1', transform: 'none' },
        ],
        {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
      const exitTimer = setTimeout(() => {
        const exitAnim = el.animate(
          [
            { opacity: '1', transform: 'none' },
            { opacity: '0', transform: 'none' },
          ],
          { duration: 250, easing: 'ease-in', fill: 'forwards' }
        )
        exitAnim.onfinish = () => onDismissRef.current?.()
      }, duration)
      return () => {
        clearTimeout(exitTimer)
        el.getAnimations().forEach((a) => a.cancel())
      }
    }

    const entryEasing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    const pulseEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    // Entry: bouncy scale-in
    el.animate(
      [
        { transform: 'translate3d(0, 16px, 0) scale(0.84)', opacity: '0' },
        { transform: 'translate3d(0, -6px, 0) scale(1.08)', opacity: '1', offset: 0.6 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: 320, easing: entryEasing, fill: 'forwards' }
    )

    // Pulse: slow drift during visible phase
    el.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)', filter: 'brightness(1)', opacity: '1' },
        {
          transform: 'translate3d(0, -4px, 0) scale(1.05)',
          filter: 'brightness(1.12)',
          opacity: '1',
          offset: 0.18,
        },
        {
          transform: 'translate3d(0, 6px, 0) scale(0.96)',
          filter: 'brightness(0.95)',
          opacity: '0.92',
          offset: 0.55,
        },
        {
          transform: 'translate3d(0, 12px, 0) scale(0.9)',
          filter: 'brightness(0.88)',
          opacity: '0.85',
        },
      ],
      { duration, delay: 320, easing: pulseEasing, fill: 'forwards' }
    )

    // Exit after timeout
    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(0, 6px, 0) scale(0.92)', opacity: '0.4', offset: 0.6 },
          { transform: 'translate3d(0, 16px, 0) scale(0.8)', opacity: '0' },
        ],
        { duration: 240, easing: entryEasing, fill: 'forwards' }
      )
      exitAnim.onfinish = () => onDismissRef.current?.()
    }, duration)

    return () => {
      clearTimeout(exitTimer)
      el.getAnimations().forEach((a) => a.cancel())
    }
  }, [duration])

  return (
    <div
      data-animation-id="auto-dismiss__snackbar-scale"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(0, 16px, 0) scale(0.84)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const AutoDismissSnackbarScale = memo(AutoDismissSnackbarScaleComponent)
