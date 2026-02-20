
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import './LoadingStatesSpinnerGalaxy.css'
import '../shared.css'

export function LoadingStatesSpinnerGalaxy() {
  return (
    <div data-animation-id="loading-states__spinner-galaxy" className="pf-loading-container">
      <m.div
        className="pf-spinner-galaxy"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const }}
      >
        <m.span
          className="pf-spinner-galaxy__star pf-spinner-galaxy__star--primary"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: easeInOut }}
        />
        <m.span
          className="pf-spinner-galaxy__star pf-spinner-galaxy__star--secondary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, ease: easeInOut, delay: 0.3 }}
        />
      </m.div>
    </div>
  )
}

