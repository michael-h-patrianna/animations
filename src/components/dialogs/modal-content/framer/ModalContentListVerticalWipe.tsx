import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import '../shared.css'
import './ModalContentListVerticalWipe.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'modal-content__list-vertical-wipe',
  title: 'List Vertical Wipe',
  description: 'Vertical panel wipe across 4 list items for crisp onboarding.',
  tags: ['framer']
}

export function ModalContentListVerticalWipe() {
  const shouldReduceMotion = useReducedMotion()
  const items = ['Introduction complete', 'Profile configured', 'Preferences set', 'Ready to begin']

  if (shouldReduceMotion) {
    return (
      <div className="modal-content-overlay">
        <div className="modal-content-modal">
          <div className="modal-content-header">
            <h4 className="modal-content-title">Setup Complete</h4>
            <span className="modal-content-badge">Modal</span>
          </div>
          <div className="modal-content-body">
            <div className="modal-content-list">
              {items.map((item, i) => (
                <div key={i} className="modal-content-list-item">{item}</div>
              ))}
            </div>
          </div>
          <div className="modal-content-footer">
            <button className="modal-content-button modal-content-button-primary">Continue</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-content-overlay">
      <motion.div className="modal-content-modal" initial={{ scale: 0.88, y: -16, opacity: 0 }} animate={{ scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }}>
        <div className="modal-content-header">
          <h4 className="modal-content-title">Setup Complete</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <div className="modal-content-list">
            {items.map((item, index) => (
              <motion.div key={index} className="modal-content-list-item" initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }} animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 + 0.1 * index, ease: [0.4, 0, 0.2, 1] }}>{item}</motion.div>
            ))}
          </div>
        </div>
        <div className="modal-content-footer">
          <motion.button className="modal-content-button modal-content-button-primary" initial={{ y: 16, scale: 0.94, opacity: 0 }} animate={{ y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }} transition={{ duration: 0.3, delay: 0.7, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}>Continue</motion.button>
        </div>
      </motion.div>
    </div>
  )
}
