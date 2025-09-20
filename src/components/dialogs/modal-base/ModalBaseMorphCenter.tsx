import React, { useEffect } from 'react';
import './modal-base.css';

export function ModalBaseMorphCenter() {
  useEffect(() => {
    // Trigger animation on mount
  }, []);

  return (
    <div 
      className="pf-modal-overlay"
      style={{
        '--animation-duration': '600ms',
        '--animation-easing': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        '--overlay-opacity': '0.68'
      } as React.CSSProperties}
    >
      <div 
        className="pf-modal"
        style={{
          animation: 'pf-modal-morph 600ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards'
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
  );
}