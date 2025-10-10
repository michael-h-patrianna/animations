import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './UpdateIndicatorsBadgePop.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'update-indicators__badge-pop',
  title: 'Badge Pop',
  description: 'Notification badge pops in with quick overshoot.',
  tags: ['framer']
}

export function UpdateIndicatorsBadgePop() {
  const [key, setKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (shouldReduceMotion) {
    return (
      <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
        <div className="pf-update-indicator__icon"></div>
        <div className="pf-update-indicator__copy">Content update arrived</div>
        <div className="pf-update-indicator__badge">New</div>
      </div>
    )
  }

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
      <div className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <motion.div
        key={key}
        className="pf-update-indicator__badge"
        initial={{ scale: 0.6 }}
        animate={{ scale: [0.6, 1.1, 1] }}
        transition={{
          duration: 0.4,
          ease: [0.34, 1.25, 0.64, 1],
          times: [0, 0.6, 1]
        }}
      >
        New
      </motion.div>
    </div>
  )
}
