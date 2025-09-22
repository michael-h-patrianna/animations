import { useEffect, useRef } from 'react'
import { MockContent } from './MockContent'

export function ModalDismissSnackbarScale() {
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  // Removed unused state

  useEffect(() => {
    const toast = toastRef.current
    const progress = progressRef.current
    if (!toast || !progress) return

    // Set initial state
    toast.style.opacity = '0'
    toast.style.transform = 'translate3d(0, 16px, 0) scale(0.84)'
    progress.style.transform = 'scaleX(1)'

    const entryDuration = 320
    const autoDismissMs = 4000
    const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)))

    // Entrance animation (scale with bounce from 0.84 to 1.08 then 1)
    const enterKeyframes = [
      { transform: 'translate3d(0, 16px, 0) scale(0.84)', opacity: '0' },
      { transform: 'translate3d(0, -6px, 0) scale(1.08)', opacity: '1', offset: 0.6 },
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
    ]

    toast.animate(enterKeyframes, {
      duration: entryDuration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // pop easing for bounce effect
      fill: 'forwards',
    })

    // Progress bar animation (scaleX from 1 to 0)
    progress.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
      duration: autoDismissMs,
      easing: 'linear',
      fill: 'forwards',
    })

    // Scale pulse animation during auto-dismiss
    toast.animate(
      [
        { transform: 'translate3d(0,0,0) scale(1)', filter: 'brightness(1)', opacity: '1' },
        {
          transform: 'translate3d(0,-4px,0) scale(1.05)',
          filter: 'brightness(1.12)',
          opacity: '1',
          offset: 0.18,
        },
        {
          transform: 'translate3d(0,6px,0) scale(0.96)',
          filter: 'brightness(0.95)',
          opacity: '0.92',
          offset: 0.55,
        },
        {
          transform: 'translate3d(0,12px,0) scale(0.9)',
          filter: 'brightness(0.88)',
          opacity: '0.85',
        },
      ],
      {
        duration: autoDismissMs,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // gentle easing
        fill: 'forwards',
      }
    )

    // Schedule exit animation
    const exitTimer = setTimeout(() => {
      const exitKeyframes = [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
        { transform: 'translate3d(0, 6px, 0) scale(0.92)', opacity: '0.4', offset: 0.6 },
        { transform: 'translate3d(0, 16px, 0) scale(0.8)', opacity: '0' },
      ]

      toast.animate(exitKeyframes, {
        duration: exitDuration,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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
      animationId="modal-dismiss__snackbar-scale"
    />
  )
}
