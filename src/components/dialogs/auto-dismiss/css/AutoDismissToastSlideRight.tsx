/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Auto-dismiss wrapper — content slides in from the right, exits right after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <AutoDismissToastSlideRight duration={5000} onDismiss={remove}><YourToast /></AutoDismissToastSlideRight>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/auto-dismiss/SharedToastPlaceholder'
import type { AutoDismissProps } from '@/components/dialogs/auto-dismiss/SharedTypes'

const DEFAULT_DURATION = 3800

function AutoDismissToastSlideRightComponent({
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
    const easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

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

    el.animate(
      [
        { transform: 'translate3d(140%, 0, 0) scale(0.96)', opacity: '0' },
        { transform: 'translate3d(-6%, 0, 0) scale(1.02)', opacity: '1', offset: 0.7 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: 320, easing, fill: 'forwards' }
    )

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(6%, 0, 0) scale(1.0)', opacity: '0.92', offset: 0.35 },
          { transform: 'translate3d(160%, 0, 0) scale(0.94)', opacity: '0' },
        ],
        { duration: 240, easing, fill: 'forwards' }
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
      data-animation-id="auto-dismiss__toast-slide-right"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(140%, 0, 0) scale(0.96)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const AutoDismissToastSlideRight = memo(AutoDismissToastSlideRightComponent)
