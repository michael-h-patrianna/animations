import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__scale-gentle-pop',
  title: 'Gentle Scale Pop',
  description: 'Scale entrance from 88% up to 105% settling at 100% with 72% overlay fade and 12px→0px blur.',
  tags: ['framer'],
}

export function ModalBaseScaleGentlePop() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.72' } as CSSProperties}
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { duration: 0.42, ease: [0.12, 0.75, 0.4, 1] },
          }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
