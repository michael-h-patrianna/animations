import * as m from 'motion/react-m'
/**
 *
 */ export function ModalContentListSpotlight() {
  const listItems = ['Milestone 1', 'Milestone 2', 'Milestone 3']
  return (
    <div className="modal-content-overlay" data-animation-id="modal-content__list-spotlight">
      <m.div className="modal-content-modal" initial={{ scale: 0.88, y: -16, opacity: 0 }} animate={{ scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }}>
        <div className="modal-content-header">
          <h4 className="modal-content-title">Sequence Control</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <div className="modal-content-list">
            {listItems.map((item, index) => (
              <m.div
                key={index}
                className="modal-content-list-item"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: [0.95, 1.02, 1], opacity: [0, 0.7, 1] }}
                transition={{ duration: 0.5, delay: 0.3 + 0.12 * index, ease: [0.4, 0, 0.2, 1], times: [0, 0.5, 1] }}
              >
                {item}
              </m.div>
            ))}
          </div>
        </div>
        <div className="modal-content-footer">
          <m.button
            className="modal-content-button modal-content-button-primary"
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{ y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.3, delay: 0.65, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}
          >
            Accept
          </m.button>
          <m.button
            className="modal-content-button modal-content-button-secondary"
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{ y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.3, delay: 0.72, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}
          >
            Later
          </m.button>
        </div>
      </m.div>
    </div>
  )
}
