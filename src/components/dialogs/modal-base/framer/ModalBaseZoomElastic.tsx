import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__zoom-elastic',
  title: 'Elastic Zoom Bounce',
  description: 'Mobile game style zoom with elastic bounce physics and overshoot.',
  tags: ['framer'],
}

export function ModalBaseZoomElastic() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.72, ease: [0.68, -0.55, 0.265, 1.55] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base__zoom-elastic"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.15, 0.95, 1.05, 1], opacity: [0, 1, 1, 1, 1] }}
          transition={{ duration: 0.72, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
