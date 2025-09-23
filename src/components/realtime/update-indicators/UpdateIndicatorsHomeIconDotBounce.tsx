import homeIcon2 from '@/assets/home-icon2.png'
import { useEffect, useRef } from 'react'
import './UpdateIndicatorsHomeIconDotBounce.css'

export function UpdateIndicatorsHomeIconDotBounce() {
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const run = () => {
      const el = dotRef.current
      if (!el) return
      el.style.animation = 'none'
      void el.offsetHeight
      el.style.animation = 'pf-ui-dot-enter-bounce 420ms cubic-bezier(0.2, 0.9, 0.3, 1.2), pf-ui-dot-idle 2000ms ease-in-out 600ms'
    }
    run()
    const interval = setInterval(run, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="pf-update-indicator pf-update-indicator--icon"
      data-animation-id="update-indicators__home-icon-dot-bounce"
    >
      <div className="pf-update-indicator__icon-wrap">
        <img className="pf-update-indicator__img" src={homeIcon2} alt="Home" />
        <span ref={dotRef} className="pf-update-indicator__dot pf-update-indicator__dot--bounce" />
      </div>
    </div>
  )
}
