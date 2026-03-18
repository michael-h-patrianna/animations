import { useEffect, useRef } from 'react'
import { MockContent } from './MockContent'

export function ModalDismissToastRaise() {
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  // Removed unused state

  useEffect(() => {
    const toast = toastRef.current
    const progress = progressRef.current
    if (!toast || !progress) return

    // Set initial state
    toast.style.opacity = '0'
    toast.style.transform = 'translate3d(0, 120%, 0) scale(0.96)'
    progress.style.transform = 'scaleX(1)'

    const entryDuration = 420
    const autoDismissMs = 3600
    const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)))

    // Entrance animation (rises from bottom with overshoot to -8%)
    const enterKeyframes = [
      { transform: 'translate3d(0, 120%, 0) scale(0.96)', opacity: '0' },
      { transform: 'translate3d(0, -8%, 0) scale(1.02)', opacity: '1', offset: 0.7 },
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
    ]

    toast.animate(enterKeyframes, {
      duration: entryDuration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // entrance easing
      fill: 'forwards',
    })

    // Progress bar animation (scaleX from 1 to 0)
    progress.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
      duration: autoDismissMs,
      easing: 'linear',
      fill: 'forwards',
    })

    // Schedule exit animation
    const exitTimer = setTimeout(() => {
      const exitKeyframes = [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
        { transform: 'translate3d(0, 12%, 0) scale(0.98)', opacity: '0.9', offset: 0.5 },
        { transform: 'translate3d(0, -120%, 0) scale(0.9)', opacity: '0' },
      ]

      toast.animate(exitKeyframes, {
        duration: exitDuration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      })
    }, autoDismissMs)

    return () => {
      clearTimeout(exitTimer)
      toast.getAnimations().forEach((anim) => anim.cancel())
      progress.getAnimations().forEach((anim) => anim.cancel())
    }
  }, [])

  return (
    <MockContent
      toastRef={toastRef}
      progressRef={progressRef}
      animationId="modal-dismiss__toast-raise"
    />
  )
}
