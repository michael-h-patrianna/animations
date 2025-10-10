import homeIcon1 from '@/assets/home-icon1.png'
import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './UpdateIndicatorsHomeIconDotRadar.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'update-indicators__home-icon-dot-radar',
  title: 'Home Icon • Radar Rings',
  description: 'Subtle radar rings emanate from the dot using staggered arcs to signal ongoing freshness.',
  tags: ['framer']
}

export function UpdateIndicatorsHomeIconDotRadar() {
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
        data-animation-id="update-indicators__home-icon-dot-radar"
      >
        <div className="pf-update-indicator__icon-wrap">
          <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
          <span className="pf-update-indicator__dot pf-update-indicator__dot--radar" />
          <span className="pf-update-indicator__ring pf-update-indicator__ring--1" />
          <span className="pf-update-indicator__ring pf-update-indicator__ring--2" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-radar"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
        <span className="pf-update-indicator__dot pf-update-indicator__dot--radar" />
        <motion.span
          key={`${key}-1`}
          className="pf-update-indicator__ring pf-update-indicator__ring--1"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [0.9, 1.9],
            opacity: [0.9, 0.6, 0]
          }}
          transition={{
            duration: 1.6,
            ease: easeOut,
            times: [0, 0.5, 1]
          }}
        />
        <motion.span
          key={`${key}-2`}
          className="pf-update-indicator__ring pf-update-indicator__ring--2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [0.9, 1.9],
            opacity: [0.9, 0.6, 0]
          }}
          transition={{
            duration: 1.6,
            ease: easeOut,
            delay: 0.8,
            times: [0, 0.5, 1]
          }}
        />
      </div>
    </div>
  )
}
