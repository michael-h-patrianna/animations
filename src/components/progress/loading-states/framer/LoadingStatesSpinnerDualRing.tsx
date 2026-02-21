
import * as m from 'motion/react-m'

/**
 *
 */
export function LoadingStatesSpinnerDualRing() {
  return (
    <div data-animation-id="loading-states__spinner-dual-ring" className="pf-loading-container">
      <div className="pf-spinner-dual-ring">
        <m.span className="pf-spinner-dual-ring__outer" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }} />
        <m.span className="pf-spinner-dual-ring__inner" animate={{ rotate: -360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' as const }} />
      </div>
    </div>
  )
}
