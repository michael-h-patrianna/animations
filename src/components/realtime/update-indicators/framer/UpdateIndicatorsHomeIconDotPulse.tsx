import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 *
 */
import { homeIcon1 } from '@/assets'
/**
 *
 */
export function UpdateIndicatorsHomeIconDotPulse() {
  const [key, setKey] = useState(0)
useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-pulse"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
        <m.span
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
