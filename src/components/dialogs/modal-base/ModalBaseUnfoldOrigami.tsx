import React, { useEffect } from 'react';
import './modal-base.css';

export function ModalBaseUnfoldOrigami() {
  useEffect(() => {
    // Trigger animation on mount
  }, []);

  return (
    <div 
      className="pf-modal-overlay"
      style={{
        '--animation-duration': '900ms',
        '--animation-easing': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '--overlay-opacity': '0.68',
        perspective: '1000px'
      } as React.CSSProperties}
    >
      <div 
        className="pf-modal pf-modal--unfold"
        style={{
          animation: 'pf-modal-unfold 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d'
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