import homeIcon2 from '@/assets/home-icon2.png'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './UpdateIndicatorsHomeIconDotSweep.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'update-indicators__home-icon-dot-sweep',
  title: 'Home Icon • Comet Sweep',
  description: 'A small comet trail sweeps a short arc around the corner dot, staging attention without noise.',
  tags: ['framer']
}

export function UpdateIndicatorsHomeIconDotSweep() {
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
        data-animation-id="update-indicators__home-icon-dot-sweep"
      >
        <div className="pf-update-indicator__icon-wrap">
          <img className="pf-update-indicator__img" src={homeIcon2} alt="Home" />
          <span className="pf-update-indicator__dot pf-update-indicator__dot--fill" />
          <span className="pf-update-indicator__halo" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-sweep"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon2} alt="Home" />
        <motion.span
          key={`${key}-dot`}
          className="pf-update-indicator__dot pf-update-indicator__dot--fill"
          animate={{
            background: ['#ff4967', '#ff0a4d', '#ff4967'],
            scale: [1, 1.16, 1],
            boxShadow: [
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 10px rgba(255, 73, 103, 0.22)',
              '0 0 0 0 rgba(255, 73, 103, 0)'
            ]
          }}
          transition={{
            duration: 0.9,
            ease: 'easeInOut',
            times: [0, 0.3, 1]
          }}
        />
        <motion.span
          key={`${key}-halo`}
          className="pf-update-indicator__halo"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{
            scale: [0.75, 1.8],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 0.9,
            ease: 'easeInOut',
            times: [0, 0.35, 1]
          }}
        />
      </div>
    </div>
  )
}
