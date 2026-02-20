
import * as m from 'motion/react-m'

/**
 *
 */
export function LoadingStatesDotsRise() {
  return (
    <div data-animation-id="loading-states__dots-rise" className="pf-loading-container">
      <div className="pf-dots pf-dots-rise">
        {[0, 1, 2].map(i => (
          <m.span key={i} animate={{ y: [0, -16, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  )
}

