import homeIcon1 from '@/assets/home-icon1.png'
import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './UpdateIndicatorsHomeIconDotPulse.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'update-indicators__home-icon-dot-pulse',
  title: 'Home Icon • Dot Pulse',
  description: 'Top-right dot with gentle breathing pulse and soft glow ripple to indicate unseen updates.',
  tags: ['framer']
}

export function UpdateIndicatorsHomeIconDotPulse() {
  const [key, setKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  if (shouldReduceMotion) {
    return (
      <div
        className="pf-update-indicator pf-update-indicator--icon"
        data-animation-id="update-indicators__home-icon-dot-pulse"
      >
        <div className="pf-update-indicator__icon-wrap">
          <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
          <span className="pf-update-indicator__dot pf-update-indicator__dot--pulse" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-pulse"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
        <motion.span
          key={key}
          className="pf-update-indicator__dot pf-update-indicator__dot--pulse"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 8px rgba(255, 73, 103, 0.25)',
              '0 0 0 0 rgba(255, 73, 103, 0)'
            ]
          }}
          transition={{
            duration: 1.4,
            ease: easeInOut
          }}
        />
      </div>
    </div>
  )
}
