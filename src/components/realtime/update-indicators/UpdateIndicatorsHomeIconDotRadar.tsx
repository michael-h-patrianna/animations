import homeIcon1 from '@/assets/home-icon1.png'
import { useEffect, useRef } from 'react'
import './UpdateIndicatorsHomeIconDotRadar.css'

export function UpdateIndicatorsHomeIconDotRadar() {
  const r1Ref = useRef<HTMLSpanElement>(null)
  const r2Ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const run = () => {
      for (const el of [r1Ref.current, r2Ref.current]) {
        if (!el) continue
        el.style.animation = 'none'
        void el.offsetHeight
      }
      if (r1Ref.current) r1Ref.current.style.animation = 'pf-ui-ring-expand 1600ms ease-out'
      if (r2Ref.current)
        r2Ref.current.style.animation = 'pf-ui-ring-expand 1600ms ease-out 800ms'
    }
    run()
    const interval = setInterval(run, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-radar"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon1} alt="Home" />
        <span className="pf-update-indicator__dot pf-update-indicator__dot--radar" />
        <span ref={r1Ref} className="pf-update-indicator__ring pf-update-indicator__ring--1" />
        <span ref={r2Ref} className="pf-update-indicator__ring pf-update-indicator__ring--2" />
      </div>
    </div>
  )
}
