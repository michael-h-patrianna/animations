import { useEffect, useRef } from 'react'
import './UpdateIndicatorsBadgePop.css'

export function UpdateIndicatorsBadgePop() {
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const startAnimation = () => {
      const badge = badgeRef.current
      if (!badge) return

      // Reset animation
      badge.style.animation = ''
      badge.style.transform = 'scale(0.6)'

      // Trigger reflow
      void badge.offsetHeight

      // Start pop animation
      badge.style.animation = 'update-badge-pop 400ms cubic-bezier(0.34, 1.25, 0.64, 1) forwards'

      // Auto-restart after delay
      timeoutId = setTimeout(startAnimation, 2000)
    }

    // Start animation immediately
    startAnimation()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
      <div className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <div ref={badgeRef} className="pf-update-indicator__badge">
        New
      </div>
    </div>
  )
}
