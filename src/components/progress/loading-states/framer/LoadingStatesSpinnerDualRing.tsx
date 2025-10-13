
import { motion } from 'framer-motion'
import './LoadingStatesSpinnerDualRing.css'
import '../shared.css'

export function LoadingStatesSpinnerDualRing() {
  return (
    <div data-animation-id="loading-states__spinner-dual-ring" className="pf-loading-container">
      <div className="pf-spinner-dual-ring">
        <motion.span className="pf-spinner-dual-ring__outer" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const }} />
        <motion.span className="pf-spinner-dual-ring__inner" animate={{ rotate: -360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }} />
      </div>
    </div>
  )
}


