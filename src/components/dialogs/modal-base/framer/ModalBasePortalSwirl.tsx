import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import { overlayStyles } from '@/motion/primitives'

/**
 *
 */
export function ModalBasePortalSwirl() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__portal-swirl"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ rotate: 720, scale: 0, opacity: 0, borderRadius: '50%' }}
          animate={{ rotate: 0, scale: 1, opacity: 1, borderRadius: '12px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
