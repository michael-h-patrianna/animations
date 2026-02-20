import * as m from 'motion/react-m'

import { useEffect, useState } from 'react'

/**
 *
 */
import { homeIcon2 } from '@/assets'
/**
 *
 */
export function UpdateIndicatorsHomeIconDotBounce() {
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
      data-animation-id="update-indicators__home-icon-dot-bounce"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon2} alt="Home" />
        <m.span
          key={key}
          className="pf-update-indicator__dot pf-update-indicator__dot--bounce"
          initial={{ scale: 0, opacity: 0, x: 4, y: -4 }}
          animate={{
            scale: [0, 1.2, 1, 1, 1.06, 1],
            opacity: [0, 1, 1, 1, 1, 1],
            x: [4, 0, 0, 0, 0, 0],
            y: [-4, 0, 0, 0, 0, 0],
            boxShadow: [
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 6px rgba(255, 73, 103, 0.18)',
              '0 0 0 0 rgba(255, 73, 103, 0)'
            ]
          }}
          transition={{
            duration: 2.42,
            times: [0, 0.174, 0.174, 0.248, 0.661, 1],
            ease: [0.2, 0.9, 0.3, 1.2] as const
          }}
        />
      </div>
    </div>
  )
}
