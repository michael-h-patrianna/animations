/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Auto-dismiss wrapper — wipes in from right with slide, wipes out after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <AutoDismissSnackbarWipe duration={5000} onDismiss={remove}><YourSnackbar /></AutoDismissSnackbarWipe>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/auto-dismiss/SharedToastPlaceholder'
import type { AutoDismissProps } from '@/components/dialogs/auto-dismiss/SharedTypes'

const DEFAULT_DURATION = 4200

function AutoDismissSnackbarWipeComponent({
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
    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    if (reducedMotion) {
      el.animate(
        [
          { opacity: '0', transform: 'none', clipPath: 'none' },
          { opacity: '1', transform: 'none', clipPath: 'none' },
        ],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
      )
      const exitTimer = setTimeout(() => {
        const exitAnim = el.animate(
          [
            { opacity: '1', transform: 'none', clipPath: 'none' },
            { opacity: '0', transform: 'none', clipPath: 'none' },
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

    const enterAnim = el.animate(
      [
        {
          transform: 'translate3d(100%, 24px, 0) scale(0.96)',
          opacity: '0',
          clipPath: 'inset(0 0 0 100%)',
        },
        {
          transform: 'translate3d(0, -4px, 0) scale(1.02)',
          opacity: '1',
          clipPath: 'inset(0 0 0 0)',
          offset: 0.7,
        },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1', clipPath: 'inset(0 0 0 0)' },
      ],
      { duration: 420, easing, fill: 'forwards' }
    )

    enterAnim.onfinish = () => {
      el.style.clipPath = 'inset(0 0 0 0)'
    }

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1', clipPath: 'inset(0 0 0 0)' },
          {
            transform: 'translate3d(0, 6px, 0) scale(0.96)',
            opacity: '0.6',
            clipPath: 'inset(0 0 0 0)',
            offset: 0.55,
          },
          {
            transform: 'translate3d(0, 0, 0) scale(0.96)',
            opacity: '0',
            clipPath: 'inset(0 0 0 100%)',
          },
        ],
        { duration: 320, easing, fill: 'forwards' }
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
      data-animation-id="auto-dismiss__snackbar-wipe"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{
          ...style,
          opacity: 0,
          transform: 'translate3d(100%, 24px, 0) scale(0.96)',
          clipPath: 'inset(0 0 0 100%)',
        }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const AutoDismissSnackbarWipe = memo(AutoDismissSnackbarWipeComponent)
