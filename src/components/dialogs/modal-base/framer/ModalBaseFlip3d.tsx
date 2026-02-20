import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import { overlayStyles } from '@/motion/primitives'

/**
 *
 */
export function ModalBaseFlip3d() {
  const duration = 0.8
  const ease = [0.175, 0.885, 0.32, 1] as const
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__flip-3d"
    >
      <div className="pf-modal-center pf-perspective">
        <m.div
          className="pf-modal"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateY: 180, scale: 0.65, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          transition={{ duration, ease }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
