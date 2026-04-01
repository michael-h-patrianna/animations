/**
 * Auto-dismiss wrapper — content drops from above, exits downward after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <AutoDismissToastDrop duration={5000} onDismiss={remove}><YourToast /></AutoDismissToastDrop>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/auto-dismiss/SharedToastPlaceholder'
import type { AutoDismissProps } from '@/components/dialogs/auto-dismiss/SharedTypes'

const DEFAULT_DURATION = 3600

function AutoDismissToastDropComponent({
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

    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    el.animate(
      [
        { transform: 'translate3d(0, -120%, 0) scale(0.96)', opacity: '0' },
        { transform: 'translate3d(0, 10%, 0) scale(1.02)', opacity: '1', offset: 0.7 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: 420, easing, fill: 'forwards' }
    )

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(0, -5%, 0) scale(0.97)', opacity: '0.65', offset: 0.2 },
          { transform: 'translate3d(0, 120%, 0) scale(0.82)', opacity: '0' },
        ],
        { duration: 320, easing: 'cubic-bezier(0.45, 0, 0.85, 0.25)', fill: 'forwards' }
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
      data-animation-id="auto-dismiss__toast-drop"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(0, -120%, 0) scale(0.96)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const AutoDismissToastDrop = memo(AutoDismissToastDropComponent)
