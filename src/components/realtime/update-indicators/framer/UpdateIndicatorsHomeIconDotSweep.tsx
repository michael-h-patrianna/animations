import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 *
 */
import { homeIcon2 } from '@/assets'
/**
 *
 */
export function UpdateIndicatorsHomeIconDotSweep() {
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
      data-animation-id="update-indicators__home-icon-dot-sweep"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon2} alt="Home" />
        <m.span
          key={`${key}-dot`}
          className="pf-update-indicator__dot pf-update-indicator__dot--fill"
          animate={{
            background: ['var(--pf-anim-rose)', 'var(--pf-anim-rose-dark)', 'var(--pf-anim-rose)'],
            scale: [1, 1.16, 1],
            boxShadow: [
              '0 0 0 0 rgba(255, 73, 103, 0)',
              '0 0 0 10px rgba(255, 73, 103, 0.22)',
              '0 0 0 0 rgba(255, 73, 103, 0)'
            ]
          }}
          transition={{
            duration: 0.9,
            ease: easeInOut,
            times: [0, 0.3, 1]
          }}
        />
        <m.span
          key={`${key}-halo`}
          className="pf-update-indicator__halo"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{
            scale: [0.75, 1.8],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 0.9,
            ease: easeInOut,
            times: [0, 0.35, 1]
          }}
        />
      </div>
    </div>
  )
}
