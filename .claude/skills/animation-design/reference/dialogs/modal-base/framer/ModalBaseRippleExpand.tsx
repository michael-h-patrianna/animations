import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseRippleExpand() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__ripple-expand"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.05, 0.98, 1],
            opacity: [0, 0.8, 1, 1],
          }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
