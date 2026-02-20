
import * as m from 'motion/react-m'

import './LoadingStatesDotsPortal.css'
import '../shared.css'

export function LoadingStatesDotsPortal() {
  return (
    <div data-animation-id="loading-states__dots-portal" className="pf-loading-container">
      <div className="pf-dots pf-dots-portal">
        <m.span animate={{ x: [-20, 0, -20], scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as const, repeat: Infinity }} />
        <m.span animate={{ scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as const, repeat: Infinity }} />
        <m.span animate={{ x: [20, 0, 20], scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as const, repeat: Infinity }} />
      </div>
    </div>
  )
}

