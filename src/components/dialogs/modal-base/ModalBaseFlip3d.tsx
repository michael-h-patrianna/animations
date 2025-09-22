import React, { useEffect } from 'react'
import './ModalBaseFlip3d.css'

export function ModalBaseFlip3d() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--flip-3d"
      style={
        {
          '--animation-duration': '800ms',
          '--animation-easing': 'cubic-bezier(0.175, 0.885, 0.32, 1)',
          '--overlay-opacity': '0.76',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal pf-modal--flip-3d"
        style={{
          animation: 'pf-modal-flip-3d 800ms cubic-bezier(0.175, 0.885, 0.32, 1) forwards',
        }}
      >
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
      </div>
    </div>
  )
}
