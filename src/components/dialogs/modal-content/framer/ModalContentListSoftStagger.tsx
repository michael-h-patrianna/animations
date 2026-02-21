import * as m from 'motion/react-m'

/**
 *
 */
export function ModalContentListSoftStagger() {
const items = ['Privacy settings updated', 'Two-factor authentication enabled', 'Email notifications configured', 'Profile picture updated', 'Timezone set to UTC']
  return (
    <div className="modal-content-overlay" data-animation-id="modal-content__list-soft-stagger">
      <m.div className="modal-content-modal" initial={{ scale: 0.88, y: -16, opacity: 0 }} animate={{ scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }}>
        <div className="modal-content-header">
          <h4 className="modal-content-title">Recent Changes</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <div className="modal-content-list">
            {items.map((item, index) => (
              <m.div key={index} className="modal-content-list-item" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 + 0.06 * index, ease: [0.4, 0, 0.2, 1] }}>{item}</m.div>
            ))}
          </div>
        </div>
        <div className="modal-content-footer">
          <m.button className="modal-content-button modal-content-button-primary" initial={{ y: 16, scale: 0.94, opacity: 0 }} animate={{ y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }} transition={{ duration: 0.3, delay: 0.6, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}>Got it</m.button>
        </div>
      </m.div>
    </div>
  )
}
