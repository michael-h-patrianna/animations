
import * as m from 'motion/react-m'

import './LoadingStatesSpinnerOrbital.css'
import '../shared.css'

export function LoadingStatesSpinnerOrbital() {
  return (
    <div data-animation-id="loading-states__spinner-orbital" className="pf-loading-container">
      <div className="pf-spinner-orbital">
        <m.span className="pf-spinner-orbital__satellite" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' as const }} />
        <m.span className="pf-spinner-orbital__ring" animate={{ rotate: -360, opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const }} />
      </div>
    </div>
  )
}

