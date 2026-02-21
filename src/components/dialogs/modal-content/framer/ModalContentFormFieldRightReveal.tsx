import * as m from 'motion/react-m'

/**
 *
 */
export function ModalContentFormFieldRightReveal() {
  return (
    <div className="modal-content-overlay" data-animation-id="modal-content__form-field-right-reveal">
      <m.div className="modal-content-modal" initial={{ scale: 0.88, y: -16, opacity: 0 }} animate={{ scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }}>
        <div className="modal-content-header">
          <h4 className="modal-content-title">Sequence Control</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <div className="modal-content-form">
            {[0, 1, 2, 3].map((index) => (
              <m.div key={index} className="modal-content-field" initial={{ x: 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 + 0.09 * index, ease: [0.4, 0, 0.2, 1] }}>
                <label>Field {index + 1}</label>
                <input type="text" defaultValue="Input" />
              </m.div>
            ))}
          </div>
        </div>
        <div className="modal-content-footer">
          <m.button className="modal-content-button modal-content-button-primary" initial={{ y: 16, scale: 0.94, opacity: 0 }} animate={{ y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }} transition={{ duration: 0.3, delay: 0.75, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}>Accept</m.button>
          <m.button className="modal-content-button modal-content-button-secondary" initial={{ y: 16, scale: 0.94, opacity: 0 }} animate={{ y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }} transition={{ duration: 0.3, delay: 0.82, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}>Later</m.button>
        </div>
      </m.div>
    </div>
  )
}
