
export function MockModalContent() {
  return (
    <>
      <div className="pf-modal__header">
        <h3 className="pf-modal__title">New Creator Quest</h3>
        <span className="pf-badge-tech">Modal</span>
      </div>
      <div className="pf-modal__body">
        <p>Complete 3 live sessions to unlock rewards.</p>
      </div>
      <div className="pf-modal__footer">
        <button className="pf-button-primary">Accept</button>
        <button className="pf-button-secondary">Later</button>
      </div>
    </>
  )
}