import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import { overlayStyles } from '@/motion/primitives'

/**
 *
 */
export function ModalBaseSlideDownSoft() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__slide-down-soft"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ y: -60, scale: 0.92, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
