import { useEffect, useRef } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './UpdateIndicatorsLivePing.css'

export const metadata: AnimationMetadata = {
  id: 'update-indicators__live-ping',
  title: 'Live Ping',
  description: 'Live indicator ping loop for streams.',
  tags: ['css']
}

export function UpdateIndicatorsLivePing() {
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const startAnimation = () => {
      const icon = iconRef.current
      if (!icon) return

      // Start ping animation
      icon.style.animation = 'update-live-ping 1200ms ease-in-out infinite'

      // Auto-restart
      timeoutId = setTimeout(startAnimation, 4000)
    }

    startAnimation()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__live-ping">
      <div ref={iconRef} className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  )
}
