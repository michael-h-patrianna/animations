import homeIcon2 from '@/assets/home-icon2.png'
import { useEffect, useRef } from 'react'
import './UpdateIndicatorsHomeIconDotSweep.css'

export function UpdateIndicatorsHomeIconDotSweep() {
  const dotRef = useRef<HTMLSpanElement>(null)
  const haloRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const run = () => {
      const dot = dotRef.current
      const halo = haloRef.current
      if (dot) {
        dot.style.animation = 'none'
        void dot.offsetHeight
        dot.style.animation = 'pf-ui-dot-fill 900ms ease'
      }
      if (halo) {
        halo.style.animation = 'none'
        void halo.offsetHeight
        halo.style.animation = 'pf-ui-dot-halo 900ms ease'
      }
    }
    run()
    const interval = setInterval(run, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-sweep"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon2} alt="Home" />
        <span ref={dotRef} className="pf-update-indicator__dot pf-update-indicator__dot--fill" />
        <span ref={haloRef} className="pf-update-indicator__halo" />
      </div>
    </div>
  )
}
