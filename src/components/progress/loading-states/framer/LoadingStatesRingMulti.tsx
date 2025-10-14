
import * as m from 'motion/react-m'

import './LoadingStatesRingMulti.css'
import '../shared.css'

export function LoadingStatesRingMulti() {
  return (
    <div data-animation-id="loading-states__ring-multi" className="pf-loading-container">
      <div className="pf-ring-multi">
        <m.span
          className="pf-ring-multi__segment"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' as const }}
        />
        <m.span
          className="pf-ring-multi__segment"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' as const }}
        />
        <m.span
          className="pf-ring-multi__segment"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' as const }}
        />
      </div>
    </div>
  )
}
