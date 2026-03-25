/**
 * Auto-dismiss wrapper — soft fade-in with scale, fades out after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <ModalDismissToastFadeProgress duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastFadeProgress>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/modal-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/modal-dismiss/SharedTypes'

const DEFAULT_DURATION = 4600

function ModalDismissToastFadeProgressComponent({
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

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const entryDuration = reducedMotion ? 10 : 420
    const exitDuration = reducedMotion ? 10 : 320
    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    el.animate(
      [
        { transform: 'translate3d(0, 18px, 0) scale(0.94)', opacity: '0' },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: entryDuration, easing, fill: 'forwards' }
    )

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(0, 12px, 0) scale(0.92)', opacity: '0.4', offset: 0.6 },
          { transform: 'translate3d(0, 24px, 0) scale(0.88)', opacity: '0' },
        ],
        { duration: exitDuration, easing, fill: 'forwards' }
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
      data-animation-id="modal-dismiss__toast-fade-progress"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(0, 18px, 0) scale(0.94)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const ModalDismissToastFadeProgress = memo(ModalDismissToastFadeProgressComponent)
