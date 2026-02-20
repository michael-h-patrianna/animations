import * as m from 'motion/react-m'

import { useEffect, useState } from 'react'
import './UpdateIndicatorsBadgePop.css'

export function UpdateIndicatorsBadgePop() {
  const [key, setKey] = useState(0)
useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
      <div className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <m.div
        key={key}
        className="pf-update-indicator__badge"
        initial={{ scale: 0.6 }}
        animate={{ scale: [0.6, 1.1, 1] }}
        transition={{
          duration: 0.4,
          ease: [0.34, 1.25, 0.64, 1] as const,
          times: [0, 0.6, 1]
        }}
      >
        New
      </m.div>
    </div>
  )
}
