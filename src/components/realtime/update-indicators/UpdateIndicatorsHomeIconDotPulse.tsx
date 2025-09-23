import homeIcon1 from '@/assets/home-icon1.png'
import { useEffect, useRef } from 'react'
import './UpdateIndicatorsHomeIconDotPulse.css'

export function UpdateIndicatorsHomeIconDotPulse() {
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {

    const run = () => {
      const el = dotRef.current
      if (!el) return
      // reset and retrigger keyframes
      el.style.animation = 'none'
      // force reflow
      void el.offsetHeight
      el.style.animation = 'pf-ui-dot-pulse 1400ms ease-in-out'
    }

    // initial run, then every 10s
    run()
    const interval = setInterval(run, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-pulse"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
        <span ref={dotRef} className="pf-update-indicator__dot pf-update-indicator__dot--pulse" />
      </div>
    </div>
  )
}
